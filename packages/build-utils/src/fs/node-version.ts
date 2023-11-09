import { statSync } from 'fs';
import { intersects, validRange } from 'semver';
import { NodeVersion } from '../types';
import { NowBuildError } from '../errors';
import debug from '../debug';

function getOptions() {
  const options = [
    { major: 18, range: '18.x', runtime: 'nodejs18.x' },
    {
      major: 16,
      range: '16.x',
      runtime: 'nodejs16.x',
      discontinueDate: new Date('2024-02-06'),
    },
    {
      major: 14,
      range: '14.x',
      runtime: 'nodejs14.x',
      discontinueDate: new Date('2023-08-15'),
    },
    {
      major: 12,
      range: '12.x',
      runtime: 'nodejs12.x',
      discontinueDate: new Date('2022-10-03'),
    },
    {
      major: 10,
      range: '10.x',
      runtime: 'nodejs10.x',
      discontinueDate: new Date('2021-04-20'),
    },
    {
      major: 8,
      range: '8.10.x',
      runtime: 'nodejs8.10',
      discontinueDate: new Date('2020-01-06'),
    },
  ] as const;
  if (process.env.VERCEL_ALLOW_NODEJS20 === '1') {
    return [
      { major: 20, range: '20.x', runtime: 'nodejs20.x' },
      ...options,
    ] as const;
  }
  return options;
}

function isNodeVersionAvailable(version: NodeVersion): boolean {
  try {
    return statSync(`/node${version.major}`).isDirectory();
  } catch {
    // ENOENT, or any other error, we don't care about
  }
  return false;
}

export function getAvailableOptions() {
  return getOptions().filter(isNodeVersionAvailable);
}

function getHint(isAuto = false) {
  const { major, range } = getLatestNodeVersion();
  return isAuto
    ? `Please set Node.js Version to ${range} in your Project Settings to use Node.js ${major}.`
    : `Please set "engines": { "node": "${range}" } in your \`package.json\` file to use Node.js ${major}.`;
}

export function getLatestNodeVersion() {
  const all = getOptions();
  // Return the first node version that is definitely available
  // in the build-container. As a fallback for local `vc build`
  // and the tests, return the first node version if none is found.
  return all.find(isNodeVersionAvailable) ?? all[0];
}

export function getDiscontinuedNodeVersions(): NodeVersion[] {
  return getOptions().filter(isDiscontinued);
}

export async function getSupportedNodeVersion(
  engineRange: string | undefined,
  isAuto = false
): Promise<NodeVersion> {
  const availableNodeVersions = getAvailableOptions();
  let selection: NodeVersion | undefined;

  if (engineRange) {
    const found =
      validRange(engineRange) &&
      getOptions().some(o => {
        // the array is already in order so return the first
        // match which will be the newest version of node
        selection = o;
        return (
          intersects(o.range, engineRange) &&
          (availableNodeVersions.length > 0 ? isNodeVersionAvailable(o) : true)
        );
      });
    if (!found) {
      throw new NowBuildError({
        code: 'BUILD_UTILS_NODE_VERSION_INVALID',
        link: 'http://vercel.link/node-version',
        message: `Found invalid Node.js Version: "${engineRange}". ${getHint(
          isAuto
        )}`,
      });
    }
  }

  if (!selection) {
    selection = getLatestNodeVersion();
  }

  if (isDiscontinued(selection)) {
    const intro = `Node.js Version "${selection.range}" is discontinued and must be upgraded.`;
    throw new NowBuildError({
      code: 'BUILD_UTILS_NODE_VERSION_DISCONTINUED',
      link: 'http://vercel.link/node-version',
      message: `${intro} ${getHint(isAuto)}`,
    });
  }

  debug(`Selected Node.js ${selection.range}`);

  if (selection.discontinueDate) {
    const d = selection.discontinueDate.toISOString().split('T')[0];
    console.warn(
      `Error: Node.js version ${
        selection.range
      } has reached End-of-Life. Deployments created on or after ${d} will fail to build. ${getHint(
        isAuto
      )}`
    );
  }

  return selection;
}

function isDiscontinued({ discontinueDate }: NodeVersion): boolean {
  const today = Date.now();
  return discontinueDate !== undefined && discontinueDate.getTime() <= today;
}

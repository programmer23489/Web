import path from 'path';
import { NowError } from '../../util/now-error';
import { Output } from '../output';
import { Config } from '../../types';
import readPackage from '../read-package';

export default async function getAppName(output: Output, localConfigPath?: string, localConfig: Config) {
  // If the name is in the configuration, return it
  if (config.name) {
    return config.name;
  }

  // Otherwise try to get it from the package
  if (
    (!config.type || config.type === 'npm')
  ) {
    const pkg = await readPackage();

    if (!(pkg instanceof NowError) && pkg) {
      return pkg.name;
    }
  }

  // Finally fallback to directory
  return path.basename(path.resolve(process.cwd(), localConfigPath || ''));
}

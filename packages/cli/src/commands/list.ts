import chalk from 'chalk';
import ms from 'ms';
import table from 'text-table';
import Now from '../util';
import getArgs from '../util/get-args';
import { handleError } from '../util/error';
import cmd from '../util/output/cmd';
import logo from '../util/output/logo';
import elapsed from '../util/output/elapsed';
import strlen from '../util/strlen';
import toHost from '../util/to-host';
import parseMeta from '../util/parse-meta';
import { isValidName } from '../util/is-valid-name';
import getCommandFlags from '../util/get-command-flags';
import { getPkgName, getCommandName } from '../util/pkg-name';
import Client from '../util/client';
import { Deployment } from '../types';
import validatePaths from '../util/validate-paths';
import { getLinkedProject } from '../util/projects/link';
import { ensureLink } from '../util/link-project';
import getScope from '../util/get-scope';

const help = () => {
  console.log(`
  ${chalk.bold(`${logo} ${getPkgName()} list`)} [app]

  ${chalk.dim('Options:')}

    -h, --help                     Output usage information
    -A ${chalk.bold.underline('FILE')}, --local-config=${chalk.bold.underline(
    'FILE'
  )}   Path to the local ${'`vercel.json`'} file
    -Q ${chalk.bold.underline('DIR')}, --global-config=${chalk.bold.underline(
    'DIR'
  )}    Path to the global ${'`.vercel`'} directory
    -d, --debug                    Debug mode [off]
    -y, --yes                      Skip the confirmation prompt
    -t ${chalk.bold.underline('TOKEN')}, --token=${chalk.bold.underline(
    'TOKEN'
  )}        Login token
    -S, --scope                    Set a custom scope
    -m, --meta                     Filter deployments by metadata (e.g.: ${chalk.dim(
      '`-m KEY=value`'
    )}). Can appear many times.
    -N, --next                     Show next page of results

  ${chalk.dim('Examples:')}

  ${chalk.gray('–')} List all deployments for the currently linked project

    ${chalk.cyan(`$ ${getPkgName()} ls`)}

  ${chalk.gray(
    '–'
  )} List all projects in the scope (team) of the currently linked project

      ${chalk.cyan(`$ ${getPkgName()} ls --all`)}

    ${chalk.gray('–')} List all projects in team ${chalk.dim('`my-team`')}

      ${chalk.cyan(`$ ${getPkgName()} ls --scope my-team --all`)}

  ${chalk.gray('–')} List all deployments for the app ${chalk.dim(
    '`my-app`'
  )} in the currently linked project

    ${chalk.cyan(`$ ${getPkgName()} ls my-app`)}

  ${chalk.gray('–')} Filter deployments by metadata

    ${chalk.cyan(`$ ${getPkgName()} ls -m key1=value1 -m key2=value2`)}

  ${chalk.gray('–')} Paginate deployments for a project, where ${chalk.dim(
    '`1584722256178`'
  )} is the time in milliseconds since the UNIX epoch.

    ${chalk.cyan(`$ ${getPkgName()} ls my-app --next 1584722256178`)}
`);
};

export default async function main(client: Client) {
  let argv;

  try {
    argv = getArgs(client.argv.slice(2), {
      '--all': Boolean,
      '-a': '--all',
      '--meta': [String],
      '-m': '--meta',
      '--next': Number,
      '-N': '--next',
      '--yes': Boolean,
    });
  } catch (err) {
    handleError(err);
    return 1;
  }

  const { output, config } = client;

  const { print, log, error, note, debug, spinner } = output;

  if (argv._.length > 2) {
    error(`${getCommandName('ls [app]')} accepts at most one argument`);
    return 1;
  }

  if (argv['--help']) {
    help();
    return 2;
  }

  const all = argv['--all'];
  const yes = argv['--yes'] || false;

  const meta = parseMeta(argv['--meta']);
  const { includeScheme } = config;

  let paths = [process.cwd()];
  const pathValidation = await validatePaths(output, paths);
  if (!pathValidation.valid) {
    return pathValidation.exitCode;
  }

  const { path } = pathValidation;

  // retrieve `project` and `org` from .vercel
  let link = await getLinkedProject(client, path);

  if (link.status === 'error') {
    return link.exitCode;
  }

  let { org, project, status } = link;
  const appArg: string | undefined = argv._[1];
  let app: string | undefined = appArg || project?.name;
  let host: string | undefined = undefined;

  if (app && !isValidName(app)) {
    error(`The provided argument "${app}" is not a valid project name`);
    return 1;
  }

  // If there's no linked project and user doesn't pass `app` or `all` args,
  // prompt to link their current directory.
  if (status === 'not_linked' && !app && !all) {
    const linkedProject = await ensureLink('list', client, path, yes);
    if (typeof linkedProject === 'number') {
      return linkedProject;
    }
    link.org = linkedProject.org;
    link.project = linkedProject.project;
  }

  let { contextName, team } = await getScope(client);

  // If user passed in a custom scope, update the current team & context name
  if (argv['--scope']) {
    client.config.currentTeam = team?.id || undefined;
    if (team?.slug) contextName = team.slug;
  } else {
    client.config.currentTeam = org?.type === 'team' ? org.id : undefined;
    if (org?.slug) contextName = org.slug;
  }

  const { currentTeam } = config;

  try {
    ({ contextName } = await getScope(client));
  } catch (err) {
    if (err.code === 'NOT_AUTHORIZED' || err.code === 'TEAM_DELETED') {
      error(err.message);
      return 1;
    }

    throw err;
  }

  const nextTimestamp = argv['--next'];

  if (typeof nextTimestamp !== undefined && Number.isNaN(nextTimestamp)) {
    error('Please provide a number for flag `--next`');
    return 1;
  }

  spinner(`Fetching deployments in ${chalk.bold(contextName)}`);

  const now = new Now({
    client,
    currentTeam,
  });
  const start = Date.now();

  if (app && !isValidName(app)) {
    error(`The provided argument "${app}" is not a valid project name`);
    return 1;
  }

  // Some people are using entire domains as app names, so
  // we need to account for this here
  const asHost = app ? toHost(app) : '';
  if (asHost.endsWith('.now.sh') || asHost.endsWith('.vercel.app')) {
    note(
      `We suggest using ${getCommandName(
        'inspect <deployment>'
      )} for retrieving details about a single deployment`
    );

    const hostParts: string[] = asHost.split('-');

    if (hostParts.length < 2) {
      error('Only deployment hostnames are allowed, no aliases');
      return 1;
    }

    app = undefined;
    host = asHost;
  }

  debug('Fetching deployments');

  const response = await now.list(all ? undefined : app, {
    version: 6,
    meta,
    nextTimestamp,
  });

  let {
    deployments,
    pagination,
  }: {
    deployments: Deployment[];
    pagination: { count: number; next: number };
  } = response;

  if (app && !all && !deployments.length) {
    debug(
      'No deployments: attempting to find deployment that matches supplied app name'
    );
    let match;

    try {
      await now.findDeployment(app);
    } catch (err) {
      if (err.status === 404) {
        debug('Ignore findDeployment 404');
      } else {
        throw err;
      }
    }

    if (match !== null && typeof match !== 'undefined') {
      debug('Found deployment that matches app name');
      deployments = Array.of(match);
    }
  }

  now.close();

  if (host) {
    deployments = deployments.filter(deployment => deployment.url === host);
  }

  // we don't output the table headers if we have no deployments
  if (!deployments.length) {
    log(`No deployments found.`);
    return 0;
  }

  log(
    `Deployments under ${chalk.bold(contextName)} ${elapsed(
      Date.now() - start
    )}`
  );

  // information to help the user find other deployments or instances
  if (app == null) {
    log(
      `To list more deployments for a project run ${cmd(
        `${getCommandName('ls [project]')}`
      )}`
    );
  }

  print('\n');

  client.output.print(
    `${table(
      [
        ['project', 'latest deployment', 'state', 'age', 'username'].map(
          header => chalk.dim(header)
        ),
        ...deployments
          .sort(sortRecent())
          .map(dep => [
            [
              getProjectName(dep),
              chalk.bold((includeScheme ? 'https://' : '') + dep.url),
              stateString(dep.state),
              chalk.gray(ms(Date.now() - dep.createdAt)),
              dep.creator.username,
            ],
          ])
          // flatten since the previous step returns a nested
          // array of the deployment and (optionally) its instances
          .flat()
          .filter(app =>
            // if an app wasn't supplied to filter by,
            // we only want to render one deployment per app
            app === null ? filterUniqueApps() : () => true
          ),
      ],
      {
        align: ['l', 'l', 'r', 'l', 'l'],
        hsep: ' '.repeat(4),
        stringLength: strlen,
      }
    ).replace(/^/gm, '  ')}\n`
  );

  if (pagination && pagination.count === 20) {
    const flags = getCommandFlags(argv, ['_', '--next']);
    log(
      `To display the next page run ${getCommandName(
        `ls${app ? ' ' + app : ''}${flags} --next ${pagination.next}`
      )}`
    );
  }
}

function getProjectName(d: Deployment) {
  // We group both file and files into a single project
  if (d.name === 'file') {
    return 'files';
  }

  return d.name;
}

// renders the state string
export function stateString(s: string) {
  switch (s) {
    case 'INITIALIZING':
      return chalk.yellow(s);

    case 'ERROR':
      return chalk.red(s);

    case 'READY':
      return s;

    default:
      return chalk.gray('UNKNOWN');
  }
}

// sorts by most recent deployment
function sortRecent() {
  return function recencySort(a: Deployment, b: Deployment) {
    return b.createdAt - a.createdAt;
  };
}

// filters only one deployment per app, so that
// the user doesn't see so many deployments at once.
// this mode can be bypassed by supplying an app name
function filterUniqueApps() {
  const uniqueApps = new Set();
  return function uniqueAppFilter([appName]: [appName: string]) {
    if (uniqueApps.has(appName)) {
      return false;
    }
    uniqueApps.add(appName);
    return true;
  };
}

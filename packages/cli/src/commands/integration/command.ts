import { packageName } from '../../util/pkg-name';

export const addSubCommand = {
  name: 'add',
  description: 'Installs a marketplace integration',
  arguments: [
    {
      name: 'name',
      required: true,
    },
  ],
  options: [],
  examples: [
    {
      name: 'Install a marketplace integration',
      value: [
        `${packageName} integration add <integration-name>`,
        `${packageName} integration add acme`,
      ],
    },
  ],
} as const;

export const listSubcommand = {
  name: 'list',
  description: 'Lists all resources from marketplace integrations',
  arguments: [],
  options: [
    {
      name: 'integration',
      description: 'limits the resources listed to a designated integration',
      shorthand: 'i',
      type: String,
      deprecated: false,
      argument: 'NAME',
    },
    {
      name: 'currentProject',
      description: 'limits the resources listed to the current project',
      shorthand: 'p',
      type: Boolean,
      deprecated: false,
    },
  ],
  examples: [
    {
      name: 'List all resources',
      value: [`${packageName} integrations list`],
    },
    {
      name: 'List all resources from a single integration',
      value: [
        `${packageName} integrations list --integration <integration>`,
        `${packageName} integrations list --integration acme`,
        `${packageName} integrations list -i acme`,
      ],
    },
    {
      name: 'List all resources from the current project',
      value: [
        `${packageName} integrations list --currentProject`,
        `${packageName} integrations list -p`,
      ],
    },
  ],
} as const;

export const integrationCommand = {
  name: 'integration',
  description: 'Manage marketplace integrations',
  options: [],
  arguments: [
    {
      name: 'command',
      required: true,
    },
  ],
  subcommands: [addSubCommand, listSubcommand],
  examples: [],
} as const;

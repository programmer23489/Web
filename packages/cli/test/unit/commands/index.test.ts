import { describe, it, expect } from 'vitest';
import { getAliasMap } from '../../../src/commands';
describe('index', () => {
  it('outputs a map of what aliases our commands use', () => {
    expect(getAliasMap()).toEqual(
      new Map([
        ['alias', 'alias'],
        ['aliases', 'alias'],
        ['bisect', 'bisect'],
        ['build', 'build'],
        ['cert', 'certs'],
        ['certs', 'certs'],
        ['deploy', 'deploy'],
        ['dev', 'dev'],
        ['develop', 'dev'],
        ['dns', 'dns'],
        ['domain', 'domains'],
        ['domains', 'domains'],
        ['env', 'env'],
        ['git', 'git'],
        ['help', 'help'],
        ['i', 'install'],
        ['init', 'init'],
        ['inspect', 'inspect'],
        ['install', 'install'],
        ['integration', 'integration'],
        ['integration-resource', 'integration-resource'],
        ['ir', 'integration-resource'],
        ['link', 'link'],
        ['list', 'list'],
        ['ln', 'alias'],
        ['log', 'logs'],
        ['login', 'login'],
        ['logout', 'logout'],
        ['logs', 'logs'],
        ['ls', 'list'],
        ['project', 'project'],
        ['projects', 'project'],
        ['promote', 'promote'],
        ['pull', 'pull'],
        ['redeploy', 'redeploy'],
        ['remove', 'remove'],
        ['rm', 'remove'],
        ['rollback', 'rollback'],
        ['switch', 'teams'],
        ['target', 'target'],
        ['targets', 'target'],
        ['team', 'teams'],
        ['teams', 'teams'],
        ['telemetry', 'telemetry'],
        ['whoami', 'whoami'],
      ])
    );
  });
});

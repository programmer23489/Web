import { types as nodeUtils } from 'node:util';
import retry from 'async-retry';
import type { Cert } from '@vercel-internals/types';
import Client from '../client';
import { isAPIError } from '../errors-ts';

// When it's a configuration error we should retry because of the DNS propagation
// otherwise we bail to handle the error in the upper level
export default async function issueCert(client: Client, cns: string[]) {
  return retry(
    async bail => {
      try {
        return await client.fetch<Cert>('/v3/now/certs', {
          method: 'POST',
          body: { domains: cns },
        });
      } catch (err: unknown) {
        if (isAPIError(err) && err.code === 'configuration_error') {
          throw err;
        } else if (nodeUtils.isNativeError(err)) {
          bail(err);
        } else {
          throw err;
        }
      }
    },
    { retries: 3, minTimeout: 5000, maxTimeout: 15000 }
  ) as Promise<Cert>;
}

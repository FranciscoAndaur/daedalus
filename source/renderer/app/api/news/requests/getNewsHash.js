// @flow
import { externalRequest } from '../../utils/externalRequest';
import { getNewsHashURL } from '../../../utils/network';

const { isCatalyst, isFlight, environment } = global;
const { network } = environment;
const hostname = getNewsHashURL(network);

let path = `/newsfeed-verification/${network}`;
if (isCatalyst) path = '/newsfeed-verification/catalyst';
if (isFlight) path = '/newsfeed-verification/mainnet_flight';

export const getNewsHash = (timestamp: number): Promise<string> =>
  externalRequest(
    {
      hostname,
      path: `${path}/${timestamp}.txt`,
      method: 'GET',
      protocol: 'https',
    },
    true
  );

import { CollectionTokenAttribute } from '@airswap/utils/build/src/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';
import {
  transformToCollectionTokenAttribute,
} from '../../../entities/CollectionTokenAttribute/CollectionTokenAttributeTransformers';
import { getUniqueSingleDimensionArray } from '../../../helpers/array';
import { getUndefinedAfterTimeout } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { getServers } from '../indexer/indexerHelpers';

interface GetTagOptionsParams {
  indexerUrls: string[],
  collectionToken: string;
}

export const getTagOptions = createAsyncThunk<
CollectionTokenAttribute[],
GetTagOptionsParams,
AppThunkApiConfig
>('filters/getTagOptions', async ({ indexerUrls, collectionToken }) => {
  const servers = await getServers(indexerUrls);

  if (!servers.length) {
    console.error('[sendOrderToIndexers] No indexer servers provided');
  }

  const responses = await Promise.all(
    servers.map(server => Promise.race([
      server.getTags(collectionToken),
      getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
    ])),
  );

  const options = responses
    .filter(Array.isArray)
    .flat()
    .filter(getUniqueSingleDimensionArray)
    .sort() as string[];

  return options.map(transformToCollectionTokenAttribute);
});

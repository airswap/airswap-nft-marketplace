import { useEffect, useState } from 'react';

import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { useDebounce } from 'react-use';

import { useAppDispatch } from '../redux/hooks';

export const useGetOrders = (
  activeTags: string[],
  getOrders: (offset: number) => void,
  reset: ActionCreatorWithoutPayload<'profileOrders/reset' | 'collection/reset'>,
  startLoading: ActionCreatorWithoutPayload<'profileOrders/startLoading' | 'collection/startLoading'>,
) => {
  const dispatch = useAppDispatch();

  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTagsState, setActiveTagsState] = useState(activeTags);

  useEffect(() => {
    getOrders(0);
  }, [activeTagsState]);

  useDebounce(() => {
    setActiveTagsState(activeTags);
  }, 500, [activeTags]);

  useEffect(() => {
    if (isInitialized) {
      dispatch(reset());
      dispatch(startLoading());
    }

    setIsInitialized(true);
  }, [activeTags]);

  useEffect((): () => void => () => dispatch(reset()), []);
};

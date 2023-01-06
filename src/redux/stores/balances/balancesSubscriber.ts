import { store } from '../../store';
import { Web3State } from '../web3/web3Slice';

export const configureBalancesSubscriber = () => {
  let account: Web3State['account'];

  store.subscribe(() => {
    const { web3 } = store.getState();
    if (web3.account !== account) {
      account = web3.account;
      // TODO: dispatch to fetch balances with asyncThunk
      // store.dispatch(fetchBalances());
    }
  });
};

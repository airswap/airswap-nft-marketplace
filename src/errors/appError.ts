import { EthersProjectError } from './ethersProjectError';
import { NumericFaultError } from './numericFaultError';
import { RpcError } from './rpcError';
import { RpcSignRejectedError } from './rpcSignRejectedError';

export enum AppErrorType {
  approveCallerIsNotOwner = 'approveCallerIsNotOwner',
  arithmeticUnderflow = 'arithmeticUnderflow',
  chainDisconnected = 'chainDisconnected',
  disconnected = 'disconnected',
  expiryPassed = 'expiryPassed',
  invalidAddress = 'invalidAddress',
  invalidInput = 'invalidInput',
  invalidRequest = 'invalidRequest',
  invalidValue = 'invalidValue',
  networkError = 'networkError',
  nonceAlreadyUsed = 'nonceAlreadyUsed',
  notFound = 'notFound',
  orderIndexFailed = 'orderIndexFailed',
  rejectedByUser = 'rejectedByUser',
  senderAllowanceLow = 'senderAllowanceLow',
  senderBalanceLow = 'senderBalanceLow',
  signerAllowanceLow = 'signerAllowanceLow',
  signerBalanceLow = 'signerBalanceLow',
  signatureInvalid = 'signatureInvalid',
  unauthorized = 'unauthorized',
  unknownError = 'unknownError',
  unpredictableGasLimit = 'unpredictableGasLimit',
  unsupportedMethod = 'unsupportedMethod',
}

export type AppError = {
  argument?: string;
  error?:
  | RpcError
  | RpcSignRejectedError
  | EthersProjectError
  | NumericFaultError;
  type: AppErrorType;
};

export const isAppError = (x: any): x is AppError => (
  typeof x === 'object'
    && x !== null
    && 'type' in x
    && Object.values(AppErrorType).includes(x.type)
);

export function transformToAppError(
  type: AppErrorType,
  error?: AppError['error'],
  argument?: string,
): AppError {
  return {
    argument,
    error,
    type,
  };
}

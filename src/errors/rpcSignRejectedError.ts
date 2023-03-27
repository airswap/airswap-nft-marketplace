import { AppError, AppErrorType, transformToAppError } from './appError';

// Another error format coming from ethersproject (yay), gets thrown when error rejects a transaction

export interface RpcSignRejectedError {
  reason: string;
  code: 'ACTION_REJECTED';
  action: any;
  from: string;
  messageData: any;
}

export const isRpcSignRejectedError = (
  error: any,
): error is RpcSignRejectedError => (
  typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'ACTION_REJECTED'
    && 'reason' in error
);

export const transformRpcSignRejectedErrorToAppError = (
  error: RpcSignRejectedError,
): AppError =>
  // For now we have only one error for this format. Might add more later.
  // eslint-disable-next-line implicit-arrow-linebreak
  transformToAppError(AppErrorType.rejectedByUser, error);

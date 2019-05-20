export interface IPromiseWithAbortController<T> {
    promise: Promise<T>;
    abortController: AbortController;
}

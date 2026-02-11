export const PAGE_LOAD_NAMESPACE = 'pageLoad';

export interface IPageLoadState {
    criticalLoadingCount: number;
    progressPercent: number;
    visible: boolean;
}

export interface IPermissionStrategy {
    canRead(): boolean;
    canWrite(): boolean;
    canDelete(): boolean;
    canShare(): boolean;
}

import { IPermissionStrategy } from "./IPermissionStrategy";

export class OwnerStrategy implements IPermissionStrategy {
    canRead(): boolean { return true; }
    canWrite(): boolean { return true; }
    canDelete(): boolean { return true; }
    canShare(): boolean { return true; }
}
export class ViewerStrategy implements IPermissionStrategy {
    canRead(): boolean { return true; }
    canWrite(): boolean { return false; }
    canDelete(): boolean { return false; }
    canShare(): boolean { return false; }
}
export class EditorStrategy implements IPermissionStrategy {
    canRead(): boolean { return true; }
    canWrite(): boolean { return true; }
    canDelete(): boolean { return false; }
    canShare(): boolean { return false; }
}
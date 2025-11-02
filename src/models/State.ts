import { IFileState } from "../interfaces/IFileState";

export class IdleState implements IFileState {
    canEdit(): boolean { return true; }
    canDelete(): boolean { return true; }
    getName(): string { return 'idle'; }
}


export class OpenState implements IFileState {
    canEdit(): boolean { return true; }
    canDelete(): boolean { return false; }
    getName(): string { return 'open'; }
}


export class EditingState implements IFileState {
    canEdit(): boolean { return true; }
    canDelete(): boolean { return false; }
    getName(): string { return 'editing'; }
}

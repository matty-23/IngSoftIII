
export interface IFileState {
    canEdit(): boolean;
    canDelete(): boolean;
    getName(): string;
}

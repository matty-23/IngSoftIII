export interface FileCreatedEvent {
    fileId: string;
    fileName: string;
    userId: string;
    timestamp: Date;
}
export interface FileSavedEvent {
    fileId: string;
    fileName: string;
    userId: string;
    content: string;
    timestamp: Date;
}

export interface FileSharedEvent {
    fileId: string;
    fileName: string;
    sharedWith: string;
    role: string;
    sharedBy: string;
    timestamp: Date;
}

export interface FileDeletedEvent {
    fileId: string;
    fileName: string;
    userId: string;
    timestamp: Date;
}
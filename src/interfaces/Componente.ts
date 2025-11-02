
export interface Componente{
        id : string;
        name:string;
        getSize(): number;
        getType(): 'file' | 'folder';
}
    


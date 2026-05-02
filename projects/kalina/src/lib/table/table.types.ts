export interface KnTableCellEvent {
    value: any;
    item: unknown;
    colDef: KnColDef;
}

export interface KnColDef {
    field: string;
    name: string;
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    headerCellClass?: string | string[];
    cellClass?: string | string[];
    position?: KnColumnPosition;
    sortable?: boolean;
    sortFn?: (paramA: any, paramB: any) => number;
    valueFormatter?: (event: KnTableCellEvent) => any;
    cellRenderer?: (event: KnTableCellEvent) => string;
    getCellClass?: (event: KnTableCellEvent) => string | string[] | null;
    getCellStyle?: (event: KnTableCellEvent) => KnCellStyle;
}

export type KnDefaultColDef = Omit<KnColDef, 'field' | 'name'>;

export type KnRow = {[key: string]: unknown | KnRow[]};
export type KnSortDirection = 'descend' | 'ascend' | null;
export type KnColumnPosition = 'left' | 'right' | (string & {});
export type KnCellStyle = {[klass: string]: any;} | null;
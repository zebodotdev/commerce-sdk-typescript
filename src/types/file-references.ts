export type FileReferenceKind = 'file' | 'file_link' | string;

export interface FileReferenceInput {
  fileId: string;
  field: string;
  reference?: string;
  referenceKind?: FileReferenceKind;
  purpose?: string;
}

export interface FileReferenceReconcileRequest {
  resourceType: string;
  resourceId: string;
  references?: FileReferenceInput[];
}

export interface FileReferenceReconciliation {
  reconciled?: boolean;
  error?: FileReferenceError;
}

export interface FileReferenceError {
  type?: string;
  code?: string;
  message?: string;
  fixCode?: string;
}

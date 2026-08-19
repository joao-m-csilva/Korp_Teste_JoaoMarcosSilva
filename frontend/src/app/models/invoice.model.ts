export interface InvoiceItem {
  id?: number;
  invoiceId?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: number;
  number: number;
  date: string;
  total_Value: number;
  status: 'Aberta' | 'Fechada' | string;
  items: InvoiceItem[];
}

export interface CreateInvoiceItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceDto {
  number?: number;
  items: CreateInvoiceItemDto[];
}

export interface PrintInvoiceResponse {
  message: string;
  invoice: Invoice;
}

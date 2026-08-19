import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateInvoiceDto, Invoice, PrintInvoiceResponse } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly baseUrl = 'http://localhost:7077/api/invoices';

  constructor(private readonly http: HttpClient) {}

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  createInvoice(dto: CreateInvoiceDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, dto);
  }

  printInvoice(id: number): Observable<PrintInvoiceResponse> {
    return this.http.post<PrintInvoiceResponse>(`${this.baseUrl}/${id}/print`, {});
  }
}

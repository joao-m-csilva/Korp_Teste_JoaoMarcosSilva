import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly productsCount = signal(0);
  protected readonly openInvoicesCount = signal(0);
  protected readonly closedInvoicesCount = signal(0);
  protected readonly totalRevenue = signal(0);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  constructor(
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productsCount.set(products.length);
      },
      error: () => {
        this.errorMessage.set('Serviço de Estoque indisponível no momento.');
      },
    });

    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        const open = invoices.filter((n) => n.status === 'Aberta').length;
        const closed = invoices.filter((n) => n.status === 'Fechada').length;
        const revenue = invoices
          .filter((n) => n.status === 'Fechada')
          .reduce((acc, curr) => acc + (curr.total_Value || 0), 0);
        this.openInvoicesCount.set(open);
        this.closedInvoicesCount.set(closed);
        this.totalRevenue.set(revenue);
      },
      error: () => {
        this.errorMessage.set('Serviço de Faturamento indisponível no momento.');
      },
    });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
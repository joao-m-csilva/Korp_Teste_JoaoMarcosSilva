import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import { ProductService } from '../services/product.service';
import { CreateInvoiceDto, CreateInvoiceItemDto, Invoice } from '../models/invoice.model';
import { Product } from '../models/product.model';

export type TabFilter = 'all' | 'open' | 'closed';

export interface DraftItem {
  productId: number;
  productDescription: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  availableStock: number;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices implements OnInit {
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly activeTab = signal<TabFilter>('all');
  protected readonly search = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly printingInvoiceId = signal<number | null>(null);
  protected readonly printErrorMessage = signal('');

  protected readonly invoiceDetails = signal<Invoice | null>(null);

  protected readonly isNewInvoiceModalOpen = signal(false);
  protected readonly isSavingInvoice = signal(false);
  protected readonly modalErrorMessage = signal('');
  protected readonly draftItems = signal<DraftItem[]>([]);

  protected selectedProductId: number | null = null;
  protected itemQuantity: number | null = 1;
  protected itemUnitPrice: number | null = null;

  private readonly integerUnits = new Set(['UN', 'PC', 'CX']);

  protected readonly totalOpen = computed(
    () => this.invoices().filter((n) => n.status === 'Aberta').length,
  );
  protected readonly totalClosed = computed(
    () => this.invoices().filter((n) => n.status === 'Fechada').length,
  );

  protected readonly draftTotal = computed(() => {
    return this.draftItems().reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  });

  protected readonly filteredInvoices = computed(() => {
    const term = this.search().trim();
    const tab = this.activeTab();

    return this.invoices().filter((invoice) => {
      if (tab === 'open' && invoice.status !== 'Aberta') return false;
      if (tab === 'closed' && invoice.status !== 'Fechada') return false;

      if (term && !String(invoice.number).includes(term)) return false;

      return true;
    });
  });

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar as notas fiscais.');
        this.isLoading.set(false);
      },
    });

    this.productService.getProducts().subscribe({
      next: (prods) => this.products.set(prods),
      error: () => {
        this.errorMessage.set('Serviço de estoque indisponível no momento.');
      },
    });
  }

  openNewInvoiceModal(): void {
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products.set(prods);
      },
      error: () => {
        this.modalErrorMessage.set(
          'Serviço de estoque indisponível no momento. É possível realizar o cadastro da NF, mas a impressão só será realizada depois do restabelecimento do serviço de estoque.',
        );
        this.isLoading.set(false);
      },
    });

    this.draftItems.set([]);
    this.selectedProductId = null;
    this.itemQuantity = 1;
    this.itemUnitPrice = null;
    this.modalErrorMessage.set('');
    this.isNewInvoiceModalOpen.set(true);
  }

  closeNewInvoiceModal(): void {
    if (this.isSavingInvoice()) return;
    this.isNewInvoiceModalOpen.set(false);
    this.modalErrorMessage.set('');
  }

  addDraftItem(): void {
    if (!this.selectedProductId) {
      this.modalErrorMessage.set('Selecione um produto.');
      return;
    }

    const product = this.products().find(
      (p) => p.id === Number(this.selectedProductId),
    );
    if (!product) {
      this.modalErrorMessage.set('Produto não encontrado.');
      return;
    }

    const qty = Number(this.itemQuantity);
    if (!qty || isNaN(qty) || qty <= 0) {
      this.modalErrorMessage.set('Informe uma quantidade maior que zero.');
      return;
    }

    if (this.integerUnits.has(product.unit) && qty % 1 !== 0) {
      this.modalErrorMessage.set(
        `A unidade '${product.unit}' aceita apenas quantidades inteiras.`,
      );
      return;
    }

    const price = Number(this.itemUnitPrice);
    if (this.itemUnitPrice === null || isNaN(price) || price <= 0) {
      this.modalErrorMessage.set('Informe um valor unitário maior que zero.');
      return;
    }

    const existingItem = this.draftItems().find(
      (i) => i.productId === product.id,
    );
    const alreadyAddedQty = existingItem ? existingItem.quantity : 0;
    const totalQty = alreadyAddedQty + qty;

    if (totalQty > product.balance) {
      this.modalErrorMessage.set(
        `Quantidade solicitada (${totalQty}) maior que o saldo em estoque (${product.balance}).`,
      );
      return;
    }

    this.modalErrorMessage.set('');

    if (existingItem) {
      this.draftItems.update((items) =>
        items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: totalQty, unitPrice: price }
            : i,
        ),
      );
    } else {
      this.draftItems.update((items) => [
        ...items,
        {
          productId: product.id,
          productDescription: product.description,
          unit: product.unit,
          quantity: qty,
          unitPrice: price,
          availableStock: product.balance,
        },
      ]);
    }

    this.selectedProductId = null;
    this.itemQuantity = 1;
    this.itemUnitPrice = null;
  }

  removeDraftItem(productId: number): void {
    this.draftItems.update((items) =>
      items.filter((i) => i.productId !== productId),
    );
    this.modalErrorMessage.set('');
  }

  saveInvoice(): void {
    const items = this.draftItems();
    if (items.length === 0) {
      this.modalErrorMessage.set('Adicione pelo menos um item na nota fiscal.');
      return;
    }

    this.isSavingInvoice.set(true);
    this.modalErrorMessage.set('');

    const payload: CreateInvoiceDto = {
      items: items.map(
        (i): CreateInvoiceItemDto => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        }),
      ),
    };

    this.invoiceService.createInvoice(payload).subscribe({
      next: (createdInvoice) => {
        this.invoices.update((list) => [createdInvoice, ...list]);
        this.isSavingInvoice.set(false);
        this.isNewInvoiceModalOpen.set(false);
        this.successMessage.set(
          `Nota Fiscal Nº ${createdInvoice.number} emitida com sucesso (Situação: Aberta).`,
        );
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err) => {
        this.isSavingInvoice.set(false);
        let msg = 'Erro ao criar nota fiscal. Verifique os dados e tente novamente.';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.errors) {
          const errList = Object.values(err.error.errors).flat();
          if (errList.length > 0) {
            msg = errList.join(', ');
          }
        } else if (err.error?.title) {
          msg = err.error.title;
        }
        this.modalErrorMessage.set(msg);
      },
    });
  }

  openDetails(invoice: Invoice): void {
    this.invoiceDetails.set(invoice);
    this.printErrorMessage.set('');
  }

  closeDetails(): void {
    this.invoiceDetails.set(null);
    this.printErrorMessage.set('');
  }

  printInvoice(invoiceId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const invoice = this.invoices().find((n) => n.id === invoiceId);
    if (!invoice || invoice.status !== 'Aberta') {
      return;
    }

    this.printingInvoiceId.set(invoiceId);
    this.printErrorMessage.set('');
    this.successMessage.set('');

    this.invoiceService.printInvoice(invoiceId).subscribe({
      next: (resp) => {
        this.printingInvoiceId.set(null);

        this.invoices.update((list) =>
          list.map((n) =>
            n.id === invoiceId
              ? { ...n, ...resp.invoice, status: 'Fechada' }
              : n,
          ),
        );

        if (this.invoiceDetails()?.id === invoiceId) {
          this.invoiceDetails.set({
            ...this.invoiceDetails()!,
            ...resp.invoice,
            status: 'Fechada',
          });
        }

        this.productService.getProducts().subscribe({
          next: (prods) => this.products.set(prods),
        });

        this.successMessage.set(
          `Nota Fiscal Nº ${invoice.number} finalizada (Fechada) e estoque consumido com sucesso!`,
        );
        setTimeout(() => this.successMessage.set(''), 5000);

        setTimeout(() => window.print(), 200);
      },
      error: (err) => {
        this.printingInvoiceId.set(null);
        let msg = 'Erro ao processar a impressão da nota fiscal.';
        if (err.status === 503) {
          msg =
            'Serviço de estoque indisponível no momento. Não foi possível baixar o estoque.';
        } else if (err.error?.message) {
          msg = err.error.message;
        } else if (typeof err.error === 'string') {
          try {
            const parsed = JSON.parse(err.error);
            msg = parsed.message || err.error;
          } catch {
            msg = err.error;
          }
        }
        this.printErrorMessage.set(msg);
      },
    });
  }

  protected getProductDescription(productId: number): string {
    const prod = this.products().find((p) => p.id === productId);
    return prod ? prod.description : `Produto ID ${productId}`;
  }

  protected getProductUnit(productId: number): string {
    const prod = this.products().find((p) => p.id === productId);
    return prod ? prod.unit : 'UN';
  }

  protected formatDate(date: string): string {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  }
}

import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { InvoiceService } from '../services/invoice.service';
import { ProductService } from '../services/product.service';
import { CreateInvoiceDto, CreateInvoiceItemDto, Invoice } from '../models/invoice.model';
import { Product } from '../models/product.model';

type TabFiltro = 'todas' | 'abertas' | 'fechadas';

interface ItemRascunho {
  productId: number;
  productDescription: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  availableStock: number;
}

@Component({
  selector: 'app-notas-fiscais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notas-fiscais.html',
  styleUrl: './notas-fiscais.css',
})
export class NotasFiscais implements OnInit {
  protected readonly notas = signal<Invoice[]>([]);
  protected readonly produtos = signal<Product[]>([]);
  protected readonly abaAtiva = signal<TabFiltro>('todas');
  protected readonly busca = signal('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');

  protected readonly idProcessandoImpressao = signal<number | null>(null);
  protected readonly erroImpressao = signal('');

  protected readonly notaDetalhes = signal<Invoice | null>(null);

  protected readonly modalNovaNotaAberto = signal(false);
  protected readonly salvandoNota = signal(false);
  protected readonly erroModalNota = signal('');
  protected readonly itensRascunho = signal<ItemRascunho[]>([]);

  protected produtoSelecionadoId: number | null = null;
  protected quantidadeItem: number | null = 1;
  protected precoUnitarioItem: number | null = null;

  private readonly integerUnits = new Set(['UN', 'PC', 'CX']);

  protected readonly totalAbertas = computed(
    () => this.notas().filter((n) => n.status === 'Aberta').length,
  );
  protected readonly totalFechadas = computed(
    () => this.notas().filter((n) => n.status === 'Fechada').length,
  );

  protected readonly totalRascunho = computed(() => {
    return this.itensRascunho().reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  });

  protected readonly notasFiltradas = computed(() => {
    const termo = this.busca().trim();
    const aba = this.abaAtiva();

    return this.notas().filter((nota) => {
      if (aba === 'abertas' && nota.status !== 'Aberta') return false;
      if (aba === 'fechadas' && nota.status !== 'Fechada') return false;

      if (termo && !String(nota.number).includes(termo)) return false;

      return true;
    });
  });

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    this.erro.set('');

    forkJoin({
      notas: this.invoiceService.getInvoices(),
      produtos: this.productService.getProducts(),
    }).subscribe({
      next: ({ notas, produtos }) => {
        this.notas.set(notas);
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível carregar as notas fiscais ou o catálogo de produtos.',
        );
        this.carregando.set(false);
      },
    });
  }

  abrirModalNovaNota(): void {
    this.productService.getProducts().subscribe({
      next: (prods) => this.produtos.set(prods),
    });

    this.itensRascunho.set([]);
    this.produtoSelecionadoId = null;
    this.quantidadeItem = 1;
    this.precoUnitarioItem = null;
    this.erroModalNota.set('');
    this.modalNovaNotaAberto.set(true);
  }

  fecharModalNovaNota(): void {
    if (this.salvandoNota()) return;
    this.modalNovaNotaAberto.set(false);
    this.erroModalNota.set('');
  }

  adicionarItemRascunho(): void {
    if (!this.produtoSelecionadoId) {
      this.erroModalNota.set('Selecione um produto.');
      return;
    }

    const produto = this.produtos().find(
      (p) => p.id === Number(this.produtoSelecionadoId),
    );
    if (!produto) {
      this.erroModalNota.set('Produto não encontrado.');
      return;
    }

    const qtd = Number(this.quantidadeItem);
    if (!qtd || isNaN(qtd) || qtd <= 0) {
      this.erroModalNota.set('Informe uma quantidade maior que zero.');
      return;
    }

    if (this.integerUnits.has(produto.unit) && qtd % 1 !== 0) {
      this.erroModalNota.set(
        `A unidade '${produto.unit}' aceita apenas quantidades inteiras.`,
      );
      return;
    }

    const preco = Number(this.precoUnitarioItem);
    if (this.precoUnitarioItem === null || isNaN(preco) || preco <= 0) {
      this.erroModalNota.set('Informe um valor unitário maior que zero.');
      return;
    }

    const itemExistente = this.itensRascunho().find(
      (i) => i.productId === produto.id,
    );
    const qtdJaAdicionada = itemExistente ? itemExistente.quantity : 0;
    const qtdTotal = qtdJaAdicionada + qtd;

    if (qtdTotal > produto.balance) {
      this.erroModalNota.set(
        `Quantidade solicitada (${qtdTotal}) maior que o saldo em estoque (${produto.balance}).`,
      );
      return;
    }

    this.erroModalNota.set('');

    if (itemExistente) {
      this.itensRascunho.update((itens) =>
        itens.map((i) =>
          i.productId === produto.id
            ? { ...i, quantity: qtdTotal, unitPrice: preco }
            : i,
        ),
      );
    } else {
      this.itensRascunho.update((itens) => [
        ...itens,
        {
          productId: produto.id,
          productDescription: produto.description,
          unit: produto.unit,
          quantity: qtd,
          unitPrice: preco,
          availableStock: produto.balance,
        },
      ]);
    }

    this.produtoSelecionadoId = null;
    this.quantidadeItem = 1;
    this.precoUnitarioItem = null;
  }

  removerItemRascunho(productId: number): void {
    this.itensRascunho.update((itens) =>
      itens.filter((i) => i.productId !== productId),
    );
    this.erroModalNota.set('');
  }

  salvarNotaFiscal(): void {
    const itens = this.itensRascunho();
    if (itens.length === 0) {
      this.erroModalNota.set('Adicione pelo menos um item na nota fiscal.');
      return;
    }

    this.salvandoNota.set(true);
    this.erroModalNota.set('');

    const payload: CreateInvoiceDto = {
      items: itens.map(
        (i): CreateInvoiceItemDto => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        }),
      ),
    };

    this.invoiceService.createInvoice(payload).subscribe({
      next: (notaCriada) => {
        this.notas.update((lista) => [notaCriada, ...lista]);
        this.salvandoNota.set(false);
        this.modalNovaNotaAberto.set(false);
        this.sucesso.set(
          `Nota Fiscal Nº ${notaCriada.number} emitida com sucesso (Situação: Aberta).`,
        );
        setTimeout(() => this.sucesso.set(''), 5000);
      },
      error: (err) => {
        this.salvandoNota.set(false);
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
        this.erroModalNota.set(msg);
      },
    });
  }

  abrirDetalhes(nota: Invoice): void {
    this.notaDetalhes.set(nota);
    this.erroImpressao.set('');
  }

  fecharDetalhes(): void {
    this.notaDetalhes.set(null);
    this.erroImpressao.set('');
  }

  imprimirNota(notaId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const nota = this.notas().find((n) => n.id === notaId);
    if (!nota || nota.status !== 'Aberta') {
      return;
    }

    this.idProcessandoImpressao.set(notaId);
    this.erroImpressao.set('');
    this.sucesso.set('');

    this.invoiceService.printInvoice(notaId).subscribe({
      next: (resp) => {
        this.idProcessandoImpressao.set(null);

        this.notas.update((lista) =>
          lista.map((n) =>
            n.id === notaId
              ? { ...n, ...resp.invoice, status: 'Fechada' }
              : n,
          ),
        );

        if (this.notaDetalhes()?.id === notaId) {
          this.notaDetalhes.set({
            ...this.notaDetalhes()!,
            ...resp.invoice,
            status: 'Fechada',
          });
        }

        this.productService.getProducts().subscribe({
          next: (prods) => this.produtos.set(prods),
        });

        this.sucesso.set(
          `Nota Fiscal Nº ${nota.number} finalizada (Fechada) e estoque consumido com sucesso!`,
        );
        setTimeout(() => this.sucesso.set(''), 5000);

        setTimeout(() => window.print(), 200);
      },
      error: (err) => {
        this.idProcessandoImpressao.set(null);
        let msg = 'Erro ao processar a impressão da nota fiscal.';
        if (err.status === 503) {
          msg =
            'Serviço de inventário indisponível no momento. Não foi possível baixar o estoque.';
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
        this.erroImpressao.set(msg);
      },
    });
  }

  protected obterDescricaoProduto(productId: number): string {
    const prod = this.produtos().find((p) => p.id === productId);
    return prod ? prod.description : `Produto ID ${productId}`;
  }

  protected obterUnidadeProduto(productId: number): string {
    const prod = this.produtos().find((p) => p.id === productId);
    return prod ? prod.unit : 'UN';
  }

  protected formatoData(data: string): string {
    if (!data) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data));
  }

  protected formatoValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  }
}
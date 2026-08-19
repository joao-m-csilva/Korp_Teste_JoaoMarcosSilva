import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  protected readonly quantidadeProdutos = signal(0);
  protected readonly notasAbertas = signal(0);
  protected readonly notasFechadas = signal(0);
  protected readonly totalFaturado = signal(0);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  constructor(
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    this.erro.set('');

    forkJoin({
      produtos: this.productService.getProducts(),
      notas: this.invoiceService.getInvoices(),
    }).subscribe({
      next: ({ produtos, notas }) => {
        this.quantidadeProdutos.set(produtos.length);

        const abertas = notas.filter((n) => n.status === 'Aberta').length;
        const fechadas = notas.filter((n) => n.status === 'Fechada').length;
        const faturado = notas
          .filter((n) => n.status === 'Fechada')
          .reduce((acc, curr) => acc + (curr.total_Value || 0), 0);

        this.notasAbertas.set(abertas);
        this.notasFechadas.set(fechadas);
        this.totalFaturado.set(faturado);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível carregar os dados dos serviços de Estoque e Faturamento. Verifique se as APIs estão em execução.',
        );
        this.carregando.set(false);
      },
    });
  }

  protected formatoValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CreateProductDto, Product } from '../models/product.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  protected readonly produtos = signal<Product[]>([]);
  protected readonly busca = signal('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');

  protected readonly modalAberto = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erroModal = signal('');

  protected readonly formNovoProduto = signal<{
    code: string;
    description: string;
    unit: string;
    balance: number | null;
  }>({
    code: '',
    description: '',
    unit: 'UN',
    balance: null,
  });

  protected readonly unidadesDisponiveis = [
    { valor: 'UN', label: 'Unidade (UN)' },
    { valor: 'PC', label: 'Peça (PC)' },
    { valor: 'CX', label: 'Caixa (CX)' },
    { valor: 'KG', label: 'Quilograma (KG)' },
    { valor: 'M', label: 'Metro (M)' },
    { valor: 'L', label: 'Litro (L)' },
  ];

  private readonly integerUnits = new Set(['UN', 'PC', 'CX']);

  protected readonly produtosFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    if (!termo) return this.produtos();

    return this.produtos().filter(
      (p) =>
        p.code.toLowerCase().includes(termo) ||
        p.description.toLowerCase().includes(termo),
    );
  });

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.productService.getProducts().subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível carregar os produtos. Verifique se o Serviço de Estoque está em execução.',
        );
        this.carregando.set(false);
      },
    });
  }

  abrirModal(): void {
    this.formNovoProduto.set({
      code: '',
      description: '',
      unit: 'UN',
      balance: null,
    });
    this.erroModal.set('');
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    if (this.salvando()) return;
    this.modalAberto.set(false);
    this.erroModal.set('');
  }

  salvarProduto(): void {
    const form = this.formNovoProduto();
    const codigo = form.code.trim();
    const descricao = form.description.trim();
    const unidade = form.unit;
    const saldo = form.balance;

    if (!codigo) {
      this.erroModal.set('O campo Código é obrigatório.');
      return;
    }

    if (!/^\d+$/.test(codigo)) {
      this.erroModal.set('O código deve conter apenas números.');
      return;
    }

    if (!descricao) {
      this.erroModal.set('O campo Descrição é obrigatório.');
      return;
    }

    if (descricao.length < 10) {
      this.erroModal.set('A descrição deve ter pelo menos 10 caracteres.');
      return;
    }

    if (saldo === null || saldo === undefined || isNaN(saldo) || saldo <= 0) {
      this.erroModal.set('A quantidade em estoque deve ser maior que 0.');
      return;
    }

    if (this.integerUnits.has(unidade) && saldo % 1 !== 0) {
      this.erroModal.set(
        `A unidade '${unidade}' aceita apenas números inteiros para a quantidade.`,
      );
      return;
    }

    this.erroModal.set('');
    this.salvando.set(true);

    const dto: CreateProductDto = {
      code: codigo,
      description: descricao,
      unit: unidade,
      balance: saldo,
    };

    this.productService.createProduct(dto).subscribe({
      next: (novo) => {
        this.produtos.update((lista) => [...lista, novo]);
        this.salvando.set(false);
        this.modalAberto.set(false);
        this.sucesso.set(`Produto "${novo.description}" cadastrado com sucesso!`);
        setTimeout(() => this.sucesso.set(''), 4000);
      },
      error: (err) => {
        this.salvando.set(false);
        if (err.status === 409) {
          this.erroModal.set('Já existe um produto cadastrado com este código.');
        } else if (err.error?.message) {
          this.erroModal.set(err.error.message);
        } else {
          this.erroModal.set(
            'Erro ao cadastrar produto. Verifique os dados e tente novamente.',
          );
        }
      },
    });
  }

  protected isIntegerUnit(unit: string): boolean {
    return this.integerUnits.has(unit.toUpperCase());
  }
}
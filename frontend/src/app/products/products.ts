import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CreateProductDto, Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  protected readonly products = signal<Product[]>([]);
  protected readonly search = signal('');
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly isModalOpen = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly modalErrorMessage = signal('');

  protected readonly newProductForm = signal<{
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

  protected readonly availableUnits = [
    { value: 'UN', label: 'Unidade (UN)' },
    { value: 'PC', label: 'Peça (PC)' },
    { value: 'CX', label: 'Caixa (CX)' },
    { value: 'KG', label: 'Quilograma (KG)' },
    { value: 'M', label: 'Metro (M)' },
    { value: 'L', label: 'Litro (L)' },
  ];

  private readonly integerUnits = new Set(['UN', 'PC', 'CX']);

  protected readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.products();

    return this.products().filter(
      (p) =>
        p.code.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  });

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Não foi possível carregar os produtos. Verifique se o Serviço de Estoque está em execução.',
        );
        this.isLoading.set(false);
      },
    });
  }

  openModal(): void {
    this.newProductForm.set({
      code: '',
      description: '',
      unit: 'UN',
      balance: null,
    });
    this.modalErrorMessage.set('');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    if (this.isSaving()) return;
    this.isModalOpen.set(false);
    this.modalErrorMessage.set('');
  }

  saveProduct(): void {
    const form = this.newProductForm();
    const code = form.code.trim();
    const description = form.description.trim();
    const unit = form.unit;
    const balance = form.balance;

    if (!code) {
      this.modalErrorMessage.set('O campo Código é obrigatório.');
      return;
    }

    if (!/^\d+$/.test(code)) {
      this.modalErrorMessage.set('O código deve conter apenas números.');
      return;
    }

    if (!description) {
      this.modalErrorMessage.set('O campo Descrição é obrigatório.');
      return;
    }

    if (description.length < 10) {
      this.modalErrorMessage.set('A descrição deve ter pelo menos 10 caracteres.');
      return;
    }

    if (balance === null || balance === undefined || isNaN(balance) || balance <= 0) {
      this.modalErrorMessage.set('A quantidade em estoque deve ser maior que 0.');
      return;
    }

    if (this.integerUnits.has(unit) && balance % 1 !== 0) {
      this.modalErrorMessage.set(
        `A unidade '${unit}' aceita apenas números inteiros para a quantidade.`,
      );
      return;
    }

    this.modalErrorMessage.set('');
    this.isSaving.set(true);

    const dto: CreateProductDto = {
      code,
      description,
      unit,
      balance,
    };

    this.productService.createProduct(dto).subscribe({
      next: (created) => {
        this.products.update((list) => [...list, created]);
        this.isSaving.set(false);
        this.isModalOpen.set(false);
        this.successMessage.set(`Produto "${created.description}" cadastrado com sucesso!`);
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: (err) => {
        this.isSaving.set(false);
        if (err.status === 409) {
          this.modalErrorMessage.set('Já existe um produto cadastrado com este código.');
        } else if (err.error?.message) {
          this.modalErrorMessage.set(err.error.message);
        } else {
          this.modalErrorMessage.set(
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

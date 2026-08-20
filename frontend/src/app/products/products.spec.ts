import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Products } from './products';
import { ProductService } from '../services/product.service';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should set friendly error message when stock service is unavailable (Failed to fetch / status 0)', () => {
    const productService = TestBed.inject(ProductService);
    vi.spyOn(productService, 'createProduct').mockReturnValue(
      throwError(() => ({
        status: 0,
        message: 'Http failure response for http://localhost:7058/api/products: 0 Unknown Error',
        error: new TypeError('Failed to fetch'),
      })),
    );

    component.openModal();
    (component as any).newProductForm.set({
      code: '12345',
      description: 'Cabo de Rede Cat6 305m',
      unit: 'UN',
      balance: 10,
    });

    component.saveProduct();

    expect((component as any).modalErrorMessage()).toBe(
      'Serviço de estoque indisponível no momento.',
    );
  });

  it('should set conflict error message when status is 409', () => {
    const productService = TestBed.inject(ProductService);
    vi.spyOn(productService, 'createProduct').mockReturnValue(
      throwError(() => ({
        status: 409,
        error: { message: 'Já existe um produto cadastrado com este código.' },
      })),
    );

    component.openModal();
    (component as any).newProductForm.set({
      code: '12345',
      description: 'Cabo de Rede Cat6 305m',
      unit: 'UN',
      balance: 10,
    });

    component.saveProduct();

    expect((component as any).modalErrorMessage()).toBe(
      'Já existe um produto cadastrado com este código.',
    );
  });
});


import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NotasFiscais } from './notas-fiscais';

describe('NotasFiscais', () => {
  let component: NotasFiscais;
  let fixture: ComponentFixture<NotasFiscais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasFiscais],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotasFiscais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
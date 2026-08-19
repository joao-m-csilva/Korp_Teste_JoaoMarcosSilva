import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Invoices } from './invoices';

describe('Invoices', () => {
  let component: Invoices;
  let fixture: ComponentFixture<Invoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invoices],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Invoices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products').then((m) => m.Products),
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./invoices/invoices').then((m) => m.Invoices),
      },
      {
        path: 'produtos',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'notas-fiscais',
        redirectTo: 'invoices',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

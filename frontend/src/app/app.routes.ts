import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./layout/layout').then((m) => m.Layout), children: [
    { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
    { path: 'produtos', loadComponent: () => import('./produtos/produtos').then((m) => m.Produtos) },
    { path: 'notas-fiscais', loadComponent: () => import('./notas-fiscais/notas-fiscais').then((m) => m.NotasFiscais) },
  ]},
  { path: '**', redirectTo: '' },
];

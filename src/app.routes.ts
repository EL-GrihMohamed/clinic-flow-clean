import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    { path: '', loadComponent: () => import('./app/pages/landing/landing').then(m => m.Landing) },
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            { path: '', loadComponent: () => import('./app/pages/dashboard/dashboard').then(m => m.Dashboard) }
        ]
    },
    {
        path: 'documentation',
        component: AppLayout,
        children: [
            { path: '', loadComponent: () => import('./app/pages/documentation/documentation').then(m => m.Documentation) }
        ]
    },
    { path: 'uikit', component: AppLayout, loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    { path: 'pages', component: AppLayout, loadChildren: () => import('./app/pages/pages.routes') },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

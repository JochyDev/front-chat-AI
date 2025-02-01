import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./layout/layout.component').then((c) => c.LayoutComponent),
        children: [
            {
                path: 'chat',
                loadComponent: () => import('./pages/main-chat/main-chat.component').then((c) => c.MainChatComponent),
                title: 'Chat principal'
            },
            {
                path: '',
                redirectTo: 'chat',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes')
    },
    {
        path: "**",
        redirectTo: 'chat'
    }
];

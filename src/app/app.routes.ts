import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
          },
          {
            path: 'tables',
            loadComponent: () => import('./features/tables/tables.component').then(m => m.TablesComponent),
          },
          {
            path: 'menu-management',
            loadComponent: () => import('./features/menu-management/menu-management.component').then(m => m.MenuManagementComponent),
          },
          {
            path: 'staff',
            loadComponent: () => import('./features/staff/staff.component').then(m => m.StaffComponent),
          },
          {
            path: 'analytics',
            loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
          },
          {
            path: 'warehouse',
            loadComponent: () => import('./features/warehouse/warehouse.component').then(m => m.WarehouseComponent),
          },
          {
            path: 'settings',
            loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
          },
      {
        path: 'orders/new',
        loadComponent: () => import('./features/order-create/order-create.component').then(m => m.OrderCreateComponent),
      },
      {
        path: 'tables/reserve',
        loadComponent: () => import('./features/table-reserve/table-reserve.component').then(m => m.TableReserveComponent),
      },
      {
        path: 'orders/:tableId',
        loadComponent: () => import('./features/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
      },
      {
        path: 'menu',
        loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent),
      },
      {
        path: 'payment/:orderId',
        loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Статистика для дашборда
  stats = {
    totalTables: 10,
    occupiedTables: 4,
    reservedTables: 2,
    totalOrders: 15,
    todayRevenue: 45000,
    activeStaff: 8
  };
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
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

  constructor(public languageService: LanguageService) {}
}


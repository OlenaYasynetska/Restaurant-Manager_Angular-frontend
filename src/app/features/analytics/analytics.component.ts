import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

interface DayStats {
  date: string;
  visitors: number;
  revenue: number;
  orders: number;
  avgCheck: number;
}

interface DishStats {
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

interface WaiterStats {
  name: string;
  orders: number;
  revenue: number;
  avgCheck: number;
  rating: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent {
  // Активный отчет
  activeReport: 'visitors' | 'finance' | 'dishes' | 'waiters' = 'visitors';

  // Период
  selectedPeriod: 'today' | 'week' | 'month' = 'week';

  // Статистика по дням (последние 7 дней, от старых к новым)
  dailyStats: DayStats[] = [
    { date: '10.11', visitors: 139, revenue: 83400, orders: 40, avgCheck: 2085 },
    { date: '11.11', visitors: 142, revenue: 85200, orders: 41, avgCheck: 2078 },
    { date: '12.11', visitors: 167, revenue: 100200, orders: 48, avgCheck: 2088 },
    { date: '13.11', visitors: 124, revenue: 74400, orders: 36, avgCheck: 2067 },
    { date: '14.11', visitors: 158, revenue: 94800, orders: 45, avgCheck: 2107 },
    { date: '15.11', visitors: 132, revenue: 79200, orders: 38, avgCheck: 2084 },
    { date: '16.11', visitors: 145, revenue: 87500, orders: 42, avgCheck: 2083 },
  ];

  // Топ блюда
  topDishes: DishStats[] = [
    { name: 'Стейк Рибай', category: 'Основные блюда', sold: 48, revenue: 72000 },
    { name: 'Паста Карбонара', category: 'Паста', sold: 65, revenue: 45500 },
    { name: 'Цезарь с курицей', category: 'Салаты', sold: 52, revenue: 31200 },
    { name: 'Том Ям', category: 'Супы', sold: 38, revenue: 26600 },
    { name: 'Тирамису', category: 'Десерты', sold: 71, revenue: 28400 },
  ];

  // Статистика по официантам
  waiterStats: WaiterStats[] = [
    { name: 'Иванов Иван', orders: 85, revenue: 176800, avgCheck: 2080, rating: 4.8 },
    { name: 'Петрова Мария', orders: 92, revenue: 191360, avgCheck: 2080, rating: 4.9 },
    { name: 'Сидоров Петр', orders: 78, revenue: 162240, avgCheck: 2080, rating: 4.7 },
    { name: 'Козлова Анна', orders: 68, revenue: 141440, avgCheck: 2080, rating: 4.6 },
  ];

  constructor(private languageService: LanguageService) {}

  // Общая статистика за период
  get totalVisitors(): number {
    return this.dailyStats.reduce((sum, day) => sum + day.visitors, 0);
  }

  get totalRevenue(): number {
    return this.dailyStats.reduce((sum, day) => sum + day.revenue, 0);
  }

  get totalOrders(): number {
    return this.dailyStats.reduce((sum, day) => sum + day.orders, 0);
  }

  get avgCheck(): number {
    return Math.round(this.totalRevenue / this.totalOrders);
  }

  // Переключение отчета
  setReport(report: 'visitors' | 'finance' | 'dishes' | 'waiters'): void {
    this.activeReport = report;
  }

  // Получить максимальное значение для масштабирования графика
  getMaxValue(data: number[]): number {
    return Math.max(...data);
  }

  // Вычислить высоту столбца для графика
  getBarHeight(value: number, max: number): number {
    return (value / max) * 100;
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  // Получить массив посетителей
  get visitorsData(): number[] {
    return this.dailyStats.map(d => d.visitors);
  }

  // Получить массив выручки
  get revenueData(): number[] {
    return this.dailyStats.map(d => d.revenue);
  }

  // Получить массив проданных блюд
  get soldData(): number[] {
    return this.topDishes.map(d => d.sold);
  }

  // Генерация точек для линейного графика посетителей
  getVisitorsChartPoints(): string {
    const maxValue = this.getMaxValue(this.visitorsData);
    return this.dailyStats
      .map((day, i) => `${i * 143 + 71},${250 - (day.visitors / maxValue * 200)}`)
      .join(' ');
  }

  // Генерация точек для линейного графика выручки
  getRevenueChartPoints(): string {
    const maxValue = this.getMaxValue(this.revenueData);
    return this.dailyStats
      .map((day, i) => `${i * 143 + 71},${250 - (day.revenue / maxValue * 200)}`)
      .join(' ');
  }

  // Получить Y координату для точки графика посетителей
  getVisitorY(visitors: number): number {
    return 250 - (visitors / this.getMaxValue(this.visitorsData) * 200);
  }

  // Получить Y координату для точки графика выручки
  getRevenueY(revenue: number): number {
    return 250 - (revenue / this.getMaxValue(this.revenueData) * 200);
  }

  // Получить X координату для точки графика
  getChartX(index: number): number {
    return index * 143 + 71;
  }

  // Получить массив заказов
  get ordersData(): number[] {
    return this.dailyStats.map(d => d.orders);
  }

  // Получить Y координату для столбца заказов
  getOrderY(orders: number): number {
    return 250 - (orders / this.getMaxValue(this.ordersData) * 200);
  }

  // Получить массив средних чеков
  get avgCheckData(): number[] {
    return this.dailyStats.map(d => d.avgCheck);
  }

  // Получить Y координату для столбца среднего чека
  getAvgCheckY(avgCheck: number): number {
    return 250 - (avgCheck / this.getMaxValue(this.avgCheckData) * 200);
  }

  getDishCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      'Основные блюда': 'menu.category.main',
      'Паста': 'menu.category.pasta',
      'Салаты': 'menu.category.salads',
      'Супы': 'menu.category.soups',
      'Десерты': 'menu.category.desserts'
    };
    const key = map[category];
    return key ? this.languageService.translate(key) : category;
  }

  private getLocale(): string {
    const lang = this.languageService.getCurrentLanguage();
    switch (lang) {
      case 'de':
        return 'de-DE';
      case 'ru':
        return 'ru-RU';
      default:
        return 'en-US';
    }
  }
}


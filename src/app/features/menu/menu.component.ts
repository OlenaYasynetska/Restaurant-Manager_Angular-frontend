import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { OrderService } from '../../core/services/order.service';
import { MenuItem, MenuCategory } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  menuItems$ = this.menuService.getMenuItems();
  selectedCategory: MenuCategory | 'all' = 'all';
  searchQuery: string = '';
  
  orderId?: number;
  tableId?: number;
  
  // Корзина (временное хранилище выбранных позиций)
  cart: Map<number, { item: MenuItem; quantity: number }> = new Map();
  
  // Категории для фильтра
  categories: Array<{ value: MenuCategory | 'all'; label: string }> = [
    { value: 'all' as const, label: 'Все' },
    { value: MenuCategory.APPETIZERS, label: MenuCategory.APPETIZERS },
    { value: MenuCategory.SOUPS, label: MenuCategory.SOUPS },
    { value: MenuCategory.MAIN_DISHES, label: MenuCategory.MAIN_DISHES },
    { value: MenuCategory.PASTA, label: MenuCategory.PASTA },
    { value: MenuCategory.SALADS, label: MenuCategory.SALADS },
    { value: MenuCategory.DESSERTS, label: MenuCategory.DESSERTS },
    { value: MenuCategory.DRINKS, label: MenuCategory.DRINKS },
    { value: MenuCategory.ALCOHOL, label: MenuCategory.ALCOHOL },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderIdParam = this.route.snapshot.queryParamMap.get('orderId');
    const tableIdParam = this.route.snapshot.queryParamMap.get('tableId');
    
    if (orderIdParam && tableIdParam) {
      this.orderId = Number(orderIdParam);
      this.tableId = Number(tableIdParam);
    }
    // Если параметров нет, просто показываем меню для просмотра
  }

  // Фильтрация меню
  getFilteredMenuItems(items: MenuItem[] | null): MenuItem[] {
    if (!items) return [];
    
    let filtered = items;
    
    // Фильтр по категории
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }
    
    // Поиск
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  // Добавить в корзину
  addToCart(item: MenuItem): void {
    const existing = this.cart.get(item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.set(item.id, { item, quantity: 1 });
    }
  }

  // Удалить из корзины
  removeFromCart(itemId: number): void {
    const existing = this.cart.get(itemId);
    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity--;
      } else {
        this.cart.delete(itemId);
      }
    }
  }

  // Количество в корзине
  getCartQuantity(itemId: number): number {
    return this.cart.get(itemId)?.quantity || 0;
  }

  // Общее количество позиций в корзине
  getTotalCartItems(): number {
    let total = 0;
    this.cart.forEach(item => total += item.quantity);
    return total;
  }

  // Общая сумма корзины
  getCartTotal(): number {
    let total = 0;
    this.cart.forEach(({ item, quantity }) => {
      total += item.price * quantity;
    });
    return total;
  }

  // Добавить выбранные позиции в заказ
  confirmSelection(): void {
    if (!this.orderId || !this.tableId) {
      return;
    }

    if (this.cart.size === 0) {
      alert('Выберите хотя бы одно блюдо');
      return;
    }

    this.cart.forEach(({ item, quantity }) => {
      this.orderService.addItemToOrder(this.orderId!, item.id, quantity);
    });

    // Очищаем корзину и возвращаемся к заказу
    this.cart.clear();
    this.router.navigate(['/orders', this.tableId]);
  }

  // Отменить и вернуться
  cancel(): void {
    if (!this.tableId) {
      this.router.navigate(['/tables']);
      return;
    }

    if (this.cart.size > 0) {
      if (confirm('Отменить выбор блюд?')) {
        this.cart.clear();
        this.router.navigate(['/orders', this.tableId]);
      }
    } else {
      this.router.navigate(['/orders', this.tableId]);
    }
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return `€${price.toLocaleString('ru-RU')}`;
  }
}


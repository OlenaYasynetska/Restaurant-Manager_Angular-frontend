import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { OrderService } from '../../core/services/order.service';
import { MenuItem, MenuCategory, TranslatedText } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
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
  categories: Array<{ value: MenuCategory | 'all'; labelKey: string }> = [
    { value: 'all' as const, labelKey: 'menu.category.all' },
    { value: MenuCategory.APPETIZERS, labelKey: 'menu.category.appetizers' },
    { value: MenuCategory.SOUPS, labelKey: 'menu.category.soups' },
    { value: MenuCategory.MAIN_DISHES, labelKey: 'menu.category.main' },
    { value: MenuCategory.PASTA, labelKey: 'menu.category.pasta' },
    { value: MenuCategory.SALADS, labelKey: 'menu.category.salads' },
    { value: MenuCategory.DESSERTS, labelKey: 'menu.category.desserts' },
    { value: MenuCategory.DRINKS, labelKey: 'menu.category.drinks' },
    { value: MenuCategory.ALCOHOL, labelKey: 'menu.category.alcohol' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private orderService: OrderService,
    private languageService: LanguageService
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
      alert(this.t('menu.alert.selectItem'));
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
      if (confirm(this.t('menu.confirmCancel'))) {
        this.cart.clear();
        this.router.navigate(['/orders', this.tableId]);
      }
    } else {
      this.router.navigate(['/orders', this.tableId]);
    }
  }

  // Форматирование цены
  formatPrice(price: number): string {
    const locale = this.getLocale();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getCategoryTranslation(category: MenuCategory): string {
    switch (category) {
      case MenuCategory.APPETIZERS:
        return 'menu.category.appetizers';
      case MenuCategory.SOUPS:
        return 'menu.category.soups';
      case MenuCategory.MAIN_DISHES:
        return 'menu.category.main';
      case MenuCategory.PASTA:
        return 'menu.category.pasta';
      case MenuCategory.SALADS:
        return 'menu.category.salads';
      case MenuCategory.DESSERTS:
        return 'menu.category.desserts';
      case MenuCategory.DRINKS:
        return 'menu.category.drinks';
      case MenuCategory.ALCOHOL:
        return 'menu.category.alcohol';
      default:
        return 'menu.category.all';
    }
  }

  private t(key: string): string {
    return this.languageService.translate(key);
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

  getItemName(item: MenuItem): string {
    return this.translateField(item.translations?.name, item.name);
  }

  getItemDescription(item: MenuItem): string {
    const fallback = item.description || '';
    return this.translateField(item.translations?.description, fallback);
  }

  private translateField(text?: TranslatedText, fallback: string = ''): string {
    if (!text) {
      return fallback;
    }
    const lang = this.languageService.getCurrentLanguage();
    return text[lang] || fallback;
  }
}


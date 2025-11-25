import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { Order, Table, OrderStatus, OrderItem, TranslatedText } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  table$!: Observable<Table | undefined>;
  order$!: Observable<Order | undefined>;
  tableId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private orderService: OrderService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.paramMap.get('tableId'));
    
    this.table$ = this.tableService.getTableById(this.tableId);
    this.order$ = this.orderService.getOrderByTableId(this.tableId);
  }

  // Перейти к выбору блюд
  addItems(): void {
    this.order$.subscribe(order => {
      if (order) {
        this.router.navigate(['/menu'], {
          queryParams: { orderId: order.id, tableId: this.tableId }
        });
      }
    });
  }

  // Изменить количество
  updateQuantity(orderId: number, itemId: number, change: number): void {
    this.order$.subscribe(order => {
      if (order) {
        const item = order.items.find(i => i.id === itemId);
        if (item) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
            this.orderService.updateItemQuantity(orderId, itemId, newQuantity);
          }
        }
      }
    });
  }

  // Удалить позицию
  removeItem(orderId: number, itemId: number): void {
    if (confirm(this.t('orderDetail.confirm.removeItem'))) {
      this.orderService.removeItemFromOrder(orderId, itemId);
    }
  }

  // Отметить как поданное (списание ингредиентов со склада)
  markAsServed(order: Order): void {
    if (order.items.length === 0) {
      alert(this.t('orderDetail.alert.emptyOrder'));
      return;
    }

    if (confirm(this.t('orderDetail.confirm.serve'))) {
      this.orderService.updateOrderStatus(order.id, OrderStatus.SERVED);
    }
  }

  // Закрыть заказ и перейти к оплате
  closeOrder(order: Order): void {
    if (order.items.length === 0) {
      alert(this.t('orderDetail.alert.emptyOrder'));
      return;
    }

    if (confirm(this.t('orderDetail.confirm.close'))) {
      this.orderService.closeOrder(order.id);
      this.tableService.setWaitingPayment(this.tableId);
      this.router.navigate(['/payment', order.id]);
    }
  }

  // Вернуться к столикам
  goBack(): void {
    this.router.navigate(['/tables']);
  }

  // Получить текст статуса
  getStatusText(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.NEW:
        return this.t('order.status.new');
      case OrderStatus.IN_PROGRESS:
        return this.t('order.status.inProgress');
      case OrderStatus.SERVED:
        return this.t('order.status.served');
      case OrderStatus.WAITING_PAYMENT:
        return this.t('order.status.waitingPayment');
      case OrderStatus.PAID:
        return this.t('order.status.paid');
      default:
        return status;
    }
  }

  // Получить цвет статуса
  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.NEW:
        return 'bg-gray-100 text-gray-700';
      case OrderStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700';
      case OrderStatus.SERVED:
        return 'bg-purple-100 text-purple-700';
      case OrderStatus.WAITING_PAYMENT:
        return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.PAID:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getItemName(item: OrderItem): string {
    return this.translateDynamic(item.translations?.name, item.name);
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

  private translateDynamic(text?: TranslatedText, fallback: string = ''): string {
    if (!text) {
      return fallback;
    }
    const lang = this.languageService.getCurrentLanguage();
    return text[lang] || fallback;
  }
}


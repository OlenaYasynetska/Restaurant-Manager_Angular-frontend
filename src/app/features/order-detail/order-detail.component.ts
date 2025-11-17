import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { Order, Table, OrderStatus } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
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
    private orderService: OrderService
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
    if (confirm('Удалить это блюдо из заказа?')) {
      this.orderService.removeItemFromOrder(orderId, itemId);
    }
  }

  // Отметить как поданное (списание ингредиентов со склада)
  markAsServed(order: Order): void {
    if (order.items.length === 0) {
      alert('Заказ пустой! Добавьте блюда.');
      return;
    }

    if (confirm('Подать блюда гостям?\n\nИнгредиенты будут автоматически списаны со склада согласно технологическим картам.')) {
      this.orderService.updateOrderStatus(order.id, OrderStatus.SERVED);
    }
  }

  // Закрыть заказ и перейти к оплате
  closeOrder(order: Order): void {
    if (order.items.length === 0) {
      alert('Заказ пустой! Добавьте блюда.');
      return;
    }

    if (confirm('Закрыть заказ и перейти к оплате?')) {
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
        return 'Новый';
      case OrderStatus.IN_PROGRESS:
        return 'Готовится';
      case OrderStatus.SERVED:
        return 'Подано';
      case OrderStatus.WAITING_PAYMENT:
        return 'Ожидает оплаты';
      case OrderStatus.PAID:
        return 'Оплачен';
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
    return `€${price.toLocaleString('ru-RU')}`;
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { Order, Table } from '../../core/models/restaurant.models';

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

  // Форматирование цены
  formatPrice(price: number): string {
    return `€${price.toLocaleString('ru-RU')}`;
  }
}


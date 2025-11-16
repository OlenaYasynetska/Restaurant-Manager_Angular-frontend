import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Table } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-create.component.html',
})
export class OrderCreateComponent implements OnInit {
  table$!: Observable<Table | undefined>;
  tableId!: number;
  guests: number = 2; // количество гостей по умолчанию

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private orderService: OrderService,
    public authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.queryParamMap.get('tableId'));
    
    if (!this.tableId) {
      this.router.navigate(['/tables']);
      return;
    }

    // Если передано количество гостей (из бронирования)
    const guestsParam = this.route.snapshot.queryParamMap.get('guests');
    if (guestsParam) {
      this.guests = Number(guestsParam);
    }

    this.table$ = this.tableService.getTableById(this.tableId);
    
    // Проверяем, что столик свободен или забронирован
    this.table$.subscribe(table => {
      if (!table || (table.status !== 'free' && table.status !== 'reserved')) {
        // Если столик занят, переходим к существующему заказу
        if (table?.activeOrderId) {
          this.router.navigate(['/orders', this.tableId]);
        } else {
          this.router.navigate(['/tables']);
        }
      }
    });
  }

  // Изменить количество гостей
  setGuests(count: number): void {
    if (count > 0 && count <= 20) {
      this.guests = count;
    }
  }

  // Создать заказ
  createOrder(table: Table): void {
    const user = this.authService.getCurrentUserValue();
    const order = this.orderService.createOrder(
      table.id,
      table.number,
      user?.username
    );
    
    // Обновляем статус столика
    this.tableService.openTable(table.id, order.id);
    
    // Если столик был забронирован, удаляем бронирование
    if (table.status === 'reserved') {
      this.reservationService.cancelReservationByTableId(table.id);
    }
    
    // Переходим на страницу заказа
    this.router.navigate(['/orders', table.id]);
  }

  // Быстрый переход к меню (создать заказ и сразу открыть меню)
  createAndAddItems(table: Table): void {
    const user = this.authService.getCurrentUserValue();
    const order = this.orderService.createOrder(
      table.id,
      table.number,
      user?.username
    );
    
    this.tableService.openTable(table.id, order.id);
    
    // Если столик был забронирован, удаляем бронирование
    if (table.status === 'reserved') {
      this.reservationService.cancelReservationByTableId(table.id);
    }
    
    // Переходим сразу в меню
    this.router.navigate(['/menu'], {
      queryParams: { orderId: order.id, tableId: table.id }
    });
  }

  // Отмена
  cancel(): void {
    this.router.navigate(['/tables']);
  }
}


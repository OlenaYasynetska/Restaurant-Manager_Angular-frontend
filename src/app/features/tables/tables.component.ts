import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Table, TableStatus, OrderStatus } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.component.html',
})
export class TablesComponent implements OnInit {
  tables$ = this.tableService.getTables();
  TableStatus = TableStatus;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private tableService: TableService,
    private orderService: OrderService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Получить CSS класс для столика
  getTableClass(status: TableStatus): string {
    const baseClasses = 'relative rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-6 flex flex-col items-center justify-center min-h-[140px]';
    
    switch (status) {
      case TableStatus.FREE:
        return `${baseClasses} border-2 border-green-300 hover:border-green-400 bg-green-50`;
      case TableStatus.RESERVED:
        return `${baseClasses} border-2 border-purple-400 hover:border-purple-500 bg-purple-100`;
      case TableStatus.OCCUPIED:
        return `${baseClasses} border-2 border-blue-400 hover:border-blue-500 bg-blue-100`;
      case TableStatus.WAITING_PAYMENT:
        return `${baseClasses} border-2 border-yellow-400 hover:border-yellow-500 bg-yellow-100`;
      case TableStatus.CLOSED:
        return `${baseClasses} border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-60`;
      default:
        return baseClasses;
    }
  }

  // Получить текст статуса
  getStatusText(status: TableStatus): string {
    switch (status) {
      case TableStatus.FREE:
        return 'Свободен';
      case TableStatus.RESERVED:
        return 'Забронирован';
      case TableStatus.OCCUPIED:
        return 'Занят';
      case TableStatus.WAITING_PAYMENT:
        return 'Ожидает оплаты';
      case TableStatus.CLOSED:
        return 'Закрыт';
      default:
        return '';
    }
  }

  // Получить цвет статуса
  getStatusColor(status: TableStatus): string {
    switch (status) {
      case TableStatus.FREE:
        return 'text-green-600';
      case TableStatus.RESERVED:
        return 'text-purple-600';
      case TableStatus.OCCUPIED:
        return 'text-blue-600';
      case TableStatus.WAITING_PAYMENT:
        return 'text-yellow-600';
      case TableStatus.CLOSED:
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  }

  // Клик по столику
  onTableClick(table: Table): void {
    if (table.status === TableStatus.CLOSED) {
      return;
    }

    if (table.status === TableStatus.FREE) {
      // Переходим на страницу создания заказа
      this.router.navigate(['/orders/new'], {
        queryParams: { tableId: table.id }
      });
    } else if (table.status === TableStatus.RESERVED) {
      // Показываем информацию о бронировании
      this.showReservationInfo(table);
    } else {
      // Открываем существующий заказ
      this.openExistingOrder(table);
    }
  }

  // Открыть существующий заказ
  private openExistingOrder(table: Table): void {
    if (table.status === TableStatus.WAITING_PAYMENT && table.activeOrderId) {
      // Если ожидает оплаты, переходим на страницу оплаты
      this.router.navigate(['/payment', table.activeOrderId]);
    } else {
      // Иначе открываем заказ для редактирования
      this.router.navigate(['/orders', table.id]);
    }
  }

  // Получить иконку столика
  getTableIcon(status: TableStatus): string {
    switch (status) {
      case TableStatus.FREE:
        return '✓';
      case TableStatus.RESERVED:
        return '📅';
      case TableStatus.OCCUPIED:
        return '🍽️';
      case TableStatus.WAITING_PAYMENT:
        return '💳';
      default:
        return '•';
    }
  }

  // Забронировать столик (только для свободных)
  reserveTable(event: Event, table: Table): void {
    event.stopPropagation(); // Останавливаем всплытие события
    
    if (table.status === TableStatus.FREE) {
      this.router.navigate(['/tables/reserve'], {
        queryParams: { tableId: table.id }
      });
    }
  }

  // Показать информацию о бронировании
  showReservationInfo(table: Table): void {
    const reservation = this.reservationService.getReservationByTableId(table.id);
    
    if (reservation) {
      const time = new Date(reservation.reservationTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const message = `Бронирование: ${reservation.guestName}\nТелефон: ${reservation.guestPhone}\nГостей: ${reservation.guestCount}\nВремя: ${time}${reservation.notes ? '\nЗаметки: ' + reservation.notes : ''}`;
      
      const action = confirm(message + '\n\n[OK] - Создать заказ | [Отмена] - Закрыть');
      
      if (action) {
        // Создаем заказ для этого столика
        this.router.navigate(['/orders/new'], {
          queryParams: { 
            tableId: table.id,
            guests: reservation.guestCount
          }
        });
        
        // Удаляем бронирование
        this.reservationService.cancelReservation(reservation.id);
      }
    } else {
      alert('Информация о бронировании не найдена');
    }
  }

  markTableWaitingPayment(event: Event, table: Table): void {
    event.stopPropagation();

    if (!table.activeOrderId) {
      alert('Для этого столика нет активного заказа.');
      return;
    }

    if (!confirm('Отметить столик как "к оплате"? Пока гость не оплатит, карточка останется жёлтой.')) {
      return;
    }

    this.orderService.updateOrderStatus(table.activeOrderId, OrderStatus.WAITING_PAYMENT);
    this.tableService.setWaitingPayment(table.id);
  }
}


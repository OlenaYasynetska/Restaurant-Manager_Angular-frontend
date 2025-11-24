import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableService } from '../../core/services/table.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Table, TableStatus, OrderStatus } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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
    private router: Router,
    private languageService: LanguageService
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

  // Получить ключ перевода для статуса
  getStatusTranslationKey(status: TableStatus): string {
    switch (status) {
      case TableStatus.FREE:
        return 'tables.status.free';
      case TableStatus.RESERVED:
        return 'tables.status.reserved';
      case TableStatus.OCCUPIED:
        return 'tables.status.occupied';
      case TableStatus.WAITING_PAYMENT:
        return 'tables.status.waitingPayment';
      case TableStatus.CLOSED:
        return 'tables.status.closed';
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
      const time = new Date(reservation.reservationTime).toLocaleString(this.getLocale(), {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const message = `${this.t('reservation.info.title')}: ${reservation.guestName}\n${this.t('reservation.info.phone')}: ${reservation.guestPhone}\n${this.t('reservation.info.guests')}: ${reservation.guestCount}\n${this.t('reservation.info.time')}: ${time}${reservation.notes ? '\n' + this.t('reservation.info.notes') + ': ' + reservation.notes : ''}`;
      
      const action = confirm(`${message}\n\n${this.t('reservation.info.confirm')}`);
      
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
      alert(this.t('reservation.info.error'));
    }
  }

  markTableWaitingPayment(event: Event, table: Table): void {
    event.stopPropagation();

    if (!table.activeOrderId) {
      alert(this.t('tables.waitingPayment.noOrder'));
      return;
    }

    if (!confirm(this.t('tables.waitingPayment.confirm'))) {
      return;
    }

    this.orderService.updateOrderStatus(table.activeOrderId, OrderStatus.WAITING_PAYMENT);
    this.tableService.setWaitingPayment(table.id);
  }

  private t(key: string): string {
    return this.languageService.translate(key);
  }

  private getLocale(): string {
    const lang = this.languageService.getCurrentLanguage();
    if (lang === 'ru') return 'ru-RU';
    if (lang === 'de') return 'de-DE';
    return 'en-US';
  }
}


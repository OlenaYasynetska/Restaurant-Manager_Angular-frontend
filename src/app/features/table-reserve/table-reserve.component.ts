import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TableService } from '../../core/services/table.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Table, TableStatus } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-table-reserve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-reserve.component.html',
})
export class TableReserveComponent implements OnInit {
  table$!: Observable<Table | undefined>;
  tableId!: number;

  // Данные формы
  guestName: string = '';
  guestPhone: string = '';
  guestCount: number = 2;
  reservationDate: string = '';
  reservationTime: string = '';
  notes: string = '';

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.queryParamMap.get('tableId'));
    
    if (!this.tableId) {
      this.router.navigate(['/tables']);
      return;
    }

    this.table$ = this.tableService.getTableById(this.tableId);
    
    // Проверяем, что столик свободен
    this.table$.subscribe(table => {
      if (!table || table.status !== TableStatus.FREE) {
        this.router.navigate(['/tables']);
      }
    });

    // Устанавливаем минимальную дату (сегодня)
    const today = new Date();
    this.reservationDate = today.toISOString().split('T')[0];
    
    // Устанавливаем время по умолчанию (через 2 часа)
    const defaultTime = new Date(today.getTime() + 2 * 60 * 60 * 1000);
    this.reservationTime = defaultTime.toTimeString().slice(0, 5);
  }

  // Изменить количество гостей
  setGuestCount(count: number): void {
    if (count > 0 && count <= 20) {
      this.guestCount = count;
    }
  }

  // Создать бронирование
  createReservation(table: Table): void {
    // Валидация
    if (!this.guestName.trim()) {
      this.errorMessage = 'Введите имя гостя';
      return;
    }

    if (!this.guestPhone.trim()) {
      this.errorMessage = 'Введите номер телефона';
      return;
    }

    if (!this.reservationDate || !this.reservationTime) {
      this.errorMessage = 'Выберите дату и время';
      return;
    }

    // Создаем объект Date из даты и времени
    const reservationDateTime = new Date(`${this.reservationDate}T${this.reservationTime}`);
    
    // Проверяем, что время в будущем
    if (reservationDateTime <= new Date()) {
      this.errorMessage = 'Выберите время в будущем';
      return;
    }

    // Создаем бронирование
    const reservation = this.reservationService.createReservation(
      table.id,
      this.guestName.trim(),
      this.guestPhone.trim(),
      this.guestCount,
      reservationDateTime,
      this.notes.trim() || undefined
    );

    // Обновляем статус столика
    this.tableService.updateTableStatus(table.id, TableStatus.RESERVED, null);

    // Сохраняем ID бронирования в столике (для упрощения)
    const tables = this.tableService['tablesSubject'].value;
    const tableIndex = tables.findIndex(t => t.id === table.id);
    if (tableIndex !== -1) {
      tables[tableIndex].reservationId = reservation.id;
      this.tableService['tablesSubject'].next([...tables]);
    }

    // Переходим обратно к столикам
    this.router.navigate(['/tables']);
  }

  // Отмена
  cancel(): void {
    this.router.navigate(['/tables']);
  }
}


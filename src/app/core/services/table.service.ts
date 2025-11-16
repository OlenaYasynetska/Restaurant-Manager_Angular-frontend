import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Table, TableStatus } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  // Имитация данных (в реальном приложении это будет HTTP запрос)
  private tablesSubject = new BehaviorSubject<Table[]>(this.getMockTables());
  public tables$ = this.tablesSubject.asObservable();

  constructor() {}

  // Получить все столики
  getTables(): Observable<Table[]> {
    return this.tables$;
  }

  // Получить конкретный столик
  getTableById(id: number): Observable<Table | undefined> {
    return this.tables$.pipe(
      map(tables => tables.find(t => t.id === id))
    );
  }

  // Обновить статус столика
  updateTableStatus(tableId: number, status: TableStatus, activeOrderId: number | null = null): void {
    const tables = this.tablesSubject.value;
    const tableIndex = tables.findIndex(t => t.id === tableId);
    
    if (tableIndex !== -1) {
      tables[tableIndex] = {
        ...tables[tableIndex],
        status,
        activeOrderId
      };
      this.tablesSubject.next([...tables]);
    }
  }

  // Открыть столик (создать заказ)
  openTable(tableId: number, orderId: number): void {
    this.updateTableStatus(tableId, TableStatus.OCCUPIED, orderId);
  }

  // Закрыть столик (после оплаты)
  closeTable(tableId: number): void {
    this.updateTableStatus(tableId, TableStatus.FREE, null);
  }

  // Перевести столик в ожидание оплаты
  setWaitingPayment(tableId: number): void {
    const tables = this.tablesSubject.value;
    const table = tables.find(t => t.id === tableId);
    if (table) {
      this.updateTableStatus(tableId, TableStatus.WAITING_PAYMENT, table.activeOrderId);
    }
  }

  // Мок данные
  private getMockTables(): Table[] {
    return [
      { id: 1, number: '1', status: TableStatus.FREE, activeOrderId: null, seats: 4 },
      { id: 2, number: '2', status: TableStatus.FREE, activeOrderId: null, seats: 2 },
      { id: 3, number: '3', status: TableStatus.OCCUPIED, activeOrderId: 1, seats: 6 },
      { id: 4, number: '4', status: TableStatus.FREE, activeOrderId: null, seats: 4 },
      { id: 5, number: '5', status: TableStatus.WAITING_PAYMENT, activeOrderId: 2, seats: 2 },
      { id: 6, number: '6', status: TableStatus.FREE, activeOrderId: null, seats: 4 },
      { id: 7, number: '7', status: TableStatus.FREE, activeOrderId: null, seats: 8 },
      { id: 8, number: '8', status: TableStatus.OCCUPIED, activeOrderId: 3, seats: 4 },
      { id: 9, number: '9', status: TableStatus.FREE, activeOrderId: null, seats: 2 },
      { id: 10, number: '10', status: TableStatus.FREE, activeOrderId: null, seats: 6 },
    ];
  }
}


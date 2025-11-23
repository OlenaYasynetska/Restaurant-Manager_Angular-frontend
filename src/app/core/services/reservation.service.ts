import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservation } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly STORAGE_KEY = 'restaurant_reservations';
  private reservationsSubject = new BehaviorSubject<Reservation[]>(this.loadFromLocalStorage());
  public reservations$ = this.reservationsSubject.asObservable();
  private nextReservationId: number;

  constructor() {
    const reservations = this.reservationsSubject.value;
    if (reservations.length > 0) {
      this.nextReservationId = Math.max(...reservations.map(r => r.id)) + 1;
    } else {
      this.nextReservationId = 1;
    }
  }

  private loadFromLocalStorage(): Reservation[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Преобразуем строки дат обратно в объекты Date
        return parsed.map((r: any) => ({
          ...r,
          reservationTime: new Date(r.reservationTime),
          createdAt: new Date(r.createdAt)
        }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке бронирований из localStorage:', error);
    }
    return [];
  }

  private saveToLocalStorage(reservations: Reservation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error('Ошибка при сохранении бронирований в localStorage:', error);
    }
  }

  // Получить все бронирования
  getReservations(): Observable<Reservation[]> {
    return this.reservations$;
  }

  // Получить бронирование по ID
  getReservationById(id: number): Reservation | undefined {
    return this.reservationsSubject.value.find(r => r.id === id);
  }

  // Получить бронирование для столика
  getReservationByTableId(tableId: number): Reservation | undefined {
    return this.reservationsSubject.value.find(r => r.tableId === tableId);
  }

  // Создать бронирование
  createReservation(
    tableId: number,
    guestName: string,
    guestPhone: string,
    guestCount: number,
    reservationTime: Date,
    notes?: string
  ): Reservation {
    const newReservation: Reservation = {
      id: this.nextReservationId++,
      tableId,
      guestName,
      guestPhone,
      guestCount,
      reservationTime,
      notes,
      createdAt: new Date()
    };

    const reservations = this.reservationsSubject.value;
    const updated = [...reservations, newReservation];
    this.reservationsSubject.next(updated);
    this.saveToLocalStorage(updated);
    
    return newReservation;
  }

  // Отменить бронирование
  cancelReservation(reservationId: number): void {
    const reservations = this.reservationsSubject.value.filter(r => r.id !== reservationId);
    this.reservationsSubject.next(reservations);
    this.saveToLocalStorage(reservations);
  }

  // Удалить бронирование для столика
  cancelReservationByTableId(tableId: number): void {
    const reservations = this.reservationsSubject.value.filter(r => r.tableId !== tableId);
    this.reservationsSubject.next(reservations);
    this.saveToLocalStorage(reservations);
  }
}


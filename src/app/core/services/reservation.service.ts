import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservation } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  public reservations$ = this.reservationsSubject.asObservable();
  private nextReservationId = 1;

  constructor() {}

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
    this.reservationsSubject.next([...reservations, newReservation]);
    
    return newReservation;
  }

  // Отменить бронирование
  cancelReservation(reservationId: number): void {
    const reservations = this.reservationsSubject.value.filter(r => r.id !== reservationId);
    this.reservationsSubject.next(reservations);
  }

  // Удалить бронирование для столика
  cancelReservationByTableId(tableId: number): void {
    const reservations = this.reservationsSubject.value.filter(r => r.tableId !== tableId);
    this.reservationsSubject.next(reservations);
  }
}


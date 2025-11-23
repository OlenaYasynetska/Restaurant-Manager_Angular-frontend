import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff, Shift, StaffRole } from '../models/restaurant.models';
import { mockStaff, buildMockShifts } from '../../data/mock-staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly STAFF_STORAGE_KEY = 'restaurant_staff';
  private readonly SHIFTS_STORAGE_KEY = 'restaurant_shifts';

  private staffSubject = new BehaviorSubject<Staff[]>(this.loadStaff());
  private shiftsSubject = new BehaviorSubject<Shift[]>(this.loadShifts());
  
  staff$ = this.staffSubject.asObservable();
  shifts$ = this.shiftsSubject.asObservable();
  
  private nextStaffId = 6;
  private nextShiftId = 11;

  constructor() {
    const staff = this.staffSubject.value;
    if (staff.length > 0) {
      this.nextStaffId = Math.max(...staff.map(s => s.id)) + 1;
    }

    const shifts = this.shiftsSubject.value;
    if (shifts.length > 0) {
      this.nextShiftId = Math.max(...shifts.map(s => s.id)) + 1;
    }
  }

  // === СОТРУДНИКИ ===

  getStaff(): Observable<Staff[]> {
    return this.staff$;
  }

  getStaffById(id: number): Staff | undefined {
    return this.staffSubject.value.find(s => s.id === id);
  }

  addStaff(data: Partial<Staff>): Staff {
    const newStaff: Staff = {
      id: this.nextStaffId++,
      name: data.name || '',
      role: data.role || StaffRole.WAITER,
      phone: data.phone || '',
      email: data.email,
      hourlyRate: data.hourlyRate || 10,
      hiredDate: data.hiredDate || new Date(),
      active: data.active ?? true
    };

    const current = this.staffSubject.value;
    this.staffSubject.next([...current, newStaff]);
    this.saveStaff([...current, newStaff]);
    return newStaff;
  }

  updateStaff(id: number, data: Partial<Staff>): void {
    const current = this.staffSubject.value;
    const index = current.findIndex(s => s.id === id);
    
    if (index !== -1) {
      current[index] = { ...current[index], ...data, id };
      this.staffSubject.next([...current]);
      this.saveStaff(current);
    }
  }

  deleteStaff(id: number): void {
    const current = this.staffSubject.value;
    const next = current.filter(s => s.id !== id);
    this.staffSubject.next(next);
    this.saveStaff(next);
  }

  // === СМЕНЫ ===

  getShifts(): Observable<Shift[]> {
    return this.shifts$;
  }

  getShiftsByStaffId(staffId: number): Shift[] {
    return this.shiftsSubject.value.filter(s => s.staffId === staffId);
  }

  getShiftsByDateRange(startDate: Date, endDate: Date): Shift[] {
    return this.shiftsSubject.value.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate && shiftDate <= endDate;
    });
  }

  addShift(data: Partial<Shift>): Shift {
    const hours = this.calculateHours(data.startTime || '09:00', data.endTime || '18:00');
    
    const newShift: Shift = {
      id: this.nextShiftId++,
      staffId: data.staffId || 0,
      date: data.date || new Date(),
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '18:00',
      hours: hours,
      notes: data.notes,
      actualStartTime: data.actualStartTime,
      actualEndTime: data.actualEndTime
    };

    const current = this.shiftsSubject.value;
    const updated = [...current, newShift];
    this.shiftsSubject.next(updated);
    this.saveShifts(updated);
    return newShift;
  }

  updateShift(id: number, data: Partial<Shift>): void {
    const current = this.shiftsSubject.value;
    const index = current.findIndex(s => s.id === id);
    
    if (index !== -1) {
      const shift = current[index];
      const startTime = data.startTime || shift.startTime;
      const endTime = data.endTime || shift.endTime;
      const hours = this.calculateHours(startTime, endTime);
      
      const updated = [...current];
      updated[index] = { ...shift, ...data, id, hours };
      this.shiftsSubject.next(updated);
      this.saveShifts(updated);
    }
  }

  deleteShift(id: number): void {
    const current = this.shiftsSubject.value;
    const next = current.filter(s => s.id !== id);
    this.shiftsSubject.next(next);
    this.saveShifts(next);
  }

  // === РАСЧЕТЫ ===

  // Рассчитать количество часов между startTime и endTime
  calculateHours(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60; // Если смена через полночь
    
    return Math.round(diff / 60 * 100) / 100; // Округление до 2 знаков
  }

  // Рассчитать общее количество часов для сотрудника за период
  calculateTotalHours(staffId: number, startDate: Date, endDate: Date): number {
    const shifts = this.getShiftsByDateRange(startDate, endDate)
      .filter(s => s.staffId === staffId);
    
    return shifts.reduce((total, shift) => total + shift.hours, 0);
  }

  // Рассчитать зарплату для сотрудника за период
  calculateSalary(staffId: number, startDate: Date, endDate: Date): number {
    const staff = this.getStaffById(staffId);
    if (!staff) return 0;
    
    const totalHours = this.calculateTotalHours(staffId, startDate, endDate);
    return totalHours * staff.hourlyRate;
  }

  // Локальное хранилище

  private loadStaff(): Staff[] {
    const saved = localStorage.getItem(this.STAFF_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error('Не удалось разобрать сотрудников из localStorage');
      }
    }

    this.saveStaff(mockStaff);
    return mockStaff;
  }

  private saveStaff(staff: Staff[]): void {
    localStorage.setItem(this.STAFF_STORAGE_KEY, JSON.stringify(staff));
  }

  private loadShifts(): Shift[] {
    const saved = localStorage.getItem(this.SHIFTS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Shift[] = JSON.parse(saved);
        return parsed.map(shift => ({
          ...shift,
          date: new Date(shift.date)
        }));
      } catch {
        console.error('Не удалось разобрать смены из localStorage');
      }
    }

    const fallback = buildMockShifts();
    this.saveShifts(fallback);
    return fallback;
  }

  private saveShifts(shifts: Shift[]): void {
    localStorage.setItem(this.SHIFTS_STORAGE_KEY, JSON.stringify(shifts));
  }

}


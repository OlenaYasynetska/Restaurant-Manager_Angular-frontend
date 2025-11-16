import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff, Shift, StaffRole } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffSubject = new BehaviorSubject<Staff[]>(this.getMockStaff());
  private shiftsSubject = new BehaviorSubject<Shift[]>(this.getMockShifts());
  
  staff$ = this.staffSubject.asObservable();
  shifts$ = this.shiftsSubject.asObservable();
  
  private nextStaffId = 6;
  private nextShiftId = 11;

  constructor() {}

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
    return newStaff;
  }

  updateStaff(id: number, data: Partial<Staff>): void {
    const current = this.staffSubject.value;
    const index = current.findIndex(s => s.id === id);
    
    if (index !== -1) {
      current[index] = { ...current[index], ...data, id };
      this.staffSubject.next([...current]);
    }
  }

  deleteStaff(id: number): void {
    const current = this.staffSubject.value;
    this.staffSubject.next(current.filter(s => s.id !== id));
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
      notes: data.notes
    };

    const current = this.shiftsSubject.value;
    this.shiftsSubject.next([...current, newShift]);
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
      
      current[index] = { ...shift, ...data, id, hours };
      this.shiftsSubject.next([...current]);
    }
  }

  deleteShift(id: number): void {
    const current = this.shiftsSubject.value;
    this.shiftsSubject.next(current.filter(s => s.id !== id));
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

  // === MOCK DATA ===

  private getMockStaff(): Staff[] {
    return [
      {
        id: 1,
        name: 'Иванов Иван',
        role: StaffRole.WAITER,
        phone: '+7 (999) 123-45-67',
        email: 'ivanov@restaurant.com',
        hourlyRate: 8,
        hiredDate: new Date('2024-01-15'),
        active: true
      },
      {
        id: 2,
        name: 'Петрова Мария',
        role: StaffRole.WAITER,
        phone: '+7 (999) 234-56-78',
        email: 'petrova@restaurant.com',
        hourlyRate: 8,
        hiredDate: new Date('2024-02-01'),
        active: true
      },
      {
        id: 3,
        name: 'Сидоров Петр',
        role: StaffRole.COOK,
        phone: '+7 (999) 345-67-89',
        email: 'sidorov@restaurant.com',
        hourlyRate: 12,
        hiredDate: new Date('2023-11-10'),
        active: true
      },
      {
        id: 4,
        name: 'Козлова Анна',
        role: StaffRole.BARTENDER,
        phone: '+7 (999) 456-78-90',
        email: 'kozlova@restaurant.com',
        hourlyRate: 10,
        hiredDate: new Date('2024-03-01'),
        active: true
      },
      {
        id: 5,
        name: 'Смирнов Алексей',
        role: StaffRole.MANAGER,
        phone: '+7 (999) 567-89-01',
        email: 'smirnov@restaurant.com',
        hourlyRate: 15,
        hiredDate: new Date('2023-09-01'),
        active: true
      }
    ];
  }

  private getMockShifts(): Shift[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      // Вчера
      { id: 1, staffId: 1, date: yesterday, startTime: '10:00', endTime: '18:00', hours: 8, notes: '' },
      { id: 2, staffId: 2, date: yesterday, startTime: '14:00', endTime: '22:00', hours: 8, notes: '' },
      { id: 3, staffId: 3, date: yesterday, startTime: '09:00', endTime: '17:00', hours: 8, notes: '' },
      
      // Сегодня
      { id: 4, staffId: 1, date: today, startTime: '10:00', endTime: '18:00', hours: 8, notes: '' },
      { id: 5, staffId: 2, date: today, startTime: '14:00', endTime: '22:00', hours: 8, notes: '' },
      { id: 6, staffId: 3, date: today, startTime: '09:00', endTime: '17:00', hours: 8, notes: '' },
      { id: 7, staffId: 4, date: today, startTime: '16:00', endTime: '00:00', hours: 8, notes: '' },
      
      // Завтра
      { id: 8, staffId: 1, date: tomorrow, startTime: '10:00', endTime: '18:00', hours: 8, notes: '' },
      { id: 9, staffId: 3, date: tomorrow, startTime: '09:00', endTime: '17:00', hours: 8, notes: '' },
      { id: 10, staffId: 5, date: tomorrow, startTime: '12:00', endTime: '20:00', hours: 8, notes: '' },
    ];
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { Staff, Shift, StaffRole } from '../../core/models/restaurant.models';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './staff.component.html',
})
export class StaffComponent implements OnInit {
  staff$ = this.staffService.getStaff();
  shifts$ = this.staffService.getShifts();
  
  // Модальные окна
  showStaffModal = false;
  showShiftModal = false;
  editingStaff: Staff | null = null;
  editingShift: Shift | null = null;
  
  // Фильтры
  selectedStaffId: number | 'all' = 'all';
  private weekOffset = 0;
  currentWeekDates: Date[] = [];
  
  // Форма сотрудника
  staffForm = {
    name: '',
    role: StaffRole.WAITER,
    phone: '',
    email: '',
    hourlyRate: 8,
    hiredDate: new Date().toISOString().slice(0, 10),
    active: true
  };
  
  // Форма смены
  shiftForm = {
    staffId: 0,
    date: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '18:00',
    notes: '',
    actualStartTime: '',
    actualEndTime: ''
  };
  
  // Роли
  roles = [
    { value: StaffRole.WAITER, label: 'Официант' },
    { value: StaffRole.COOK, label: 'Повар' },
    { value: StaffRole.BARTENDER, label: 'Бармен' },
    { value: StaffRole.MANAGER, label: 'Менеджер' },
    { value: StaffRole.HOSTESS, label: 'Хостес' },
  ];

  constructor(
    private staffService: StaffService,
    public languageService: LanguageService
  ) {
    this.setWeekRange(0);
  }

  ngOnInit(): void {}

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  // === ФИЛЬТРАЦИЯ ===

  getFilteredShifts(shifts: Shift[] | null): Shift[] {
    if (!shifts) return [];
    
    const filteredByStaff = this.selectedStaffId === 'all'
      ? shifts
      : shifts.filter(s => s.staffId === this.selectedStaffId);

    const rangeFiltered = filteredByStaff.filter(s => this.isWithinCurrentWeek(s.date));

    return [...rangeFiltered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // === СОТРУДНИКИ ===

  openCreateStaffModal(): void {
    this.editingStaff = null;
    this.staffForm = {
      name: '',
      role: StaffRole.WAITER,
      phone: '',
      email: '',
      hourlyRate: 8,
      hiredDate: new Date().toISOString().slice(0, 10),
      active: true
    };
    this.showStaffModal = true;
  }

  openEditStaffModal(staff: Staff): void {
    this.editingStaff = staff;
    this.staffForm = {
      name: staff.name,
      role: staff.role,
      phone: staff.phone,
      email: staff.email || '',
      hourlyRate: staff.hourlyRate,
      hiredDate: new Date(staff.hiredDate).toISOString().slice(0, 10),
      active: staff.active
    };
    this.showStaffModal = true;
  }

  closeStaffModal(): void {
    this.showStaffModal = false;
    this.editingStaff = null;
  }

  saveStaff(): void {
    if (!this.staffForm.name.trim()) {
      alert('Введите имя сотрудника');
      return;
    }

    const data = {
      ...this.staffForm,
      hiredDate: new Date(this.staffForm.hiredDate)
    };

    if (this.editingStaff) {
      this.staffService.updateStaff(this.editingStaff.id, data);
    } else {
      this.staffService.addStaff(data);
    }

    this.closeStaffModal();
  }

  deleteStaff(staff: Staff): void {
    if (confirm(`Удалить сотрудника "${staff.name}"?`)) {
      this.staffService.deleteStaff(staff.id);
    }
  }

  toggleStaffActive(staff: Staff): void {
    this.staffService.updateStaff(staff.id, { active: !staff.active });
  }

  // === СМЕНЫ ===

  openCreateShiftModal(): void {
    this.editingShift = null;
    this.shiftForm = {
      staffId: 0,
      date: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '18:00',
      notes: '',
      actualStartTime: '',
      actualEndTime: ''
    };
    this.showShiftModal = true;
  }

  openEditShiftModal(shift: Shift): void {
    this.editingShift = shift;
    this.shiftForm = {
      staffId: shift.staffId,
      date: new Date(shift.date).toISOString().slice(0, 10),
      startTime: shift.startTime,
      endTime: shift.endTime,
      notes: shift.notes || '',
      actualStartTime: shift.actualStartTime || '',
      actualEndTime: shift.actualEndTime || ''
    };
    this.showShiftModal = true;
  }

  closeShiftModal(): void {
    this.showShiftModal = false;
    this.editingShift = null;
  }

  saveShift(): void {
    if (this.shiftForm.staffId === 0 || !this.shiftForm.staffId) {
      alert('Пожалуйста, выберите сотрудника');
      return;
    }

    if (!this.shiftForm.date) {
      alert('Пожалуйста, выберите дату');
      return;
    }

    if (!this.shiftForm.startTime || !this.shiftForm.endTime) {
      alert('Пожалуйста, укажите время начала и окончания');
      return;
    }

    const data = {
      ...this.shiftForm,
      date: new Date(this.shiftForm.date)
    };

    if (this.editingShift) {
      this.staffService.updateShift(this.editingShift.id, data);
    } else {
      this.staffService.addShift(data);
    }

    this.closeShiftModal();
  }

  deleteShift(shift: Shift): void {
    if (confirm('Удалить эту смену?')) {
      this.staffService.deleteShift(shift.id);
    }
  }

  // === РАСЧЕТЫ ===

  getTotalHours(): number {
    const start = this.getWeekStartDate();
    const end = this.getWeekEndDate();
    if (!start || !end) return 0;
    
    if (this.selectedStaffId === 'all') {
      return this.staffService.getShiftsByDateRange(start, end)
        .reduce((total, shift) => total + shift.hours, 0);
    }

    return this.staffService.calculateTotalHours(this.selectedStaffId as number, start, end);
  }

  getTotalSalary(): number {
    const start = this.getWeekStartDate();
    const end = this.getWeekEndDate();
    if (!start || !end || this.selectedStaffId === 'all') return 0;

    return this.staffService.calculateSalary(this.selectedStaffId as number, start, end);
  }

  // Часы за текущую неделю (неделя, которая сейчас отображается)
  getCurrentWeekHours(): number {
    const start = this.getWeekStartDate();
    const end = this.getWeekEndDate();
    if (!start || !end) return 0;
    
    if (this.selectedStaffId === 'all') {
      return this.staffService.getShiftsByDateRange(start, end)
        .reduce((total, shift) => total + shift.hours, 0);
    }

    return this.staffService.calculateTotalHours(this.selectedStaffId as number, start, end);
  }

  // Часы за текущий месяц (с учетом пересечения недели с границей месяца)
  getCurrentMonthHours(): number {
    const today = new Date();
    const weekStart = this.getWeekStartDate();
    const weekEnd = this.getWeekEndDate();
    
    if (!weekStart || !weekEnd) return 0;
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const weekStartMonth = weekStart.getMonth();
    const weekStartYear = weekStart.getFullYear();
    const weekEndMonth = weekEnd.getMonth();
    const weekEndYear = weekEnd.getFullYear();
    
    // Если неделя пересекает границу месяца (начинается в прошлом, заканчивается в текущем)
    const crossesMonthBoundary = (weekStartMonth !== currentMonth || weekStartYear !== currentYear) && 
                                  (weekEndMonth === currentMonth && weekEndYear === currentYear);
    
    let totalHours = 0;
    
    if (crossesMonthBoundary) {
      // Суммируем часы за оба месяца: прошлый + текущий
      // Часы за прошлый месяц (полностью)
      const prevMonthEnd = new Date(weekStartYear, weekStartMonth + 1, 0);
      const prevMonthStart = new Date(weekStartYear, weekStartMonth, 1);
      
      // Часы за текущий месяц (полностью)
      const currentMonthStart = new Date(currentYear, currentMonth, 1);
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      if (this.selectedStaffId === 'all') {
        totalHours += this.staffService.getShiftsByDateRange(prevMonthStart, prevMonthEnd)
          .reduce((total, shift) => total + shift.hours, 0);
        totalHours += this.staffService.getShiftsByDateRange(currentMonthStart, currentMonthEnd)
          .reduce((total, shift) => total + shift.hours, 0);
      } else {
        totalHours += this.staffService.calculateTotalHours(this.selectedStaffId as number, prevMonthStart, prevMonthEnd);
        totalHours += this.staffService.calculateTotalHours(this.selectedStaffId as number, currentMonthStart, currentMonthEnd);
      }
    } else if (weekStartMonth === currentMonth && weekStartYear === currentYear) {
      // Неделя полностью в текущем месяце - считаем часы за весь текущий месяц
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      if (this.selectedStaffId === 'all') {
        totalHours = this.staffService.getShiftsByDateRange(monthStart, monthEnd)
          .reduce((total, shift) => total + shift.hours, 0);
      } else {
        totalHours = this.staffService.calculateTotalHours(this.selectedStaffId as number, monthStart, monthEnd);
      }
    } else {
      // Неделя в другом месяце
      // Если неделя в будущем (начинается позже сегодняшней даты), показываем часы за текущий календарный месяц
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const weekStartDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
      
      if (weekStartDate > todayStart) {
        // Неделя в будущем - показываем часы за текущий календарный месяц
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);
        
        if (this.selectedStaffId === 'all') {
          totalHours = this.staffService.getShiftsByDateRange(monthStart, monthEnd)
            .reduce((total, shift) => total + shift.hours, 0);
        } else {
          totalHours = this.staffService.calculateTotalHours(this.selectedStaffId as number, monthStart, monthEnd);
        }
      } else {
        // Неделя в прошлом месяце - считаем часы за этот месяц
        const weekMonthStart = new Date(weekStartYear, weekStartMonth, 1);
        const weekMonthEnd = new Date(weekStartYear, weekStartMonth + 1, 0);
        
        if (this.selectedStaffId === 'all') {
          totalHours = this.staffService.getShiftsByDateRange(weekMonthStart, weekMonthEnd)
            .reduce((total, shift) => total + shift.hours, 0);
        } else {
          totalHours = this.staffService.calculateTotalHours(this.selectedStaffId as number, weekMonthStart, weekMonthEnd);
        }
      }
    }
    
    return totalHours;
  }

  // Часы сотрудника за текущую неделю
  getStaffWeekHours(staffId: number): number {
    const start = this.getWeekStartDate();
    const end = this.getWeekEndDate();
    if (!start || !end) return 0;
    return this.staffService.calculateTotalHours(staffId, start, end);
  }

  // Часы сотрудника за текущий месяц (с учетом пересечения недели с границей месяца)
  getStaffMonthHours(staffId: number): number {
    const today = new Date();
    const weekStart = this.getWeekStartDate();
    const weekEnd = this.getWeekEndDate();
    
    if (!weekStart || !weekEnd) return 0;
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const weekStartMonth = weekStart.getMonth();
    const weekStartYear = weekStart.getFullYear();
    const weekEndMonth = weekEnd.getMonth();
    const weekEndYear = weekEnd.getFullYear();
    
    // Если неделя пересекает границу месяца (начинается в прошлом, заканчивается в текущем)
    const crossesMonthBoundary = (weekStartMonth !== currentMonth || weekStartYear !== currentYear) && 
                                  (weekEndMonth === currentMonth && weekEndYear === currentYear);
    
    let totalHours = 0;
    
    if (crossesMonthBoundary) {
      // Суммируем часы за оба месяца: прошлый + текущий
      // Часы за прошлый месяц (полностью)
      const prevMonthEnd = new Date(weekStartYear, weekStartMonth + 1, 0);
      const prevMonthStart = new Date(weekStartYear, weekStartMonth, 1);
      
      // Часы за текущий месяц (полностью)
      const currentMonthStart = new Date(currentYear, currentMonth, 1);
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      totalHours += this.staffService.calculateTotalHours(staffId, prevMonthStart, prevMonthEnd);
      totalHours += this.staffService.calculateTotalHours(staffId, currentMonthStart, currentMonthEnd);
    } else if (weekStartMonth === currentMonth && weekStartYear === currentYear) {
      // Неделя полностью в текущем месяце - считаем часы за весь текущий месяц
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      totalHours = this.staffService.calculateTotalHours(staffId, monthStart, monthEnd);
    } else {
      // Неделя в другом месяце
      // Если неделя в будущем (начинается позже сегодняшней даты), показываем часы за текущий календарный месяц
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const weekStartDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
      
      if (weekStartDate > todayStart) {
        // Неделя в будущем - показываем часы за текущий календарный месяц
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);
        totalHours = this.staffService.calculateTotalHours(staffId, monthStart, monthEnd);
      } else {
        // Неделя в прошлом месяце - считаем часы за этот месяц
        const weekMonthStart = new Date(weekStartYear, weekStartMonth, 1);
        const weekMonthEnd = new Date(weekStartYear, weekStartMonth + 1, 0);
        totalHours = this.staffService.calculateTotalHours(staffId, weekMonthStart, weekMonthEnd);
      }
    }
    
    return totalHours;
  }

  // === УТИЛИТЫ ===

  getStaff(staffId: number, staffList: Staff[] | null): Staff | null {
    if (!staffList) return null;
    return staffList.find(s => s.id === staffId) || null;
  }

  getStaffName(staffId: number, staffList: Staff[] | null): string {
    if (!staffList) return 'Неизвестно';
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.name : 'Неизвестно';
  }

  getStaffRole(staffId: number, staffList: Staff[] | null): StaffRole | null {
    if (!staffList) return null;
    const staff = staffList.find(s => s.id === staffId);
    return staff ? staff.role : null;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `€${price.toLocaleString('ru-RU')}`;
  }

  private buildWeekDates(offset: number): Date[] {
    const today = new Date();
    const day = today.getDay();
    const shiftToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(today);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(today.getDate() + shiftToMonday + offset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  }

  private setWeekRange(offset: number): void {
    this.weekOffset = offset;
    this.currentWeekDates = this.buildWeekDates(offset);
  }

  changeWeek(direction: number): void {
    this.setWeekRange(this.weekOffset + direction);
  }

  getWeekRangeLabel(): string {
    if (this.currentWeekDates.length === 0) return '';
    const start = this.currentWeekDates[0];
    const end = this.currentWeekDates[this.currentWeekDates.length - 1];
    const options = { day: '2-digit', month: 'short' } as const;
    return `${start.toLocaleDateString('ru-RU', options)} — ${end.toLocaleDateString('ru-RU', options)}`;
  }

  getDayLabel(date: Date): string {
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: '2-digit' });
  }

  getWeekStartDate(): Date | null {
    return this.currentWeekDates[0] || null;
  }

  getWeekEndDate(): Date | null {
    return this.currentWeekDates[this.currentWeekDates.length - 1] || null;
  }

  isWithinCurrentWeek(date: Date | string): boolean {
    const start = this.getWeekStartDate();
    const end = this.getWeekEndDate();
    if (!start || !end) return false;
    const target = new Date(date);
    return target >= start && target <= end;
  }

  getShiftsForCell(shifts: Shift[] | null, staffId: number, date: Date): Shift[] {
    if (!shifts) return [];
    return shifts.filter(shift => shift.staffId === staffId && this.isSameDay(shift.date, date));
  }

  private isSameDay(first: Date | string, second: Date): boolean {
    const a = new Date(first);
    return a.getFullYear() === second.getFullYear() &&
      a.getMonth() === second.getMonth() &&
      a.getDate() === second.getDate();
  }

  openShiftOnDate(staffId: number, date: Date): void {
    this.editingShift = null;
    this.shiftForm = {
      staffId,
      date: this.toIsoDate(date),
      startTime: '09:00',
      endTime: '18:00',
      notes: '',
      actualStartTime: '',
      actualEndTime: ''
    };
    this.showShiftModal = true;
  }

  onActualTimeChange(shift: Shift, field: 'actualStartTime' | 'actualEndTime', value: string): void {
    this.staffService.updateShift(shift.id, { [field]: value });
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  getRoleColor(role: StaffRole): string {
    const colors: Record<StaffRole, string> = {
      [StaffRole.WAITER]: 'bg-blue-100 text-blue-700',
      [StaffRole.COOK]: 'bg-orange-100 text-orange-700',
      [StaffRole.BARTENDER]: 'bg-purple-100 text-purple-700',
      [StaffRole.MANAGER]: 'bg-green-100 text-green-700',
      [StaffRole.HOSTESS]: 'bg-pink-100 text-pink-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  }
}

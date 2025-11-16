import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../core/services/staff.service';
import { Staff, Shift, StaffRole } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  startDate: string = '';
  endDate: string = '';
  
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
    notes: ''
  };
  
  // Роли
  roles = [
    { value: StaffRole.WAITER, label: 'Официант' },
    { value: StaffRole.COOK, label: 'Повар' },
    { value: StaffRole.BARTENDER, label: 'Бармен' },
    { value: StaffRole.MANAGER, label: 'Менеджер' },
    { value: StaffRole.HOSTESS, label: 'Хостес' },
  ];

  constructor(private staffService: StaffService) {
    // Установить даты по умолчанию (текущая неделя)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Понедельник
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Воскресенье
    
    this.startDate = weekStart.toISOString().slice(0, 10);
    this.endDate = weekEnd.toISOString().slice(0, 10);
  }

  ngOnInit(): void {}

  // === ФИЛЬТРАЦИЯ ===

  getFilteredShifts(shifts: Shift[] | null): Shift[] {
    if (!shifts) return [];
    
    let filtered = shifts;
    
    // Фильтр по сотруднику
    if (this.selectedStaffId !== 'all') {
      filtered = filtered.filter(s => s.staffId === this.selectedStaffId);
    }
    
    // Фильтр по датам
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(s => {
        const date = new Date(s.date);
        return date >= start && date <= end;
      });
    }
    
    // Сортировка по дате (новые сверху)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      notes: ''
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
      notes: shift.notes || ''
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
    if (!this.startDate || !this.endDate) return 0;
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    if (this.selectedStaffId === 'all') {
      // Всего часов для всех сотрудников
      return this.staffService.getShiftsByDateRange(start, end)
        .reduce((total, shift) => total + shift.hours, 0);
    } else {
      // Часы конкретного сотрудника
      return this.staffService.calculateTotalHours(this.selectedStaffId as number, start, end);
    }
  }

  getTotalSalary(): number {
    if (!this.startDate || !this.endDate || this.selectedStaffId === 'all') return 0;
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    return this.staffService.calculateSalary(this.selectedStaffId as number, start, end);
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

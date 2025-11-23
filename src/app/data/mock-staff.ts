import { Staff, Shift, StaffRole } from '../core/models/restaurant.models';

export const mockStaff: Staff[] = [
  {
    id: 1,
    name: 'Иванов Иван',
    role: StaffRole.WAITER,
    phone: '+43 662 123-45-67',
    email: 'ivanov@restaurant.com',
    hourlyRate: 8,
    hiredDate: new Date('2024-01-15'),
    active: true
  },
  {
    id: 2,
    name: 'Петрова Мария',
    role: StaffRole.WAITER,
    phone: '+43 662 234-56-78',
    email: 'petrova@restaurant.com',
    hourlyRate: 8,
    hiredDate: new Date('2024-02-01'),
    active: true
  },
  {
    id: 3,
    name: 'Сидоров Петр',
    role: StaffRole.COOK,
    phone: '+43 662 345-67-89',
    email: 'sidorov@restaurant.com',
    hourlyRate: 12,
    hiredDate: new Date('2023-11-10'),
    active: true
  },
  {
    id: 4,
    name: 'Козлова Анна',
    role: StaffRole.BARTENDER,
    phone: '+43 662 456-78-90',
    email: 'kozlova@restaurant.com',
    hourlyRate: 10,
    hiredDate: new Date('2024-03-01'),
    active: true
  },
  {
    id: 5,
    name: 'Смирнов Алексей',
    role: StaffRole.MANAGER,
    phone: '+43 662 567-89-01',
    email: 'smirnov@restaurant.com',
    hourlyRate: 15,
    hiredDate: new Date('2023-09-01'),
    active: true
  }
];

export function buildMockShifts(): Shift[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    { id: 1, staffId: 1, date: yesterday, startTime: '10:00', endTime: '18:00', hours: 8, notes: '', actualStartTime: '10:00', actualEndTime: '18:00' },
    { id: 2, staffId: 2, date: yesterday, startTime: '14:00', endTime: '22:00', hours: 8, notes: '', actualStartTime: '14:00', actualEndTime: '22:00' },
    { id: 3, staffId: 3, date: yesterday, startTime: '09:00', endTime: '17:00', hours: 8, notes: '', actualStartTime: '09:00', actualEndTime: '17:00' },

    { id: 4, staffId: 1, date: today, startTime: '10:00', endTime: '18:00', hours: 8, notes: '', actualStartTime: '10:00', actualEndTime: '18:00' },
    { id: 5, staffId: 2, date: today, startTime: '14:00', endTime: '22:00', hours: 8, notes: '', actualStartTime: '14:00', actualEndTime: '22:00' },
    { id: 6, staffId: 3, date: today, startTime: '09:00', endTime: '17:00', hours: 8, notes: '', actualStartTime: '09:00', actualEndTime: '17:00' },
    { id: 7, staffId: 4, date: today, startTime: '16:00', endTime: '00:00', hours: 8, notes: '', actualStartTime: '16:00', actualEndTime: '00:00' },

    { id: 8, staffId: 1, date: tomorrow, startTime: '10:00', endTime: '18:00', hours: 8, notes: '', actualStartTime: '10:00', actualEndTime: '18:00' },
    { id: 9, staffId: 3, date: tomorrow, startTime: '09:00', endTime: '17:00', hours: 8, notes: '', actualStartTime: '09:00', actualEndTime: '17:00' },
    { id: 10, staffId: 5, date: tomorrow, startTime: '12:00', endTime: '20:00', hours: 8, notes: '', actualStartTime: '12:00', actualEndTime: '20:00' }
  ];
}


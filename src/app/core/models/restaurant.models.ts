// Статусы столика
export enum TableStatus {
  FREE = 'free',           // свободен
  RESERVED = 'reserved',   // забронирован
  OCCUPIED = 'occupied',   // занято
  WAITING_PAYMENT = 'waiting_payment', // ждёт оплаты
  CLOSED = 'closed'        // закрыт
}

// Бронирование столика
export interface Reservation {
  id: number;
  tableId: number;
  guestName: string;       // имя гостя
  guestPhone: string;      // телефон гостя
  guestCount: number;      // количество гостей
  reservationTime: Date;   // время бронирования
  notes?: string;          // дополнительные заметки
  createdAt: Date;
}

// Столик
export interface Table {
  id: number;
  number: string;          // номер столика (например, "1", "A1")
  status: TableStatus;
  activeOrderId: number | null;
  reservationId?: number | null; // ID бронирования, если есть
  seats?: number;          // количество мест
}

// Статусы заказа
export enum OrderStatus {
  NEW = 'new',                     // создан
  IN_PROGRESS = 'in_progress',     // готовится
  SERVED = 'served',               // подано
  WAITING_PAYMENT = 'waiting_payment', // ожидает оплаты
  PAID = 'paid'                    // оплачен
}

// Позиция заказа
export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;        // price * quantity
  notes?: string;          // комментарий к блюду
}

// Заказ
export interface Order {
  id: number;
  tableId: number;
  tableNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  waiterId?: number;       // ID официанта
  waiterName?: string;
}

// Категория меню
export enum MenuCategory {
  APPETIZERS = 'Закуски',
  SOUPS = 'Супы',
  MAIN_DISHES = 'Горячие блюда',
  PASTA = 'Паста',
  SALADS = 'Салаты',
  DESSERTS = 'Десерты',
  DRINKS = 'Напитки',
  ALCOHOL = 'Алкоголь'
}

// Позиция меню
export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  image?: string;
  available: boolean;      // доступно для заказа
  preparationTime?: number; // время приготовления в минутах
}

// Способ оплаты
export enum PaymentMethod {
  CASH = 'cash',           // наличные
  CARD = 'card',           // карта
  QR = 'qr',               // QR-код
  MIXED = 'mixed'          // частичная оплата
}

// Данные оплаты
export interface Payment {
  orderId: number;
  method: PaymentMethod;
  amount: number;
  cashAmount?: number;     // для частичной оплаты
  cardAmount?: number;
  change?: number;         // сдача
  paidAt: Date;
}

// Должность сотрудника
export enum StaffRole {
  WAITER = 'Официант',
  COOK = 'Повар',
  BARTENDER = 'Бармен',
  MANAGER = 'Менеджер',
  HOSTESS = 'Хостес'
}

// Сотрудник
export interface Staff {
  id: number;
  name: string;
  role: StaffRole;
  phone: string;
  email?: string;
  hourlyRate: number;  // Ставка в час (€)
  hiredDate: Date;
  active: boolean;
}

// Смена (рабочий день)
export interface Shift {
  id: number;
  staffId: number;
  date: Date;
  startTime: string;   // Время начала (HH:MM)
  endTime: string;     // Время окончания (HH:MM)
  hours: number;       // Количество часов
  notes?: string;
}


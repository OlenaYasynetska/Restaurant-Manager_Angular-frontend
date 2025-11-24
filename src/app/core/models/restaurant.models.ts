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

export interface TranslatedText {
  ru: string;
  en: string;
  de: string;
}

export interface MenuItemTranslations {
  name: TranslatedText;
  description?: TranslatedText;
}

// Позиция меню
export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  image?: string;          // эмодзи или иконка
  imageUrl?: string;       // URL реального фото блюда
  available: boolean;      // доступно для заказа
  preparationTime?: number; // время приготовления в минутах
  translations?: MenuItemTranslations;
}

export interface WarehouseItemTranslations {
  name?: TranslatedText;
  supplier?: TranslatedText;
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
  actualStartTime?: string; // Фактическое прибытие
  actualEndTime?: string;   // Фактическое увольнение
}

// Единицы измерения
export enum Unit {
  KG = 'кг',
  G = 'г',
  L = 'л',
  ML = 'мл',
  PCS = 'шт',
  PACK = 'уп'
}

// Категория товара на складе
export enum WarehouseCategory {
  MEAT = 'Мясо',
  FISH = 'Рыба',
  VEGETABLES = 'Овощи',
  FRUITS = 'Фрукты',
  DAIRY = 'Молочные продукты',
  CEREALS = 'Крупы и макароны',
  SPICES = 'Специи',
  DRINKS = 'Напитки',
  ALCOHOL = 'Алкоголь',
  OTHER = 'Прочее'
}

// Тип операции склада
export enum OperationType {
  INCOMING = 'Приход',
  OUTGOING = 'Расход',
  WRITE_OFF = 'Списание'
}

// Товар на складе
export interface WarehouseItemTranslations {
  name?: TranslatedText;
  supplier?: TranslatedText;
}

export interface WarehouseItem {
  id: number;
  name: string;
  category: WarehouseCategory;
  quantity: number;        // Текущее количество
  unit: Unit;              // Единица измерения
  minQuantity: number;     // Минимальный остаток (для оповещения)
  price: number;           // Цена за единицу (€)
  supplier?: string;       // Поставщик
  lastUpdated: Date;
  translations?: WarehouseItemTranslations;
}

export interface WarehouseOperationTranslations {
  notes?: TranslatedText;
}

// Операция на складе
export interface WarehouseOperation {
  id: number;
  itemId: number;
  itemName: string;
  type: OperationType;
  quantity: number;
  unit: Unit;
  date: Date;
  notes?: string;
  userId?: number;         // Кто провел операцию
  userName?: string;
  translations?: WarehouseOperationTranslations;
}

// Ингредиент в рецепте (технологической карте)
export interface RecipeIngredient {
  warehouseItemId: number;   // ID товара на складе
  warehouseItemName: string; // Название товара
  quantity: number;          // Количество на 1 порцию
  unit: Unit;                // Единица измерения
}

// Рецепт блюда (технологическая карта)
export interface Recipe {
  id: number;
  menuItemId: number;        // ID блюда в меню
  menuItemName: string;      // Название блюда
  ingredients: RecipeIngredient[]; // Ингредиенты
  description?: string;      // Описание приготовления
}


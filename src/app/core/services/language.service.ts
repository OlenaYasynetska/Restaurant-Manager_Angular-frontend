import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'ru' | 'en' | 'de';

export interface Translations {
  [key: string]: {
    ru: string;
    en: string;
    de: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'restaurant_language';
  private currentLanguageSubject = new BehaviorSubject<Language>(this.getStoredLanguage());
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    'app.title': {
      ru: 'Restaurant Manager',
      en: 'Restaurant Manager',
      de: 'Restaurant Manager'
    },
    'app.subtitle': {
      ru: 'Система управления рестораном',
      en: 'Restaurant Management System',
      de: 'Restaurant-Verwaltungssystem'
    },
    'login.title': {
      ru: 'Вход в систему',
      en: 'System Login',
      de: 'Systemanmeldung'
    },
    'login.username': {
      ru: 'Имя пользователя',
      en: 'Username',
      de: 'Benutzername'
    },
    'login.username.placeholder': {
      ru: 'Введите имя пользователя',
      en: 'Enter username',
      de: 'Benutzername eingeben'
    },
    'login.password': {
      ru: 'Пароль',
      en: 'Password',
      de: 'Passwort'
    },
    'login.password.placeholder': {
      ru: 'Введите пароль',
      en: 'Enter password',
      de: 'Passwort eingeben'
    },
    'login.button': {
      ru: 'Войти',
      en: 'Log In',
      de: 'Anmelden'
    },
    'login.loading': {
      ru: 'Вход...',
      en: 'Logging in...',
      de: 'Anmeldung...'
    },
    'login.error.fill': {
      ru: 'Пожалуйста, заполните все поля',
      en: 'Please fill in all fields',
      de: 'Bitte füllen Sie alle Felder aus'
    },
    'login.error.invalid': {
      ru: 'Неверные данные для входа',
      en: 'Invalid login credentials',
      de: 'Ungültige Anmeldedaten'
    },
    'login.error.general': {
      ru: 'Произошла ошибка при входе',
      en: 'An error occurred during login',
      de: 'Ein Fehler ist bei der Anmeldung aufgetreten'
    },
    'login.demo': {
      ru: 'Демо-доступ: любое имя пользователя и пароль',
      en: 'Demo access: any username and password',
      de: 'Demo-Zugang: beliebiger Benutzername und Passwort'
    },
    'footer.copyright': {
      ru: '© 2024 Restaurant Manager. Все права защищены.',
      en: '© 2024 Restaurant Manager. All rights reserved.',
      de: '© 2024 Restaurant Manager. Alle Rechte vorbehalten.'
    },
    // Navigation
    'nav.dashboard': {
      ru: 'Панель управления',
      en: 'Dashboard',
      de: 'Dashboard'
    },
    'nav.tables': {
      ru: 'Столики',
      en: 'Tables',
      de: 'Tische'
    },
    'nav.menu': {
      ru: 'Меню',
      en: 'Menu',
      de: 'Speisekarte'
    },
    'nav.menu.management': {
      ru: 'Управление меню',
      en: 'Menu Management',
      de: 'Menüverwaltung'
    },
    'nav.staff': {
      ru: 'Персонал',
      en: 'Staff',
      de: 'Personal'
    },
    'nav.analytics': {
      ru: 'Аналитика',
      en: 'Analytics',
      de: 'Analysen'
    },
    'nav.warehouse': {
      ru: 'Склад',
      en: 'Warehouse',
      de: 'Lager'
    },
    'nav.settings': {
      ru: 'Настройки',
      en: 'Settings',
      de: 'Einstellungen'
    },
    // Header
    'header.welcome': {
      ru: 'Добро пожаловать в систему управления рестораном!',
      en: 'Welcome to the Restaurant Management System!',
      de: 'Willkommen im Restaurant-Verwaltungssystem!'
    },
    'header.user': {
      ru: 'Пользователь:',
      en: 'User:',
      de: 'Benutzer:'
    },
    'header.logout': {
      ru: 'Выйти',
      en: 'Logout',
      de: 'Abmelden'
    },
    // Common
    'common.add': {
      ru: 'Добавить',
      en: 'Add',
      de: 'Hinzufügen'
    },
    'common.edit': {
      ru: 'Редактировать',
      en: 'Edit',
      de: 'Bearbeiten'
    },
    'common.delete': {
      ru: 'Удалить',
      en: 'Delete',
      de: 'Löschen'
    },
    'common.save': {
      ru: 'Сохранить',
      en: 'Save',
      de: 'Speichern'
    },
    'common.cancel': {
      ru: 'Отмена',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'common.close': {
      ru: 'Закрыть',
      en: 'Close',
      de: 'Schließen'
    },
    'common.search': {
      ru: 'Поиск',
      en: 'Search',
      de: 'Suchen'
    },
    'common.all': {
      ru: 'Все',
      en: 'All',
      de: 'Alle'
    },
    'common.name': {
      ru: 'Название',
      en: 'Name',
      de: 'Name'
    },
    'common.price': {
      ru: 'Цена',
      en: 'Price',
      de: 'Preis'
    },
    'common.quantity': {
      ru: 'Количество',
      en: 'Quantity',
      de: 'Menge'
    },
    'common.actions': {
      ru: 'Действия',
      en: 'Actions',
      de: 'Aktionen'
    },
    'common.status': {
      ru: 'Статус',
      en: 'Status',
      de: 'Status'
    },
    'common.date': {
      ru: 'Дата',
      en: 'Date',
      de: 'Datum'
    },
    'common.time': {
      ru: 'Время',
      en: 'Time',
      de: 'Zeit'
    },
    'common.hours': {
      ru: 'Часов',
      en: 'Hours',
      de: 'Stunden'
    },
    'common.week': {
      ru: 'Неделя',
      en: 'Week',
      de: 'Woche'
    },
    'common.month': {
      ru: 'Месяц',
      en: 'Month',
      de: 'Monat'
    },
    'common.perHour': {
      ru: '/час',
      en: '/hour',
      de: '/Stunde'
    },
    'common.active': {
      ru: 'Активен',
      en: 'Active',
      de: 'Aktiv'
    },
    'common.inactive': {
      ru: 'Неактивен',
      en: 'Inactive',
      de: 'Inaktiv'
    },
    // Staff
    'staff.title': {
      ru: 'Персонал',
      en: 'Staff',
      de: 'Personal'
    },
    'staff.add': {
      ru: 'Добавить сотрудника',
      en: 'Add Employee',
      de: 'Mitarbeiter hinzufügen'
    },
    'staff.edit': {
      ru: 'Редактировать сотрудника',
      en: 'Edit Employee',
      de: 'Mitarbeiter bearbeiten'
    },
    'staff.name': {
      ru: 'Имя',
      en: 'Name',
      de: 'Name'
    },
    'staff.role': {
      ru: 'Должность',
      en: 'Position',
      de: 'Position'
    },
    'staff.phone': {
      ru: 'Телефон',
      en: 'Phone',
      de: 'Telefon'
    },
    'staff.email': {
      ru: 'Email',
      en: 'Email',
      de: 'E-Mail'
    },
    'staff.hourlyRate': {
      ru: 'Ставка в час',
      en: 'Hourly Rate',
      de: 'Stundensatz'
    },
    'staff.hourlyRate.full': {
      ru: 'Ставка (€/час)',
      en: 'Rate (€/hour)',
      de: 'Satz (€/Stunde)'
    },
    'staff.fullName': {
      ru: 'ФИО',
      en: 'Full Name',
      de: 'Vollständiger Name'
    },
    'staff.hireDate': {
      ru: 'Дата найма',
      en: 'Hire Date',
      de: 'Einstellungsdatum'
    },
    'staff.active': {
      ru: 'Активен',
      en: 'Active',
      de: 'Aktiv'
    },
    'staff.inactive': {
      ru: 'Неактивен',
      en: 'Inactive',
      de: 'Inaktiv'
    },
    'staff.schedule': {
      ru: 'График работы',
      en: 'Work Schedule',
      de: 'Arbeitsplan'
    },
    'staff.schedule.prevWeek': {
      ru: 'Предыдущая неделя',
      en: 'Previous week',
      de: 'Vorherige Woche'
    },
    'staff.schedule.nextWeek': {
      ru: 'Следующая неделя',
      en: 'Next week',
      de: 'Nächste Woche'
    },
    'staff.schedule.hint': {
      ru: 'Листайте стрелки, чтобы выбрать другую неделю',
      en: 'Use arrows to switch the week',
      de: 'Mit den Pfeilen andere Woche wählen'
    },
    'staff.employee': {
      ru: 'Сотрудник',
      en: 'Employee',
      de: 'Mitarbeiter'
    },
    'staff.shift.add': {
      ru: 'Добавить смену',
      en: 'Add Shift',
      de: 'Schicht hinzufügen'
    },
    'staff.shift.edit': {
      ru: 'Редактировать смену',
      en: 'Edit Shift',
      de: 'Schicht bearbeiten'
    },
    'staff.shift.start': {
      ru: 'Начало',
      en: 'Start',
      de: 'Beginn'
    },
    'staff.shift.end': {
      ru: 'Конец',
      en: 'End',
      de: 'Ende'
    },
    'staff.shift.endTime': {
      ru: 'Окончание',
      en: 'End Time',
      de: 'Endzeit'
    },
    'common.selectEmployee': {
      ru: 'Выберите сотрудника',
      en: 'Select employee',
      de: 'Mitarbeiter auswählen'
    },
    'staff.shift.actualStart': {
      ru: 'Фактическое прибытие',
      en: 'Actual Arrival',
      de: 'Tatsächliche Ankunft'
    },
    'staff.shift.actualEnd': {
      ru: 'Фактическое убытие',
      en: 'Actual Departure',
      de: 'Tatsächliche Abreise'
    },
    'staff.shift.notes': {
      ru: 'Заметки',
      en: 'Notes',
      de: 'Notizen'
    },
    'staff.analytics': {
      ru: 'Аналитика',
      en: 'Analytics',
      de: 'Analysen'
    },
    'staff.week.hours': {
      ru: 'Часов (неделя)',
      en: 'Hours (week)',
      de: 'Stunden (Woche)'
    },
    'staff.month.hours': {
      ru: 'Часов (месяц)',
      en: 'Hours (month)',
      de: 'Stunden (Monat)'
    },
    'staff.toPay': {
      ru: 'К оплате',
      en: 'To Pay',
      de: 'Zu zahlen'
    },
    'staff.arrived': {
      ru: 'Пришел',
      en: 'Arrived',
      de: 'Angekommen'
    },
    'staff.left': {
      ru: 'Ушел',
      en: 'Left',
      de: 'Gegangen'
    },
    'staff.clickToEdit': {
      ru: 'Кликните, чтобы редактировать',
      en: 'Click to edit',
      de: 'Zum Bearbeiten klicken'
    },
    // Tables
    'tables.title': {
      ru: 'Столики',
      en: 'Tables',
      de: 'Tische'
    },
    'tables.subtitle': {
      ru: 'Выберите столик для создания или продолжения заказа',
      en: 'Select a table to create or continue an order',
      de: 'Wählen Sie einen Tisch, um eine Bestellung zu erstellen oder fortzusetzen'
    },
    'tables.status.free': {
      ru: 'Свободен',
      en: 'Free',
      de: 'Frei'
    },
    'tables.status.occupied': {
      ru: 'Занят',
      en: 'Occupied',
      de: 'Besetzt'
    },
    'tables.status.reserved': {
      ru: 'Зарезервирован',
      en: 'Reserved',
      de: 'Reserviert'
    },
    'tables.status.waitingPayment': {
      ru: 'Ожидает оплаты',
      en: 'Awaiting Payment',
      de: 'Zahlung ausstehend'
    },
    'tables.status.closed': {
      ru: 'Закрыт',
      en: 'Closed',
      de: 'Geschlossen'
    },
    'tables.tableLabel': {
      ru: 'Стол',
      en: 'Table',
      de: 'Tisch'
    },
    'tables.seats': {
      ru: 'мест',
      en: 'seats',
      de: 'Plätze'
    },
    'tables.orderLabel': {
      ru: 'Заказ',
      en: 'Order',
      de: 'Bestellung'
    },
    'tables.createOrder': {
      ru: 'Создать заказ',
      en: 'Create Order',
      de: 'Bestellung erstellen'
    },
    'tables.reserve': {
      ru: 'Забронировать',
      en: 'Reserve',
      de: 'Reservieren'
    },
    'tables.viewReservation': {
      ru: 'Посмотреть бронь',
      en: 'View Reservation',
      de: 'Reservierung ansehen'
    },
    'tables.openOrder': {
      ru: 'Открыть заказ',
      en: 'Open Order',
      de: 'Bestellung öffnen'
    },
    'tables.markPayment': {
      ru: 'Отметить к оплате',
      en: 'Mark for Payment',
      de: 'Zur Zahlung markieren'
    },
    'tables.toPay': {
      ru: 'К оплате',
      en: 'To Pay',
      de: 'Zu zahlen'
    },
    'tables.noTables': {
      ru: 'Нет доступных столиков',
      en: 'No tables available',
      de: 'Keine Tische verfügbar'
    },
    'tables.waitingPayment.noOrder': {
      ru: 'Для этого столика нет активного заказа.',
      en: 'This table has no active order.',
      de: 'Für diesen Tisch gibt es keine aktive Bestellung.'
    },
    'tables.waitingPayment.confirm': {
      ru: 'Отметить столик как "к оплате"? Пока гость не оплатит, карточка останется жёлтой.',
      en: 'Mark this table as "to pay"? The card will stay yellow until the guest pays.',
      de: 'Diesen Tisch als „zu zahlen“ markieren? Die Karte bleibt gelb, bis der Gast bezahlt.'
    },
    // Order create
    'orderCreate.title': {
      ru: 'Создать заказ для стола',
      en: 'Create order for table',
      de: 'Bestellung für Tisch erstellen'
    },
    'orderCreate.tableFree': {
      ru: 'Столик свободен',
      en: 'Table is free',
      de: 'Tisch ist frei'
    },
    'orderCreate.guests.label': {
      ru: 'Количество гостей',
      en: 'Number of guests',
      de: 'Anzahl der Gäste'
    },
    'orderCreate.guests.one': {
      ru: 'гость',
      en: 'guest',
      de: 'Gast'
    },
    'orderCreate.guests.many': {
      ru: 'гостей',
      en: 'guests',
      de: 'Gäste'
    },
    'orderCreate.info.title': {
      ru: 'Что дальше?',
      en: 'What’s next?',
      de: 'Wie geht es weiter?'
    },
    'orderCreate.info.text': {
      ru: 'После создания заказа вы сможете добавить блюда из меню или вернуться к списку столиков.',
      en: 'After creating the order you can add dishes from the menu or return to the tables list.',
      de: 'Nach dem Erstellen der Bestellung können Sie Gerichte aus der Speisekarte hinzufügen oder zur Tischliste zurückkehren.'
    },
    'orderCreate.actions.create': {
      ru: 'Создать заказ',
      en: 'Create order',
      de: 'Bestellung erstellen'
    },
    'orderCreate.actions.createAndAdd': {
      ru: 'Создать и выбрать блюда',
      en: 'Create and add dishes',
      de: 'Erstellen und Gerichte wählen'
    },
    'orderCreate.actions.cancel': {
      ru: 'Отмена',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'orderCreate.server': {
      ru: 'Официант:',
      en: 'Waiter:',
      de: 'Kellner:'
    },
    'orderCreate.serverUnknown': {
      ru: 'Не указан',
      en: 'Not specified',
      de: 'Nicht angegeben'
    },
    'orderCreate.notFound': {
      ru: 'Столик не найден',
      en: 'Table not found',
      de: 'Tisch nicht gefunden'
    },
    'orderCreate.backToTables': {
      ru: 'Вернуться к столикам',
      en: 'Back to tables',
      de: 'Zurück zu den Tischen'
    },
    // Menu
    'menu.title': {
      ru: 'Меню',
      en: 'Menu',
      de: 'Speisekarte'
    },
    'menu.category.all': {
      ru: 'Все',
      en: 'All',
      de: 'Alle'
    },
    'menu.category.appetizers': {
      ru: 'Закуски',
      en: 'Appetizers',
      de: 'Vorspeisen'
    },
    'menu.category.soups': {
      ru: 'Супы',
      en: 'Soups',
      de: 'Suppen'
    },
    'menu.category.main': {
      ru: 'Горячие блюда',
      en: 'Main dishes',
      de: 'Hauptgerichte'
    },
    'menu.category.pasta': {
      ru: 'Паста',
      en: 'Pasta',
      de: 'Pasta'
    },
    'menu.category.salads': {
      ru: 'Салаты',
      en: 'Salads',
      de: 'Salate'
    },
    'menu.category.desserts': {
      ru: 'Десерты',
      en: 'Desserts',
      de: 'Desserts'
    },
    'menu.category.drinks': {
      ru: 'Напитки',
      en: 'Drinks',
      de: 'Getränke'
    },
    'menu.category.alcohol': {
      ru: 'Алкоголь',
      en: 'Alcohol',
      de: 'Alkohol'
    },
    'menu.backToOrder': {
      ru: 'Назад к заказу',
      en: 'Back to order',
      de: 'Zur Bestellung zurück'
    },
    'menu.search.placeholder': {
      ru: 'Поиск блюд...',
      en: 'Search dishes...',
      de: 'Gerichte suchen...'
    },
    'menu.addToCart': {
      ru: 'Добавить в корзину',
      en: 'Add to Cart',
      de: 'In den Warenkorb'
    },
    'menu.cart': {
      ru: 'Корзина',
      en: 'Cart',
      de: 'Warenkorb'
    },
    'menu.total': {
      ru: 'Итого',
      en: 'Total',
      de: 'Gesamt'
    },
    'menu.order': {
      ru: 'Заказать',
      en: 'Order',
      de: 'Bestellen'
    },
    'menu.preparation.minutes': {
      ru: 'мин',
      en: 'min',
      de: 'Min'
    },
    'menu.unavailable': {
      ru: 'Временно недоступно',
      en: 'Temporarily unavailable',
      de: 'Vorübergehend nicht verfügbar'
    },
    'menu.selectedCount': {
      ru: 'Выбрано позиций:',
      en: 'Items selected:',
      de: 'Ausgewählte Positionen:'
    },
    'menu.cancel': {
      ru: 'Отменить',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'menu.addToOrder': {
      ru: 'Добавить в заказ',
      en: 'Add to order',
      de: 'Zur Bestellung hinzufügen'
    },
    'menu.noResults': {
      ru: 'Ничего не найдено',
      en: 'Nothing found',
      de: 'Nichts gefunden'
    },
    'menu.alert.selectItem': {
      ru: 'Выберите хотя бы одно блюдо',
      en: 'Please select at least one dish',
      de: 'Bitte wählen Sie mindestens ein Gericht aus'
    },
    'menu.confirmCancel': {
      ru: 'Отменить выбор блюд?',
      en: 'Cancel selected dishes?',
      de: 'Auswahl der Gerichte abbrechen?'
    },
    // Menu management
    'menuManage.title': {
      ru: 'Управление меню',
      en: 'Menu Management',
      de: 'Menüverwaltung'
    },
    'menuManage.subtitle': {
      ru: 'Редактирование блюд, категорий и цен',
      en: 'Edit dishes, categories and prices',
      de: 'Gerichte, Kategorien und Preise bearbeiten'
    },
    'menuManage.addDish': {
      ru: 'Добавить блюдо',
      en: 'Add dish',
      de: 'Gericht hinzufügen'
    },
    'menuManage.unavailable': {
      ru: 'Недоступно',
      en: 'Unavailable',
      de: 'Nicht verfügbar'
    },
    'menuManage.toggle.disable': {
      ru: '🚫 Выкл.',
      en: '🚫 Off',
      de: '🚫 Aus'
    },
    'menuManage.toggle.enable': {
      ru: '✓ Вкл.',
      en: '✓ On',
      de: '✓ An'
    },
    'menuManage.edit': {
      ru: '✏️ Изменить',
      en: '✏️ Edit',
      de: '✏️ Bearbeiten'
    },
    'menuManage.recipeBtn.create': {
      ru: 'Создать карту',
      en: 'Create card',
      de: 'Karte erstellen'
    },
    'menuManage.recipeBtn.edit': {
      ru: 'Редактировать карту',
      en: 'Edit card',
      de: 'Karte bearbeiten'
    },
    'menuManage.modal.createTitle': {
      ru: 'Добавить блюдо',
      en: 'Add dish',
      de: 'Gericht hinzufügen'
    },
    'menuManage.modal.editTitle': {
      ru: 'Редактировать блюдо',
      en: 'Edit dish',
      de: 'Gericht bearbeiten'
    },
    'menuManage.form.name': {
      ru: 'Название блюда',
      en: 'Dish name',
      de: 'Name des Gerichts'
    },
    'menuManage.form.namePlaceholder': {
      ru: 'Например: Стейк Рибай',
      en: 'E.g. Ribeye steak',
      de: 'Z. B. Ribeye-Steak'
    },
    'menuManage.form.category': {
      ru: 'Категория',
      en: 'Category',
      de: 'Kategorie'
    },
    'menuManage.form.price': {
      ru: 'Цена (€)',
      en: 'Price (€)',
      de: 'Preis (€)'
    },
    'menuManage.form.time': {
      ru: 'Время (мин)',
      en: 'Time (min)',
      de: 'Zeit (Min)'
    },
    'menuManage.form.timePlaceholder': {
      ru: '15',
      en: '15',
      de: '15'
    },
    'menuManage.form.description': {
      ru: 'Описание',
      en: 'Description',
      de: 'Beschreibung'
    },
    'menuManage.form.descriptionPlaceholder': {
      ru: 'Описание блюда...',
      en: 'Dish description...',
      de: 'Beschreibung des Gerichts...'
    },
    'menuManage.form.photo': {
      ru: 'Фото блюда',
      en: 'Dish photo',
      de: 'Foto des Gerichts'
    },
    'menuManage.form.photoUpload': {
      ru: 'Загрузить фото',
      en: 'Upload photo',
      de: 'Foto hochladen'
    },
    'menuManage.form.photoChange': {
      ru: 'Изменить фото',
      en: 'Change photo',
      de: 'Foto ändern'
    },
    'menuManage.form.photoHint': {
      ru: 'Максимальный размер: 5MB. Если не загружено, будет использована иконка по умолчанию 🍽️',
      en: 'Max size: 5MB. If not uploaded, the default 🍽️ icon will be used.',
      de: 'Max. Größe: 5 MB. Ohne Upload wird das Standard-Icon 🍽️ verwendet.'
    },
    'menuManage.form.available': {
      ru: 'Блюдо доступно для заказа',
      en: 'Dish available for order',
      de: 'Gericht ist bestellbar'
    },
    'menuManage.form.cancel': {
      ru: 'Отмена',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'menuManage.form.save': {
      ru: 'Сохранить',
      en: 'Save',
      de: 'Speichern'
    },
    'menuManage.form.add': {
      ru: 'Добавить',
      en: 'Add',
      de: 'Hinzufügen'
    },
    'menuManage.alert.nameRequired': {
      ru: 'Введите название блюда',
      en: 'Enter the dish name',
      de: 'Geben Sie den Namen des Gerichts ein'
    },
    'menuManage.alert.pricePositive': {
      ru: 'Цена должна быть больше нуля',
      en: 'Price must be greater than zero',
      de: 'Der Preis muss größer als null sein'
    },
    'menuManage.alert.deleteConfirm': {
      ru: 'Удалить блюдо',
      en: 'Delete dish',
      de: 'Gericht löschen'
    },
    'menuManage.alert.fileType': {
      ru: 'Пожалуйста, выберите файл изображения',
      en: 'Please select an image file',
      de: 'Bitte wählen Sie eine Bilddatei aus'
    },
    'menuManage.alert.fileSize': {
      ru: 'Размер файла не должен превышать 5MB',
      en: 'File size must not exceed 5MB',
      de: 'Die Dateigröße darf 5 MB nicht überschreiten'
    },
    'menuManage.alert.addIngredient': {
      ru: 'Добавьте хотя бы один ингредиент',
      en: 'Add at least one ingredient',
      de: 'Fügen Sie mindestens eine Zutat hinzu'
    },
    'menuManage.recipe.title': {
      ru: '📋 Технологическая карта',
      en: '📋 Recipe card',
      de: '📋 Rezeptkarte'
    },
    'menuManage.recipe.ingredients': {
      ru: 'Ингредиенты',
      en: 'Ingredients',
      de: 'Zutaten'
    },
    'menuManage.recipe.addIngredient': {
      ru: 'Добавить',
      en: 'Add',
      de: 'Hinzufügen'
    },
    'menuManage.recipe.empty': {
      ru: 'Добавьте ингредиенты для блюда',
      en: 'Add ingredients for the dish',
      de: 'Fügen Sie Zutaten für das Gericht hinzu'
    },
    'menuManage.recipe.selectProduct': {
      ru: 'Выберите товар',
      en: 'Select item',
      de: 'Artikel auswählen'
    },
    'menuManage.recipe.quantityPlaceholder': {
      ru: 'Кол-во',
      en: 'Qty',
      de: 'Menge'
    },
    'menuManage.recipe.deleteTooltip': {
      ru: 'Удалить',
      en: 'Delete',
      de: 'Löschen'
    },
    'menuManage.recipe.description': {
      ru: 'Описание приготовления',
      en: 'Preparation description',
      de: 'Zubereitungsbeschreibung'
    },
    'menuManage.recipe.descriptionPlaceholder': {
      ru: 'Порядок действий, температура, время...',
      en: 'Steps, temperature, timing...',
      de: 'Ablauf, Temperatur, Zeit...'
    },
    'menuManage.recipe.cancel': {
      ru: 'Отмена',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'menuManage.recipe.saveCard': {
      ru: 'Сохранить карту',
      en: 'Save card',
      de: 'Karte speichern'
    },
    'menuManage.recipe.createCard': {
      ru: 'Создать карту',
      en: 'Create card',
      de: 'Karte erstellen'
    },
    // Dashboard
    'dashboard.title': {
      ru: 'Панель управления',
      en: 'Control Panel',
      de: 'Bedienfeld'
    },
    'dashboard.subtitle': {
      ru: 'Обзор работы ресторана',
      en: 'Restaurant Operations Overview',
      de: 'Restaurant-Betriebsübersicht'
    },
    'dashboard.tables': {
      ru: 'Столики',
      en: 'Tables',
      de: 'Tische'
    },
    'dashboard.tables.total': {
      ru: 'Всего:',
      en: 'Total:',
      de: 'Gesamt:'
    },
    'dashboard.tables.occupied': {
      ru: 'Занято:',
      en: 'Occupied:',
      de: 'Besetzt:'
    },
    'dashboard.tables.reserved': {
      ru: 'Забронировано:',
      en: 'Reserved:',
      de: 'Reserviert:'
    },
    'dashboard.tables.goTo': {
      ru: 'Перейти к столикам →',
      en: 'Go to tables →',
      de: 'Zu Tischen gehen →'
    },
    'dashboard.orders': {
      ru: 'Заказы',
      en: 'Orders',
      de: 'Bestellungen'
    },
    'dashboard.orders.active': {
      ru: 'Активных:',
      en: 'Active:',
      de: 'Aktiv:'
    },
    'dashboard.orders.averageCheck': {
      ru: 'Средний чек:',
      en: 'Average check:',
      de: 'Durchschnittlicher Rechnungsbetrag:'
    },
    'dashboard.revenue': {
      ru: 'Выручка сегодня',
      en: 'Revenue today',
      de: 'Umsatz heute'
    },
    'dashboard.revenue.compare': {
      ru: '↑ +12% к вчерашнему дню',
      en: '↑ +12% compared to yesterday',
      de: '↑ +12% im Vergleich zu gestern'
    },
    'dashboard.quickActions': {
      ru: 'Быстрые действия',
      en: 'Quick Actions',
      de: 'Schnellaktionen'
    },
    'dashboard.quickActions.newOrder': {
      ru: 'Новый заказ',
      en: 'New Order',
      de: 'Neue Bestellung'
    },
    'dashboard.quickActions.booking': {
      ru: 'Бронирование',
      en: 'Booking',
      de: 'Reservierung'
    },
    'dashboard.quickActions.menu': {
      ru: 'Меню',
      en: 'Menu',
      de: 'Speisekarte'
    },
    'dashboard.quickActions.reports': {
      ru: 'Отчеты',
      en: 'Reports',
      de: 'Berichte'
    },
    // Warehouse
    'warehouse.title': {
      ru: 'Склад',
      en: 'Warehouse',
      de: 'Lager'
    },
    'warehouse.subtitle': {
      ru: 'Управление запасами и поставками',
      en: 'Manage inventory and supplies',
      de: 'Verwaltung von Beständen und Lieferungen'
    },
    'warehouse.stats.totalItems': {
      ru: 'Всего товаров',
      en: 'Total items',
      de: 'Gesamtanzahl Artikel'
    },
    'warehouse.stats.lowStock': {
      ru: 'Низкий остаток',
      en: 'Low stock',
      de: 'Niedriger Bestand'
    },
    'warehouse.stats.totalValue': {
      ru: 'Общая стоимость',
      en: 'Total value',
      de: 'Gesamtwert'
    },
    'warehouse.tabs.items': {
      ru: '📦 Товары',
      en: '📦 Items',
      de: '📦 Artikel'
    },
    'warehouse.tabs.operations': {
      ru: '📋 История операций',
      en: '📋 Operations history',
      de: '📋 Vorgangshistorie'
    },
    'warehouse.filter.allCategories': {
      ru: 'Все категории',
      en: 'All categories',
      de: 'Alle Kategorien'
    },
    'warehouse.buttons.operation': {
      ru: 'Операция',
      en: 'Operation',
      de: 'Vorgang'
    },
    'warehouse.buttons.addItem': {
      ru: 'Добавить товар',
      en: 'Add item',
      de: 'Artikel hinzufügen'
    },
    'warehouse.table.item': {
      ru: 'Товар',
      en: 'Item',
      de: 'Artikel'
    },
    'warehouse.table.category': {
      ru: 'Категория',
      en: 'Category',
      de: 'Kategorie'
    },
    'warehouse.table.stock': {
      ru: 'Остаток',
      en: 'Stock',
      de: 'Bestand'
    },
    'warehouse.table.minStock': {
      ru: 'Мин. остаток',
      en: 'Min stock',
      de: 'Mindestbestand'
    },
    'warehouse.table.price': {
      ru: 'Цена',
      en: 'Price',
      de: 'Preis'
    },
    'warehouse.table.supplier': {
      ru: 'Поставщик',
      en: 'Supplier',
      de: 'Lieferant'
    },
    'warehouse.table.status': {
      ru: 'Статус',
      en: 'Status',
      de: 'Status'
    },
    'warehouse.table.actions': {
      ru: 'Действия',
      en: 'Actions',
      de: 'Aktionen'
    },
    'warehouse.status.inStock': {
      ru: 'В наличии',
      en: 'In stock',
      de: 'Auf Lager'
    },
    'warehouse.status.lowStock': {
      ru: 'Низкий остаток',
      en: 'Low stock',
      de: 'Niedriger Bestand'
    },
    'warehouse.status.outOfStock': {
      ru: 'Нет в наличии',
      en: 'Out of stock',
      de: 'Nicht verfügbar'
    },
    'warehouse.actions.operation': {
      ru: 'Операция',
      en: 'Operation',
      de: 'Vorgang'
    },
    'warehouse.actions.edit': {
      ru: 'Редактировать',
      en: 'Edit',
      de: 'Bearbeiten'
    },
    'warehouse.actions.delete': {
      ru: 'Удалить',
      en: 'Delete',
      de: 'Löschen'
    },
    'warehouse.operations.table.date': {
      ru: 'Дата',
      en: 'Date',
      de: 'Datum'
    },
    'warehouse.operations.table.item': {
      ru: 'Товар',
      en: 'Item',
      de: 'Artikel'
    },
    'warehouse.operations.table.type': {
      ru: 'Тип',
      en: 'Type',
      de: 'Typ'
    },
    'warehouse.operations.table.quantity': {
      ru: 'Количество',
      en: 'Quantity',
      de: 'Menge'
    },
    'warehouse.operations.table.notes': {
      ru: 'Заметки',
      en: 'Notes',
      de: 'Notizen'
    },
    'warehouse.operations.table.user': {
      ru: 'Пользователь',
      en: 'User',
      de: 'Benutzer'
    },
    'warehouse.modal.item.title.add': {
      ru: 'Добавить товар',
      en: 'Add item',
      de: 'Artikel hinzufügen'
    },
    'warehouse.modal.item.title.edit': {
      ru: 'Редактировать товар',
      en: 'Edit item',
      de: 'Artikel bearbeiten'
    },
    'warehouse.modal.item.name': {
      ru: 'Название',
      en: 'Name',
      de: 'Name'
    },
    'warehouse.modal.item.name.placeholder': {
      ru: 'Например: Говядина рибай',
      en: 'E.g. Ribeye beef',
      de: 'Z. B. Ribeye-Rindfleisch'
    },
    'warehouse.modal.item.category': {
      ru: 'Категория',
      en: 'Category',
      de: 'Kategorie'
    },
    'warehouse.modal.item.unit': {
      ru: 'Единица измерения',
      en: 'Unit',
      de: 'Einheit'
    },
    'warehouse.modal.item.quantity': {
      ru: 'Количество',
      en: 'Quantity',
      de: 'Menge'
    },
    'warehouse.modal.item.minQuantity': {
      ru: 'Мин. остаток',
      en: 'Min stock',
      de: 'Mindestbestand'
    },
    'warehouse.modal.item.price': {
      ru: 'Цена (€)',
      en: 'Price (€)',
      de: 'Preis (€)'
    },
    'warehouse.modal.item.supplier': {
      ru: 'Поставщик',
      en: 'Supplier',
      de: 'Lieferant'
    },
    'warehouse.modal.item.supplier.placeholder': {
      ru: 'Название компании',
      en: 'Company name',
      de: 'Firmenname'
    },
    'warehouse.modal.cancel': {
      ru: 'Отмена',
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'warehouse.modal.save': {
      ru: 'Сохранить',
      en: 'Save',
      de: 'Speichern'
    },
    'warehouse.modal.add': {
      ru: 'Добавить',
      en: 'Add',
      de: 'Hinzufügen'
    },
    'warehouse.modal.operation.title': {
      ru: 'Операция',
      en: 'Operation',
      de: 'Vorgang'
    },
    'warehouse.modal.operation.item': {
      ru: 'Товар',
      en: 'Item',
      de: 'Artikel'
    },
    'warehouse.modal.operation.selectItem': {
      ru: 'Выберите товар',
      en: 'Select item',
      de: 'Artikel auswählen'
    },
    'warehouse.modal.operation.type': {
      ru: 'Тип операции',
      en: 'Operation type',
      de: 'Vorgangsart'
    },
    'warehouse.modal.operation.quantity': {
      ru: 'Количество',
      en: 'Quantity',
      de: 'Menge'
    },
    'warehouse.modal.operation.notes': {
      ru: 'Заметки',
      en: 'Notes',
      de: 'Notizen'
    },
    'warehouse.modal.operation.notes.placeholder': {
      ru: 'Дополнительная информация...',
      en: 'Additional information...',
      de: 'Zusätzliche Informationen...'
    },
    'warehouse.modal.operation.submit': {
      ru: 'Выполнить',
      en: 'Submit',
      de: 'Ausführen'
    },
    'warehouse.category.meat': {
      ru: 'Мясо',
      en: 'Meat',
      de: 'Fleisch'
    },
    'warehouse.category.fish': {
      ru: 'Рыба',
      en: 'Fish',
      de: 'Fisch'
    },
    'warehouse.category.vegetables': {
      ru: 'Овощи',
      en: 'Vegetables',
      de: 'Gemüse'
    },
    'warehouse.category.fruits': {
      ru: 'Фрукты',
      en: 'Fruits',
      de: 'Obst'
    },
    'warehouse.category.dairy': {
      ru: 'Молочные продукты',
      en: 'Dairy',
      de: 'Milchprodukte'
    },
    'warehouse.category.cereals': {
      ru: 'Крупы и макароны',
      en: 'Grains & pasta',
      de: 'Getreide & Pasta'
    },
    'warehouse.category.spices': {
      ru: 'Специи',
      en: 'Spices',
      de: 'Gewürze'
    },
    'warehouse.category.drinks': {
      ru: 'Напитки',
      en: 'Drinks',
      de: 'Getränke'
    },
    'warehouse.category.alcohol': {
      ru: 'Алкоголь',
      en: 'Alcohol',
      de: 'Alkohol'
    },
    'warehouse.category.other': {
      ru: 'Прочее',
      en: 'Other',
      de: 'Sonstiges'
    },
    'warehouse.unit.kg': {
      ru: 'кг',
      en: 'kg',
      de: 'kg'
    },
    'warehouse.unit.g': {
      ru: 'г',
      en: 'g',
      de: 'g'
    },
    'warehouse.unit.l': {
      ru: 'л',
      en: 'l',
      de: 'l'
    },
    'warehouse.unit.ml': {
      ru: 'мл',
      en: 'ml',
      de: 'ml'
    },
    'warehouse.unit.pcs': {
      ru: 'шт',
      en: 'pcs',
      de: 'Stk'
    },
    'warehouse.unit.pack': {
      ru: 'уп',
      en: 'pack',
      de: 'Pack'
    },
    'warehouse.operation.incoming': {
      ru: 'Приход',
      en: 'Incoming',
      de: 'Zugang'
    },
    'warehouse.operation.outgoing': {
      ru: 'Расход',
      en: 'Outgoing',
      de: 'Abgang'
    },
    'warehouse.operation.writeoff': {
      ru: 'Списание',
      en: 'Write-off',
      de: 'Abschreibung'
    },
    'warehouse.alert.nameRequired': {
      ru: 'Введите название товара',
      en: 'Enter item name',
      de: 'Geben Sie den Artikelnamen ein'
    },
    'warehouse.alert.deleteConfirm': {
      ru: 'Удалить товар',
      en: 'Delete item',
      de: 'Artikel löschen'
    },
    'warehouse.alert.selectItem': {
      ru: 'Выберите товар',
      en: 'Select an item',
      de: 'Artikel auswählen'
    },
    'warehouse.alert.enterQuantity': {
      ru: 'Введите количество',
      en: 'Enter quantity',
      de: 'Menge eingeben'
    },
    'warehouse.alert.notEnoughStock': {
      ru: 'Недостаточно товара на складе',
      en: 'Not enough stock',
      de: 'Nicht genügend Bestand'
    },
    'warehouse.unknown': {
      ru: 'Неизвестно',
      en: 'Unknown',
      de: 'Unbekannt'
    },
    'reservation.info.title': {
      ru: 'Бронирование',
      en: 'Reservation',
      de: 'Reservierung'
    },
    'reservation.info.phone': {
      ru: 'Телефон',
      en: 'Phone',
      de: 'Telefon'
    },
    'reservation.info.guests': {
      ru: 'Гостей',
      en: 'Guests',
      de: 'Gäste'
    },
    'reservation.info.time': {
      ru: 'Время',
      en: 'Time',
      de: 'Zeit'
    },
    'reservation.info.notes': {
      ru: 'Заметки',
      en: 'Notes',
      de: 'Notizen'
    },
    'reservation.info.confirm': {
      ru: '[OK] - Создать заказ | [Отмена] - Закрыть',
      en: '[OK] - Create order | [Cancel] - Close',
      de: '[OK] - Bestellung erstellen | [Abbrechen] - Schließen'
    },
    'reservation.info.error': {
      ru: 'Информация о бронировании не найдена',
      en: 'Reservation information not found',
      de: 'Reservierungsinformationen nicht gefunden'
    },
    // Analytics
    'analytics.title': {
      ru: 'Аналитика',
      en: 'Analytics',
      de: 'Analytik'
    },
    'analytics.subtitle': {
      ru: 'Статистика и отчеты по работе ресторана',
      en: 'Statistics and reports on restaurant performance',
      de: 'Statistiken und Berichte zum Restaurantbetrieb'
    },
    'analytics.card.visitors': {
      ru: 'Всего посетителей',
      en: 'Total visitors',
      de: 'Gesamtbesucher'
    },
    'analytics.card.revenue': {
      ru: 'Выручка',
      en: 'Revenue',
      de: 'Umsatz'
    },
    'analytics.card.orders': {
      ru: 'Всего заказов',
      en: 'Total orders',
      de: 'Gesamtbestellungen'
    },
    'analytics.card.avgCheck': {
      ru: 'Средний чек',
      en: 'Average check',
      de: 'Durchschnittsbon'
    },
    'analytics.card.week': {
      ru: '↑ За неделю',
      en: '↑ Weekly',
      de: '↑ Wöchentlich'
    },
    'analytics.card.average': {
      ru: 'В среднем',
      en: 'On average',
      de: 'Im Durchschnitt'
    },
    'analytics.tabs.visitors': {
      ru: '👥 Посетители',
      en: '👥 Visitors',
      de: '👥 Besucher'
    },
    'analytics.tabs.finance': {
      ru: '💰 Финансы',
      en: '💰 Finance',
      de: '💰 Finanzen'
    },
    'analytics.tabs.dishes': {
      ru: '🍽️ Блюда',
      en: '🍽️ Dishes',
      de: '🍽️ Gerichte'
    },
    'analytics.tabs.waiters': {
      ru: '👨‍🍳 Официанты',
      en: '👨‍🍳 Waiters',
      de: '👨‍🍳 Kellner'
    },
    'analytics.visitors.title': {
      ru: 'Посещаемость по дням',
      en: 'Daily attendance',
      de: 'Besucher pro Tag'
    },
    'analytics.visitors.legend.visitors': {
      ru: 'Посетители',
      en: 'Visitors',
      de: 'Besucher'
    },
    'analytics.visitors.legend.orders': {
      ru: 'Заказы',
      en: 'Orders',
      de: 'Bestellungen'
    },
    'analytics.visitors.legend.revenue': {
      ru: 'Выручка (€)',
      en: 'Revenue (€)',
      de: 'Umsatz (€)'
    },
    'analytics.table.date': {
      ru: 'Дата',
      en: 'Date',
      de: 'Datum'
    },
    'analytics.table.visitors': {
      ru: 'Посетители',
      en: 'Visitors',
      de: 'Besucher'
    },
    'analytics.table.orders': {
      ru: 'Заказы',
      en: 'Orders',
      de: 'Bestellungen'
    },
    'analytics.table.revenue': {
      ru: 'Выручка',
      en: 'Revenue',
      de: 'Umsatz'
    },
    'analytics.finance.title': {
      ru: 'Финансовые показатели',
      en: 'Financial indicators',
      de: 'Finanzkennzahlen'
    },
    'analytics.finance.legend.avgCheck': {
      ru: 'Средний чек (€)',
      en: 'Average check (€)',
      de: 'Durchschnittsbon (€)'
    },
    'analytics.finance.table.avgCheck': {
      ru: 'Средний чек',
      en: 'Average check',
      de: 'Durchschnittsbon'
    },
    'analytics.dishes.title': {
      ru: 'Топ блюд за неделю',
      en: 'Top dishes this week',
      de: 'Top-Gerichte der Woche'
    },
    'analytics.dishes.table.place': {
      ru: 'Место',
      en: 'Place',
      de: 'Platz'
    },
    'analytics.dishes.table.name': {
      ru: 'Название',
      en: 'Name',
      de: 'Name'
    },
    'analytics.dishes.table.category': {
      ru: 'Категория',
      en: 'Category',
      de: 'Kategorie'
    },
    'analytics.dishes.table.sold': {
      ru: 'Продано',
      en: 'Sold',
      de: 'Verkauft'
    },
    'analytics.dishes.table.revenue': {
      ru: 'Выручка',
      en: 'Revenue',
      de: 'Umsatz'
    },
    'analytics.waiters.title': {
      ru: 'Рейтинг официантов',
      en: 'Waiter rankings',
      de: 'Kellner-Ranking'
    },
    'analytics.waiters.table.waiter': {
      ru: 'Официант',
      en: 'Waiter',
      de: 'Kellner'
    },
    'analytics.waiters.table.avgCheck': {
      ru: 'Средний чек',
      en: 'Average check',
      de: 'Durchschnittsbon'
    },
    'analytics.waiters.table.rating': {
      ru: 'Рейтинг',
      en: 'Rating',
      de: 'Bewertung'
    },
    'analytics.waiters.Card.orders': {
      ru: 'Заказов',
      en: 'Orders',
      de: 'Bestellungen'
    },
    'analytics.waiters.Card.revenue': {
      ru: 'Выручка',
      en: 'Revenue',
      de: 'Umsatz'
    },
    'analytics.waiters.Card.avgCheck': {
      ru: 'Ср. чек',
      en: 'Avg. check',
      de: 'Durchs.-Bon'
    },
    'analytics.waiters.Card.role': {
      ru: 'Официант',
      en: 'Waiter',
      de: 'Kellner'
    },
    'analytics.waiters.Card.rating': {
      ru: 'рейтинг',
      en: 'rating',
      de: 'Bewertung'
    }
  };

  constructor() {
    // Загружаем язык из localStorage при инициализации
    const stored = this.getStoredLanguage();
    this.setLanguage(stored);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    const lang = this.getCurrentLanguage();
    return translation[lang] || translation['en'];
  }

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored && (stored === 'ru' || stored === 'en' || stored === 'de')) {
      return stored as Language;
    }
    // Определяем язык браузера
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('ru')) return 'ru';
    return 'en'; // По умолчанию английский
  }
}


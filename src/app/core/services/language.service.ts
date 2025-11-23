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
      en: 'Waiting Payment',
      de: 'Zahlung ausstehend'
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


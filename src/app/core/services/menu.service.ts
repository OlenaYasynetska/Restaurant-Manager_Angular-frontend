import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, MenuCategory } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.getMockMenuItems());
  public menuItems$ = this.menuItemsSubject.asObservable();
  private nextId = 27; // Следующий ID для новых блюд

  constructor() {}

  // Получить все позиции меню
  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$;
  }

  // Получить позицию по ID
  getMenuItemById(id: number): MenuItem | undefined {
    return this.menuItemsSubject.value.find(item => item.id === id);
  }

  // Получить позиции по категории
  getMenuItemsByCategory(category: MenuCategory): Observable<MenuItem[]> {
    return new Observable(observer => {
      const items = this.menuItemsSubject.value.filter(item => item.category === category);
      observer.next(items);
      observer.complete();
    });
  }

  // Добавить новое блюдо
  addMenuItem(data: Partial<MenuItem>): MenuItem {
    const newItem: MenuItem = {
      id: this.nextId++,
      name: data.name || '',
      category: data.category || MenuCategory.MAIN_DISHES,
      price: data.price || 0,
      available: data.available ?? true,
      preparationTime: data.preparationTime || 15,
      description: data.description || '',
      image: data.image || '🍽️'
    };

    const currentItems = this.menuItemsSubject.value;
    this.menuItemsSubject.next([...currentItems, newItem]);
    
    return newItem;
  }

  // Обновить блюдо
  updateMenuItem(id: number, data: Partial<MenuItem>): void {
    const currentItems = this.menuItemsSubject.value;
    const index = currentItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      currentItems[index] = {
        ...currentItems[index],
        ...data,
        id // Сохраняем оригинальный ID
      };
      this.menuItemsSubject.next([...currentItems]);
    }
  }

  // Удалить блюдо
  deleteMenuItem(id: number): void {
    const currentItems = this.menuItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.menuItemsSubject.next(filteredItems);
  }

  // Мок данные меню
  private getMockMenuItems(): MenuItem[] {
    return [
      // Закуски
      { id: 1, name: 'Брускетта с томатами', category: MenuCategory.APPETIZERS, price: 350, available: true, preparationTime: 5, description: 'Хрустящий хлеб с томатами и базиликом', image: '🍞' },
      { id: 2, name: 'Сырная тарелка', category: MenuCategory.APPETIZERS, price: 650, available: true, preparationTime: 3, description: 'Ассорти из 5 видов сыров', image: '🧀' },
      { id: 3, name: 'Карпаччо из говядины', category: MenuCategory.APPETIZERS, price: 750, available: true, preparationTime: 7, description: 'Тонко нарезанная говядина с рукколой', image: '🥩' },
      
      // Супы
      { id: 4, name: 'Том Ям', category: MenuCategory.SOUPS, price: 450, available: true, preparationTime: 15, description: 'Острый тайский суп с морепродуктами', image: '🍲' },
      { id: 5, name: 'Крем-суп из грибов', category: MenuCategory.SOUPS, price: 350, available: true, preparationTime: 10, description: 'Нежный суп с белыми грибами', image: '🍄' },
      { id: 6, name: 'Борщ украинский', category: MenuCategory.SOUPS, price: 320, available: true, preparationTime: 12, description: 'Традиционный борщ со сметаной', image: '🥘' },
      
      // Горячие блюда
      { id: 7, name: 'Стейк Рибай', category: MenuCategory.MAIN_DISHES, price: 1850, available: true, preparationTime: 20, description: 'Премиальный стейк из мраморной говядины', image: '🥩' },
      { id: 8, name: 'Лосось на гриле', category: MenuCategory.MAIN_DISHES, price: 1350, available: true, preparationTime: 18, description: 'Свежий лосось с овощами', image: '🐟' },
      { id: 9, name: 'Куриное филе в сливочном соусе', category: MenuCategory.MAIN_DISHES, price: 850, available: true, preparationTime: 15, description: 'Нежное филе с грибами и сливками', image: '🍗' },
      { id: 10, name: 'Свиные ребрышки BBQ', category: MenuCategory.MAIN_DISHES, price: 950, available: true, preparationTime: 25, description: 'Сочные ребрышки в соусе барбекю', image: '🍖' },
      
      // Паста
      { id: 11, name: 'Карбонара', category: MenuCategory.PASTA, price: 550, available: true, preparationTime: 12, description: 'Классическая паста с беконом', image: '🍝' },
      { id: 12, name: 'Болоньезе', category: MenuCategory.PASTA, price: 520, available: true, preparationTime: 12, description: 'Спагетти с мясным соусом', image: '🍝' },
      { id: 13, name: 'Паста с морепродуктами', category: MenuCategory.PASTA, price: 750, available: true, preparationTime: 15, description: 'Микс из морепродуктов', image: '🦐' },
      
      // Салаты
      { id: 14, name: 'Цезарь с курицей', category: MenuCategory.SALADS, price: 450, available: true, preparationTime: 8, description: 'Классический салат с курицей гриль', image: '🥗' },
      { id: 15, name: 'Греческий салат', category: MenuCategory.SALADS, price: 420, available: true, preparationTime: 7, description: 'Свежие овощи с фетой', image: '🥗' },
      { id: 16, name: 'Салат с тунцом', category: MenuCategory.SALADS, price: 520, available: true, preparationTime: 8, description: 'Микс салатов с тунцом', image: '🥗' },
      
      // Десерты
      { id: 17, name: 'Тирамису', category: MenuCategory.DESSERTS, price: 380, available: true, preparationTime: 5, description: 'Классический итальянский десерт', image: '🍰' },
      { id: 18, name: 'Чизкейк Нью-Йорк', category: MenuCategory.DESSERTS, price: 350, available: true, preparationTime: 5, description: 'Нежный сырный торт', image: '🍰' },
      { id: 19, name: 'Панна-котта', category: MenuCategory.DESSERTS, price: 320, available: true, preparationTime: 5, description: 'Итальянский десерт с ягодами', image: '🍮' },
      
      // Напитки
      { id: 20, name: 'Эспрессо', category: MenuCategory.DRINKS, price: 150, available: true, preparationTime: 2, description: 'Крепкий итальянский кофе', image: '☕' },
      { id: 21, name: 'Капучино', category: MenuCategory.DRINKS, price: 200, available: true, preparationTime: 3, description: 'Кофе с молочной пенкой', image: '☕' },
      { id: 22, name: 'Свежевыжатый сок', category: MenuCategory.DRINKS, price: 280, available: true, preparationTime: 5, description: 'Апельсиновый или яблочный', image: '🥤' },
      { id: 23, name: 'Лимонад домашний', category: MenuCategory.DRINKS, price: 220, available: true, preparationTime: 3, description: 'Освежающий домашний лимонад', image: '🍋' },
      
      // Алкоголь
      { id: 24, name: 'Вино красное (бокал)', category: MenuCategory.ALCOHOL, price: 450, available: true, preparationTime: 2, description: 'Красное сухое вино', image: '🍷' },
      { id: 25, name: 'Вино белое (бокал)', category: MenuCategory.ALCOHOL, price: 450, available: true, preparationTime: 2, description: 'Белое сухое вино', image: '🍷' },
      { id: 26, name: 'Пиво разливное', category: MenuCategory.ALCOHOL, price: 280, available: true, preparationTime: 2, description: 'Светлое пиво 0.5л', image: '🍺' },
    ];
  }
}


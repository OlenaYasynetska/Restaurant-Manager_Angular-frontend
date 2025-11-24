import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, MenuCategory } from '../models/restaurant.models';
import { mockMenuItems } from '../../data/mock-menu-items';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly STORAGE_KEY = 'restaurant_menu_items';
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.loadFromLocalStorage());
  public menuItems$ = this.menuItemsSubject.asObservable();
  private nextId = 27; // Следующий ID для новых блюд

  constructor() {
    // Загружаем данные из localStorage при инициализации
    const savedItems = this.loadFromLocalStorage();
    if (savedItems.length > 0) {
      // Обновляем nextId на основе максимального ID в сохраненных данных
      const maxId = Math.max(...savedItems.map(item => item.id));
      this.nextId = maxId + 1;
    }
  }

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
      image: data.image || '🍽️',
      imageUrl: data.imageUrl || undefined,
      translations: data.translations
    };

    const currentItems = this.menuItemsSubject.value;
    const updatedItems = [...currentItems, newItem];
    this.menuItemsSubject.next(updatedItems);
    this.saveToLocalStorage(updatedItems);
    
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
        translations: data.translations ?? currentItems[index].translations,
        id // Сохраняем оригинальный ID
      };
      const updatedItems = [...currentItems];
      this.menuItemsSubject.next(updatedItems);
      this.saveToLocalStorage(updatedItems);
    }
  }

  // Удалить блюдо
  deleteMenuItem(id: number): void {
    const currentItems = this.menuItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.menuItemsSubject.next(filteredItems);
    this.saveToLocalStorage(filteredItems);
  }

  // Сохранить данные в localStorage
  private saveToLocalStorage(items: MenuItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Ошибка при сохранении меню в localStorage:', error);
    }
  }

  // Загрузить данные из localStorage
  private loadFromLocalStorage(): MenuItem[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Ошибка при загрузке меню из localStorage:', error);
    }
    // Если данных нет или ошибка, возвращаем моковые данные
    return mockMenuItems;
  }
}


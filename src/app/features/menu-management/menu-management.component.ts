import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem, MenuCategory } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.component.html',
})
export class MenuManagementComponent implements OnInit {
  menuItems$ = this.menuService.getMenuItems();
  selectedCategory: MenuCategory | 'all' = 'all';
  
  // Модальное окно
  showModal = false;
  editingItem: MenuItem | null = null;
  
  // Форма
  formData = {
    name: '',
    category: MenuCategory.MAIN_DISHES,
    price: 0,
    description: '',
    preparationTime: 15,
    available: true,
    image: '',
    imageUrl: ''
  };
  
  // Категории
  categories = [
    { value: MenuCategory.APPETIZERS, label: 'Закуски' },
    { value: MenuCategory.SOUPS, label: 'Супы' },
    { value: MenuCategory.MAIN_DISHES, label: 'Основные блюда' },
    { value: MenuCategory.PASTA, label: 'Паста' },
    { value: MenuCategory.SALADS, label: 'Салаты' },
    { value: MenuCategory.DESSERTS, label: 'Десерты' },
    { value: MenuCategory.DRINKS, label: 'Напитки' },
    { value: MenuCategory.ALCOHOL, label: 'Алкоголь' },
  ];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {}

  // Фильтрация по категории
  getFilteredItems(items: MenuItem[] | null): MenuItem[] {
    if (!items) return [];
    if (this.selectedCategory === 'all') return items;
    return items.filter(item => item.category === this.selectedCategory);
  }

  // Открыть модальное окно для создания
  openCreateModal(): void {
    this.editingItem = null;
    this.formData = {
      name: '',
      category: MenuCategory.MAIN_DISHES,
      price: 0,
      description: '',
      preparationTime: 15,
      available: true,
      image: '',
      imageUrl: ''
    };
    this.showModal = true;
  }

  // Открыть модальное окно для редактирования
  openEditModal(item: MenuItem): void {
    this.editingItem = item;
    this.formData = {
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      preparationTime: item.preparationTime || 15,
      available: item.available,
      image: item.image || '',
      imageUrl: item.imageUrl || ''
    };
    this.showModal = true;
  }

  // Закрыть модальное окно
  closeModal(): void {
    this.showModal = false;
    this.editingItem = null;
  }

  // Сохранить блюдо
  saveItem(): void {
    if (!this.formData.name.trim()) {
      alert('Введите название блюда');
      return;
    }

    if (this.formData.price <= 0) {
      alert('Цена должна быть больше нуля');
      return;
    }

    if (this.editingItem) {
      // Редактирование
      this.menuService.updateMenuItem(this.editingItem.id, this.formData);
    } else {
      // Создание
      this.menuService.addMenuItem(this.formData);
    }

    this.closeModal();
  }

  // Удалить блюдо
  deleteItem(item: MenuItem): void {
    if (confirm(`Удалить блюдо "${item.name}"?`)) {
      this.menuService.deleteMenuItem(item.id);
    }
  }

  // Переключить доступность
  toggleAvailability(item: MenuItem): void {
    this.menuService.updateMenuItem(item.id, { available: !item.available });
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return `€${price.toLocaleString('ru-RU')}`;
  }

  // Обработка загрузки фото
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
      }

      // Проверка размера (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }

      // Чтение файла и конвертация в base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.formData.imageUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Удалить загруженное фото
  removePhoto(): void {
    this.formData.imageUrl = '';
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { RecipeService } from '../../core/services/recipe.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { MenuItem, MenuCategory, Recipe, RecipeIngredient, Unit, WarehouseItem } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.component.html',
})
export class MenuManagementComponent implements OnInit {
  menuItems$ = this.menuService.getMenuItems();
  warehouseItems$ = this.warehouseService.getItems();
  recipes$ = this.recipeService.getRecipes();
  selectedCategory: MenuCategory | 'all' = 'all';
  
  // Модальное окно блюда
  showModal = false;
  editingItem: MenuItem | null = null;
  
  // Модальное окно технологической карты
  showRecipeModal = false;
  editingRecipe: Recipe | null = null;
  selectedMenuItem: MenuItem | null = null;
  
  // Форма блюда
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
  
  // Форма рецепта
  recipeFormData: RecipeIngredient[] = [];
  recipeDescription = '';
  
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

  constructor(
    private menuService: MenuService,
    private recipeService: RecipeService,
    private warehouseService: WarehouseService
  ) {}

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

  // === ТЕХНОЛОГИЧЕСКИЕ КАРТЫ ===

  // Открыть технологическую карту блюда
  openRecipeModal(item: MenuItem): void {
    this.selectedMenuItem = item;
    const existingRecipe = this.recipeService.getRecipeByMenuItemId(item.id);
    
    if (existingRecipe) {
      this.editingRecipe = existingRecipe;
      this.recipeFormData = [...existingRecipe.ingredients];
      this.recipeDescription = existingRecipe.description || '';
    } else {
      this.editingRecipe = null;
      this.recipeFormData = [];
      this.recipeDescription = '';
    }
    
    this.showRecipeModal = true;
  }

  // Закрыть модальное окно рецепта
  closeRecipeModal(): void {
    this.showRecipeModal = false;
    this.editingRecipe = null;
    this.selectedMenuItem = null;
  }

  // Добавить ингредиент в рецепт
  addIngredient(): void {
    this.recipeFormData.push({
      warehouseItemId: 0,
      warehouseItemName: '',
      quantity: 0,
      unit: Unit.KG
    });
  }

  // Удалить ингредиент из рецепта
  removeIngredient(index: number): void {
    this.recipeFormData.splice(index, 1);
  }

  // Обновить ингредиент при выборе товара
  onIngredientChange(index: number, itemId: number, warehouseItems: WarehouseItem[]): void {
    const selectedItem = warehouseItems.find(item => item.id === itemId);
    if (selectedItem) {
      this.recipeFormData[index].warehouseItemId = selectedItem.id;
      this.recipeFormData[index].warehouseItemName = selectedItem.name;
      this.recipeFormData[index].unit = selectedItem.unit;
    }
  }

  // Сохранить технологическую карту
  saveRecipe(): void {
    if (!this.selectedMenuItem) return;

    // Валидация
    const validIngredients = this.recipeFormData.filter(
      ing => ing.warehouseItemId > 0 && ing.quantity > 0
    );

    if (validIngredients.length === 0) {
      alert('Добавьте хотя бы один ингредиент');
      return;
    }

    const recipeData = {
      menuItemId: this.selectedMenuItem.id,
      menuItemName: this.selectedMenuItem.name,
      ingredients: validIngredients,
      description: this.recipeDescription
    };

    if (this.editingRecipe) {
      // Обновление существующего рецепта
      this.recipeService.updateRecipe(this.editingRecipe.id, recipeData);
    } else {
      // Создание нового рецепта
      this.recipeService.addRecipe(recipeData);
    }

    this.closeRecipeModal();
  }

  // Проверить, есть ли у блюда технологическая карта
  hasRecipe(menuItemId: number, recipes: Recipe[] | null): boolean {
    if (!recipes) return false;
    return recipes.some(r => r.menuItemId === menuItemId);
  }

  // Получить иконку для технологической карты
  getRecipeIcon(menuItemId: number, recipes: Recipe[] | null): string {
    return this.hasRecipe(menuItemId, recipes) ? '📋✅' : '📋';
  }

  // Получить текст для кнопки технологической карты
  getRecipeButtonText(menuItemId: number, recipes: Recipe[] | null): string {
    return this.hasRecipe(menuItemId, recipes) ? 'Редактировать карту' : 'Создать карту';
  }
}


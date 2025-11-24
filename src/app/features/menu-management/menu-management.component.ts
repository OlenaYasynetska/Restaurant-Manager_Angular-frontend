import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { RecipeService } from '../../core/services/recipe.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { MenuItem, MenuCategory, Recipe, RecipeIngredient, Unit, WarehouseItem, TranslatedText } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
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
    { value: MenuCategory.APPETIZERS, labelKey: 'menu.category.appetizers' },
    { value: MenuCategory.SOUPS, labelKey: 'menu.category.soups' },
    { value: MenuCategory.MAIN_DISHES, labelKey: 'menu.category.main' },
    { value: MenuCategory.PASTA, labelKey: 'menu.category.pasta' },
    { value: MenuCategory.SALADS, labelKey: 'menu.category.salads' },
    { value: MenuCategory.DESSERTS, labelKey: 'menu.category.desserts' },
    { value: MenuCategory.DRINKS, labelKey: 'menu.category.drinks' },
    { value: MenuCategory.ALCOHOL, labelKey: 'menu.category.alcohol' },
  ];

  constructor(
    private menuService: MenuService,
    private recipeService: RecipeService,
    private warehouseService: WarehouseService,
    private languageService: LanguageService
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
      alert(this.t('menuManage.alert.nameRequired'));
      return;
    }

    if (this.formData.price <= 0) {
      alert(this.t('menuManage.alert.pricePositive'));
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
    if (confirm(`${this.t('menuManage.alert.deleteConfirm')} "${item.name}"?`)) {
      this.menuService.deleteMenuItem(item.id);
    }
  }

  // Переключить доступность
  toggleAvailability(item: MenuItem): void {
    this.menuService.updateMenuItem(item.id, { available: !item.available });
  }

  // Форматирование цены
  formatPrice(price: number): string {
    const locale = this.getLocale();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  // Обработка загрузки фото
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        alert(this.t('menuManage.alert.fileType'));
        return;
      }

      // Проверка размера (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(this.t('menuManage.alert.fileSize'));
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
      alert(this.t('menuManage.alert.addIngredient'));
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
    return this.hasRecipe(menuItemId, recipes) ? 'menuManage.recipeBtn.edit' : 'menuManage.recipeBtn.create';
  }

  getCategoryTranslationKey(category: MenuCategory): string {
    switch (category) {
      case MenuCategory.APPETIZERS:
        return 'menu.category.appetizers';
      case MenuCategory.SOUPS:
        return 'menu.category.soups';
      case MenuCategory.MAIN_DISHES:
        return 'menu.category.main';
      case MenuCategory.PASTA:
        return 'menu.category.pasta';
      case MenuCategory.SALADS:
        return 'menu.category.salads';
      case MenuCategory.DESSERTS:
        return 'menu.category.desserts';
      case MenuCategory.DRINKS:
        return 'menu.category.drinks';
      case MenuCategory.ALCOHOL:
        return 'menu.category.alcohol';
      default:
        return 'menu.category.all';
    }
  }

  private t(key: string): string {
    return this.languageService.translate(key);
  }

  private getLocale(): string {
    const lang = this.languageService.getCurrentLanguage();
    switch (lang) {
      case 'de':
        return 'de-DE';
      case 'ru':
        return 'ru-RU';
      default:
        return 'en-US';
    }
  }

  getLocalizedName(item: MenuItem): string {
    return this.translateField(item.translations?.name, item.name);
  }

  getLocalizedDescription(item: MenuItem): string {
    const fallback = item.description || '';
    return this.translateField(item.translations?.description, fallback);
  }

  getWarehouseItemLabel(item: WarehouseItem): string {
    const name = this.translateField(item.translations?.name, item.name);
    const unitLabel = this.getUnitLabel(item.unit);
    return `${name} (${item.quantity} ${unitLabel})`;
  }

  getUnitLabel(unit: Unit): string {
    return this.t(this.getUnitTranslationKey(unit));
  }

  private translateField(text?: TranslatedText, fallback: string = ''): string {
    if (!text) {
      return fallback;
    }
    const lang = this.languageService.getCurrentLanguage();
    return text[lang] || fallback;
  }

  private getUnitTranslationKey(unit: Unit): string {
    switch (unit) {
      case Unit.KG:
        return 'warehouse.unit.kg';
      case Unit.G:
        return 'warehouse.unit.g';
      case Unit.L:
        return 'warehouse.unit.l';
      case Unit.ML:
        return 'warehouse.unit.ml';
      case Unit.PCS:
        return 'warehouse.unit.pcs';
      case Unit.PACK:
        return 'warehouse.unit.pack';
      default:
        return 'warehouse.unit.pcs';
    }
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import { WarehouseItem, WarehouseOperation, WarehouseCategory, Unit, OperationType, TranslatedText } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './warehouse.component.html',
})
export class WarehouseComponent implements OnInit {
  items$ = this.warehouseService.getItems();
  operations$ = this.warehouseService.getOperations();
  
  // Модальные окна
  showItemModal = false;
  showOperationModal = false;
  editingItem: WarehouseItem | null = null;
  
  // Вкладки
  activeTab: 'items' | 'operations' = 'items';
  
  // Форма товара
  itemForm = {
    name: '',
    category: WarehouseCategory.OTHER,
    quantity: 0,
    unit: Unit.KG,
    minQuantity: 0,
    price: 0,
    supplier: ''
  };
  
  // Форма операции
  operationForm = {
    itemId: 0,
    type: OperationType.INCOMING,
    quantity: 0,
    notes: ''
  };
  
  // Фильтр
  selectedCategory: WarehouseCategory | 'all' = 'all';
  
  // Справочники
  categories = [
    { value: WarehouseCategory.MEAT, labelKey: 'warehouse.category.meat' },
    { value: WarehouseCategory.FISH, labelKey: 'warehouse.category.fish' },
    { value: WarehouseCategory.VEGETABLES, labelKey: 'warehouse.category.vegetables' },
    { value: WarehouseCategory.FRUITS, labelKey: 'warehouse.category.fruits' },
    { value: WarehouseCategory.DAIRY, labelKey: 'warehouse.category.dairy' },
    { value: WarehouseCategory.CEREALS, labelKey: 'warehouse.category.cereals' },
    { value: WarehouseCategory.SPICES, labelKey: 'warehouse.category.spices' },
    { value: WarehouseCategory.DRINKS, labelKey: 'warehouse.category.drinks' },
    { value: WarehouseCategory.ALCOHOL, labelKey: 'warehouse.category.alcohol' },
    { value: WarehouseCategory.OTHER, labelKey: 'warehouse.category.other' }
  ];
  
  units = [
    { value: Unit.KG, labelKey: 'warehouse.unit.kg' },
    { value: Unit.G, labelKey: 'warehouse.unit.g' },
    { value: Unit.L, labelKey: 'warehouse.unit.l' },
    { value: Unit.ML, labelKey: 'warehouse.unit.ml' },
    { value: Unit.PCS, labelKey: 'warehouse.unit.pcs' },
    { value: Unit.PACK, labelKey: 'warehouse.unit.pack' }
  ];
  
  operationTypes = [
    { value: OperationType.INCOMING, labelKey: 'warehouse.operation.incoming' },
    { value: OperationType.OUTGOING, labelKey: 'warehouse.operation.outgoing' },
    { value: OperationType.WRITE_OFF, labelKey: 'warehouse.operation.writeoff' }
  ];

  constructor(
    private warehouseService: WarehouseService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {}

  // === ФИЛЬТРАЦИЯ ===

  getFilteredItems(items: WarehouseItem[] | null): WarehouseItem[] {
    if (!items) return [];
    if (this.selectedCategory === 'all') return items;
    return items.filter(item => item.category === this.selectedCategory);
  }

  // === ТОВАРЫ ===

  openCreateItemModal(): void {
    this.editingItem = null;
    this.itemForm = {
      name: '',
      category: WarehouseCategory.OTHER,
      quantity: 0,
      unit: Unit.KG,
      minQuantity: 0,
      price: 0,
      supplier: ''
    };
    this.showItemModal = true;
  }

  openEditItemModal(item: WarehouseItem): void {
    this.editingItem = item;
    this.itemForm = {
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minQuantity: item.minQuantity,
      price: item.price,
      supplier: item.supplier || ''
    };
    this.showItemModal = true;
  }

  closeItemModal(): void {
    this.showItemModal = false;
    this.editingItem = null;
  }

  saveItem(): void {
    if (!this.itemForm.name.trim()) {
      alert(this.t('warehouse.alert.nameRequired'));
      return;
    }

    if (this.editingItem) {
      this.warehouseService.updateItem(this.editingItem.id, this.itemForm);
    } else {
      this.warehouseService.addItem(this.itemForm);
    }

    this.closeItemModal();
  }

  deleteItem(item: WarehouseItem): void {
    if (confirm(`${this.t('warehouse.alert.deleteConfirm')} "${item.name}"?`)) {
      this.warehouseService.deleteItem(item.id);
    }
  }

  // === ОПЕРАЦИИ ===

  openOperationModal(item?: WarehouseItem): void {
    this.operationForm = {
      itemId: item?.id || 0,
      type: OperationType.INCOMING,
      quantity: 0,
      notes: ''
    };
    this.showOperationModal = true;
  }

  closeOperationModal(): void {
    this.showOperationModal = false;
  }

  saveOperation(): void {
    if (this.operationForm.itemId === 0) {
      alert(this.t('warehouse.alert.selectItem'));
      return;
    }

    if (this.operationForm.quantity <= 0) {
      alert(this.t('warehouse.alert.enterQuantity'));
      return;
    }

    const { itemId, type, quantity, notes } = this.operationForm;

    let success = false;
    switch (type) {
      case OperationType.INCOMING:
        this.warehouseService.addIncoming(itemId, quantity, notes);
        success = true;
        break;
      case OperationType.OUTGOING:
        success = this.warehouseService.addOutgoing(itemId, quantity, notes);
        if (!success) alert(this.t('warehouse.alert.notEnoughStock'));
        break;
      case OperationType.WRITE_OFF:
        success = this.warehouseService.addWriteOff(itemId, quantity, notes);
        if (!success) alert(this.t('warehouse.alert.notEnoughStock'));
        break;
    }

    if (success) {
      this.closeOperationModal();
    }
  }

  // === УТИЛИТЫ ===

  getLowStockCount(items: WarehouseItem[] | null): number {
    if (!items) return 0;
    return items.filter(item => item.quantity <= item.minQuantity).length;
  }

  getTotalValue(): number {
    return this.warehouseService.getTotalValue();
  }

  isLowStock(item: WarehouseItem): boolean {
    return item.quantity <= item.minQuantity;
  }

  getStockStatusKey(item: WarehouseItem): string {
    if (item.quantity === 0) return 'warehouse.status.outOfStock';
    if (this.isLowStock(item)) return 'warehouse.status.lowStock';
    return 'warehouse.status.inStock';
  }

  getStockColor(item: WarehouseItem): string {
    if (item.quantity === 0) return 'text-red-600 bg-red-50';
    if (this.isLowStock(item)) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  }

  formatPrice(price: number): string {
    const locale = this.getLocale();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString(this.getLocale(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOperationColor(type: OperationType): string {
    switch (type) {
      case OperationType.INCOMING:
        return 'bg-green-100 text-green-700';
      case OperationType.OUTGOING:
        return 'bg-blue-100 text-blue-700';
      case OperationType.WRITE_OFF:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getCategoryLabel(category: WarehouseCategory): string {
    const entry = this.categories.find(cat => cat.value === category);
    return entry ? this.t(entry.labelKey) : category;
  }

  getUnitLabel(unit: Unit): string {
    const entry = this.units.find(u => u.value === unit);
    return entry ? this.t(entry.labelKey) : unit;
  }

  getOperationTypeLabel(type: OperationType): string {
    const entry = this.operationTypes.find(op => op.value === type);
    return entry ? this.t(entry.labelKey) : type;
  }

  getLocalizedName(item: WarehouseItem): string {
    return this.translateField(item.translations?.name, item.name);
  }

  getSupplierName(item: WarehouseItem): string {
    const fallback = item.supplier || '';
    if (!fallback) {
      return '-';
    }
    return this.translateField(item.translations?.supplier, fallback);
  }

  getOperationItemName(operation: WarehouseOperation, items: WarehouseItem[] | null): string {
    const item = items?.find(i => i.id === operation.itemId);
    return item ? this.getLocalizedName(item) : this.translateField(undefined, operation.itemName);
  }

  getLocalizedNotes(operation: WarehouseOperation): string {
    const fallback = operation.notes || '-';
    return this.translateField(operation.translations?.notes, fallback);
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

  private translateField(text?: TranslatedText, fallback: string = ''): string {
    if (!text) {
      return fallback;
    }
    const lang = this.languageService.getCurrentLanguage();
    return text[lang] || fallback;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import { WarehouseItem, WarehouseOperation, WarehouseCategory, Unit, OperationType } from '../../core/models/restaurant.models';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    { value: WarehouseCategory.MEAT, label: 'Мясо' },
    { value: WarehouseCategory.FISH, label: 'Рыба' },
    { value: WarehouseCategory.VEGETABLES, label: 'Овощи' },
    { value: WarehouseCategory.FRUITS, label: 'Фрукты' },
    { value: WarehouseCategory.DAIRY, label: 'Молочные продукты' },
    { value: WarehouseCategory.CEREALS, label: 'Крупы и макароны' },
    { value: WarehouseCategory.SPICES, label: 'Специи' },
    { value: WarehouseCategory.DRINKS, label: 'Напитки' },
    { value: WarehouseCategory.ALCOHOL, label: 'Алкоголь' },
    { value: WarehouseCategory.OTHER, label: 'Прочее' }
  ];
  
  units = [
    { value: Unit.KG, label: 'кг' },
    { value: Unit.G, label: 'г' },
    { value: Unit.L, label: 'л' },
    { value: Unit.ML, label: 'мл' },
    { value: Unit.PCS, label: 'шт' },
    { value: Unit.PACK, label: 'уп' }
  ];
  
  operationTypes = [
    { value: OperationType.INCOMING, label: 'Приход' },
    { value: OperationType.OUTGOING, label: 'Расход' },
    { value: OperationType.WRITE_OFF, label: 'Списание' }
  ];

  constructor(private warehouseService: WarehouseService) {}

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
      alert('Введите название товара');
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
    if (confirm(`Удалить товар "${item.name}"?`)) {
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
      alert('Выберите товар');
      return;
    }

    if (this.operationForm.quantity <= 0) {
      alert('Введите количество');
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
        if (!success) alert('Недостаточно товара на складе');
        break;
      case OperationType.WRITE_OFF:
        success = this.warehouseService.addWriteOff(itemId, quantity, notes);
        if (!success) alert('Недостаточно товара на складе');
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

  getStockStatus(item: WarehouseItem): string {
    if (item.quantity === 0) return 'Нет в наличии';
    if (this.isLowStock(item)) return 'Низкий остаток';
    return 'В наличии';
  }

  getStockColor(item: WarehouseItem): string {
    if (item.quantity === 0) return 'text-red-600 bg-red-50';
    if (this.isLowStock(item)) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  }

  formatPrice(price: number): string {
    return `€${price.toLocaleString('ru-RU')}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('ru-RU', {
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

  getItemName(itemId: number, items: WarehouseItem[] | null): string {
    if (!items) return '';
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Неизвестно';
  }
}

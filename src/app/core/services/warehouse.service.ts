import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WarehouseItem, WarehouseOperation, WarehouseCategory, Unit, OperationType } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private itemsSubject = new BehaviorSubject<WarehouseItem[]>(this.getMockItems());
  private operationsSubject = new BehaviorSubject<WarehouseOperation[]>(this.getMockOperations());
  
  items$ = this.itemsSubject.asObservable();
  operations$ = this.operationsSubject.asObservable();
  
  private nextItemId = 47;
  private nextOperationId = 6;

  constructor() {}

  // === ТОВАРЫ ===

  getItems(): Observable<WarehouseItem[]> {
    return this.items$;
  }

  getItemById(id: number): WarehouseItem | undefined {
    return this.itemsSubject.value.find(item => item.id === id);
  }

  addItem(data: Partial<WarehouseItem>): WarehouseItem {
    const newItem: WarehouseItem = {
      id: this.nextItemId++,
      name: data.name || '',
      category: data.category || WarehouseCategory.OTHER,
      quantity: data.quantity || 0,
      unit: data.unit || Unit.PCS,
      minQuantity: data.minQuantity || 0,
      price: data.price || 0,
      supplier: data.supplier,
      lastUpdated: new Date()
    };

    const current = this.itemsSubject.value;
    this.itemsSubject.next([...current, newItem]);
    return newItem;
  }

  updateItem(id: number, data: Partial<WarehouseItem>): void {
    const current = this.itemsSubject.value;
    const index = current.findIndex(item => item.id === id);
    
    if (index !== -1) {
      current[index] = {
        ...current[index],
        ...data,
        id,
        lastUpdated: new Date()
      };
      this.itemsSubject.next([...current]);
    }
  }

  deleteItem(id: number): void {
    const current = this.itemsSubject.value;
    this.itemsSubject.next(current.filter(item => item.id !== id));
  }

  // === ОПЕРАЦИИ ===

  getOperations(): Observable<WarehouseOperation[]> {
    return this.operations$;
  }

  getOperationsByItemId(itemId: number): WarehouseOperation[] {
    return this.operationsSubject.value.filter(op => op.itemId === itemId);
  }

  // Приход товара
  addIncoming(itemId: number, quantity: number, notes?: string): void {
    const item = this.getItemById(itemId);
    if (!item) return;

    // Увеличиваем количество
    this.updateItem(itemId, {
      quantity: item.quantity + quantity
    });

    // Добавляем операцию
    this.addOperation({
      itemId,
      itemName: item.name,
      type: OperationType.INCOMING,
      quantity,
      unit: item.unit,
      notes
    });
  }

  // Расход товара
  addOutgoing(itemId: number, quantity: number, notes?: string): boolean {
    const item = this.getItemById(itemId);
    if (!item) return false;

    // Проверяем наличие
    if (item.quantity < quantity) {
      return false;
    }

    // Уменьшаем количество
    this.updateItem(itemId, {
      quantity: item.quantity - quantity
    });

    // Добавляем операцию
    this.addOperation({
      itemId,
      itemName: item.name,
      type: OperationType.OUTGOING,
      quantity,
      unit: item.unit,
      notes
    });

    return true;
  }

  // Списание товара
  addWriteOff(itemId: number, quantity: number, notes?: string): boolean {
    const item = this.getItemById(itemId);
    if (!item) return false;

    // Проверяем наличие
    if (item.quantity < quantity) {
      return false;
    }

    // Уменьшаем количество
    this.updateItem(itemId, {
      quantity: item.quantity - quantity
    });

    // Добавляем операцию
    this.addOperation({
      itemId,
      itemName: item.name,
      type: OperationType.WRITE_OFF,
      quantity,
      unit: item.unit,
      notes
    });

    return true;
  }

  private addOperation(data: Partial<WarehouseOperation>): void {
    const newOperation: WarehouseOperation = {
      id: this.nextOperationId++,
      itemId: data.itemId!,
      itemName: data.itemName!,
      type: data.type!,
      quantity: data.quantity!,
      unit: data.unit!,
      date: new Date(),
      notes: data.notes,
      userName: 'admin' // TODO: get from auth service
    };

    const current = this.operationsSubject.value;
    this.operationsSubject.next([newOperation, ...current]);
  }

  // Получить товары с низким остатком
  getLowStockItems(): WarehouseItem[] {
    return this.itemsSubject.value.filter(item => item.quantity <= item.minQuantity);
  }

  // Рассчитать общую стоимость товаров
  getTotalValue(): number {
    return this.itemsSubject.value.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  }

  // === MOCK DATA ===

  private getMockItems(): WarehouseItem[] {
    return [
      { id: 1, name: 'Говядина рибай', category: WarehouseCategory.MEAT, quantity: 15, unit: Unit.KG, minQuantity: 10, price: 25, supplier: 'МясоПром', lastUpdated: new Date() },
      { id: 2, name: 'Куриное филе', category: WarehouseCategory.MEAT, quantity: 25, unit: Unit.KG, minQuantity: 15, price: 8, supplier: 'МясоПром', lastUpdated: new Date() },
      { id: 3, name: 'Лосось свежий', category: WarehouseCategory.FISH, quantity: 8, unit: Unit.KG, minQuantity: 5, price: 30, supplier: 'РыбаОкеан', lastUpdated: new Date() },
      { id: 4, name: 'Томаты', category: WarehouseCategory.VEGETABLES, quantity: 20, unit: Unit.KG, minQuantity: 10, price: 3, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 5, name: 'Картофель', category: WarehouseCategory.VEGETABLES, quantity: 50, unit: Unit.KG, minQuantity: 20, price: 1.5, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 6, name: 'Сыр Пармезан', category: WarehouseCategory.DAIRY, quantity: 3, unit: Unit.KG, minQuantity: 2, price: 18, supplier: 'Италия Экспорт', lastUpdated: new Date() },
      { id: 7, name: 'Молоко 3.2%', category: WarehouseCategory.DAIRY, quantity: 30, unit: Unit.L, minQuantity: 15, price: 1.2, supplier: 'Молочный дом', lastUpdated: new Date() },
      { id: 8, name: 'Спагетти', category: WarehouseCategory.CEREALS, quantity: 25, unit: Unit.PACK, minQuantity: 10, price: 2, supplier: 'Барилла', lastUpdated: new Date() },
      { id: 9, name: 'Оливковое масло', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.L, minQuantity: 5, price: 8, supplier: 'Греция Продукты', lastUpdated: new Date() },
      { id: 10, name: 'Вино красное', category: WarehouseCategory.ALCOHOL, quantity: 24, unit: Unit.PCS, minQuantity: 12, price: 12, supplier: 'Виноторг', lastUpdated: new Date() },
      { id: 11, name: 'Багет', category: WarehouseCategory.OTHER, quantity: 40, unit: Unit.PCS, minQuantity: 15, price: 0.9, supplier: 'Пекарня Хлеб и маслины', lastUpdated: new Date() },
      { id: 12, name: 'Базилик свежий', category: WarehouseCategory.VEGETABLES, quantity: 3, unit: Unit.KG, minQuantity: 1, price: 7, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 13, name: 'Чеснок', category: WarehouseCategory.VEGETABLES, quantity: 6, unit: Unit.KG, minQuantity: 2, price: 4, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 14, name: 'Рукола', category: WarehouseCategory.VEGETABLES, quantity: 4, unit: Unit.KG, minQuantity: 1, price: 6, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 15, name: 'Лимон', category: WarehouseCategory.FRUITS, quantity: 60, unit: Unit.PCS, minQuantity: 20, price: 0.8, supplier: 'ЦитрусМарт', lastUpdated: new Date() },
      { id: 16, name: 'Креветки', category: WarehouseCategory.FISH, quantity: 12, unit: Unit.KG, minQuantity: 5, price: 18, supplier: 'РыбаОкеан', lastUpdated: new Date() },
      { id: 17, name: 'Кокосовое молоко', category: WarehouseCategory.OTHER, quantity: 20, unit: Unit.L, minQuantity: 8, price: 3.5, supplier: 'Тропикана', lastUpdated: new Date() },
      { id: 18, name: 'Лайм', category: WarehouseCategory.FRUITS, quantity: 50, unit: Unit.PCS, minQuantity: 15, price: 0.9, supplier: 'ЦитрусМарт', lastUpdated: new Date() },
      { id: 19, name: 'Грибы', category: WarehouseCategory.VEGETABLES, quantity: 15, unit: Unit.KG, minQuantity: 5, price: 4, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 20, name: 'Сливки 33%', category: WarehouseCategory.DAIRY, quantity: 25, unit: Unit.L, minQuantity: 10, price: 1.7, supplier: 'Молочный дом', lastUpdated: new Date() },
      { id: 21, name: 'Свекла', category: WarehouseCategory.VEGETABLES, quantity: 20, unit: Unit.KG, minQuantity: 8, price: 2.5, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 22, name: 'Капуста', category: WarehouseCategory.VEGETABLES, quantity: 30, unit: Unit.KG, minQuantity: 12, price: 1.2, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 23, name: 'Сметана', category: WarehouseCategory.DAIRY, quantity: 18, unit: Unit.KG, minQuantity: 6, price: 3.2, supplier: 'Молочный дом', lastUpdated: new Date() },
      { id: 24, name: 'Бекон', category: WarehouseCategory.MEAT, quantity: 10, unit: Unit.KG, minQuantity: 4, price: 12, supplier: 'МясоПром', lastUpdated: new Date() },
      { id: 25, name: 'Яйца', category: WarehouseCategory.OTHER, quantity: 200, unit: Unit.PCS, minQuantity: 50, price: 0.2, supplier: 'Птичий двор', lastUpdated: new Date() },
      { id: 26, name: 'Свиные ребрышки', category: WarehouseCategory.MEAT, quantity: 12, unit: Unit.KG, minQuantity: 5, price: 9, supplier: 'МясоПром', lastUpdated: new Date() },
      { id: 27, name: 'Соус барбекю', category: WarehouseCategory.OTHER, quantity: 15, unit: Unit.L, minQuantity: 5, price: 6, supplier: 'Барбекю Лаб', lastUpdated: new Date() },
      { id: 28, name: 'Томатный соус', category: WarehouseCategory.OTHER, quantity: 20, unit: Unit.L, minQuantity: 8, price: 2.5, supplier: 'Томатик', lastUpdated: new Date() },
      { id: 29, name: 'Фарш говяжий', category: WarehouseCategory.MEAT, quantity: 18, unit: Unit.KG, minQuantity: 7, price: 10, supplier: 'МясоПром', lastUpdated: new Date() },
      { id: 30, name: 'Оливки', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.KG, minQuantity: 4, price: 7, supplier: 'Греция Продукты', lastUpdated: new Date() },
      { id: 31, name: 'Огурцы', category: WarehouseCategory.VEGETABLES, quantity: 25, unit: Unit.KG, minQuantity: 8, price: 2, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 32, name: 'Сыр фета', category: WarehouseCategory.DAIRY, quantity: 4, unit: Unit.KG, minQuantity: 2, price: 10, supplier: 'Балканские сыры', lastUpdated: new Date() },
      { id: 33, name: 'Салат ромэн', category: WarehouseCategory.VEGETABLES, quantity: 18, unit: Unit.KG, minQuantity: 5, price: 5, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 34, name: 'Тунец консервированный', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.KG, minQuantity: 4, price: 11, supplier: 'Морепродукты UA', lastUpdated: new Date() },
      { id: 35, name: 'Микс зелени', category: WarehouseCategory.VEGETABLES, quantity: 10, unit: Unit.KG, minQuantity: 3, price: 6, supplier: 'ФрешОвощ', lastUpdated: new Date() },
      { id: 36, name: 'Маскарпоне', category: WarehouseCategory.DAIRY, quantity: 8, unit: Unit.KG, minQuantity: 3, price: 14, supplier: 'Италия Экспорт', lastUpdated: new Date() },
      { id: 37, name: 'Кофейные зерна', category: WarehouseCategory.OTHER, quantity: 5, unit: Unit.KG, minQuantity: 2, price: 18, supplier: 'Кофе&Кофе', lastUpdated: new Date() },
      { id: 38, name: 'Какао-порошок', category: WarehouseCategory.OTHER, quantity: 6, unit: Unit.KG, minQuantity: 2, price: 9, supplier: 'Шоколадный дом', lastUpdated: new Date() },
      { id: 39, name: 'Сахар', category: WarehouseCategory.OTHER, quantity: 40, unit: Unit.KG, minQuantity: 15, price: 0.8, supplier: 'Сахарная фабрика', lastUpdated: new Date() },
      { id: 40, name: 'Савоярди', category: WarehouseCategory.OTHER, quantity: 30, unit: Unit.PACK, minQuantity: 8, price: 3, supplier: 'Италия Экспорт', lastUpdated: new Date() },
      { id: 41, name: 'Апельсиновый сок', category: WarehouseCategory.DRINKS, quantity: 25, unit: Unit.L, minQuantity: 10, price: 2, supplier: 'ФрешСок', lastUpdated: new Date() },
      { id: 42, name: 'Яблочный сок', category: WarehouseCategory.DRINKS, quantity: 20, unit: Unit.L, minQuantity: 8, price: 2, supplier: 'ФрешСок', lastUpdated: new Date() },
      { id: 43, name: 'Газированная вода', category: WarehouseCategory.DRINKS, quantity: 30, unit: Unit.L, minQuantity: 10, price: 1.5, supplier: 'ВодаПлюс', lastUpdated: new Date() },
      { id: 44, name: 'Вино белое', category: WarehouseCategory.ALCOHOL, quantity: 18, unit: Unit.PCS, minQuantity: 8, price: 11, supplier: 'Виноторг', lastUpdated: new Date() },
      { id: 45, name: 'Светлое пиво', category: WarehouseCategory.ALCOHOL, quantity: 60, unit: Unit.L, minQuantity: 20, price: 4, supplier: 'Пивзавод', lastUpdated: new Date() },
      { id: 46, name: 'Желатин', category: WarehouseCategory.OTHER, quantity: 25, unit: Unit.PACK, minQuantity: 6, price: 1.2, supplier: 'Сладкий дом', lastUpdated: new Date() }
    ];
  }

  private getMockOperations(): WarehouseOperation[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
      { id: 1, itemId: 1, itemName: 'Говядина рибай', type: OperationType.INCOMING, quantity: 20, unit: Unit.KG, date: yesterday, notes: 'Поставка от МясоПром', userName: 'admin' },
      { id: 2, itemId: 1, itemName: 'Говядина рибай', type: OperationType.OUTGOING, quantity: 5, unit: Unit.KG, date: today, notes: 'Использовано на кухне', userName: 'admin' },
      { id: 3, itemId: 4, itemName: 'Томаты', type: OperationType.INCOMING, quantity: 30, unit: Unit.KG, date: yesterday, notes: 'Свежая поставка', userName: 'admin' },
      { id: 4, itemId: 4, itemName: 'Томаты', type: OperationType.WRITE_OFF, quantity: 10, unit: Unit.KG, date: today, notes: 'Испортились', userName: 'admin' },
      { id: 5, itemId: 10, itemName: 'Вино красное', type: OperationType.OUTGOING, quantity: 6, unit: Unit.PCS, date: today, notes: 'Продано гостям', userName: 'admin' }
    ];
  }
}


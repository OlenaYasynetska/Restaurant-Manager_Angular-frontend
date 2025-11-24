import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WarehouseItem, WarehouseOperation, WarehouseCategory, Unit, OperationType, TranslatedText } from '../models/restaurant.models';

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
      userName: 'admin', // TODO: get from auth service
      translations: data.translations
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
    const t = (ru: string, en: string, de: string): TranslatedText => ({ ru, en, de });
    const createItem = (config: {
      id: number;
      name: string;
      nameEn: string;
      nameDe: string;
      category: WarehouseCategory;
      quantity: number;
      unit: Unit;
      min: number;
      price: number;
      supplier?: string;
      supplierEn?: string;
      supplierDe?: string;
    }): WarehouseItem => ({
      id: config.id,
      name: config.name,
      category: config.category,
      quantity: config.quantity,
      unit: config.unit,
      minQuantity: config.min,
      price: config.price,
      supplier: config.supplier,
      lastUpdated: new Date(),
      translations: {
        name: t(config.name, config.nameEn, config.nameDe),
        supplier: config.supplier
          ? t(
              config.supplier,
              config.supplierEn ?? config.supplier,
              config.supplierDe ?? config.supplier
            )
          : undefined
      }
    });

    return [
      createItem({ id: 1, name: 'Говядина рибай', nameEn: 'Ribeye beef', nameDe: 'Ribeye-Rindfleisch', category: WarehouseCategory.MEAT, quantity: 15, unit: Unit.KG, min: 10, price: 25, supplier: 'МясоПром', supplierEn: 'MeatProm', supplierDe: 'FleischProm' }),
      createItem({ id: 2, name: 'Куриное филе', nameEn: 'Chicken fillet', nameDe: 'Hähnchenfilet', category: WarehouseCategory.MEAT, quantity: 25, unit: Unit.KG, min: 15, price: 8, supplier: 'МясоПром', supplierEn: 'MeatProm', supplierDe: 'FleischProm' }),
      createItem({ id: 3, name: 'Лосось свежий', nameEn: 'Fresh salmon', nameDe: 'Frischer Lachs', category: WarehouseCategory.FISH, quantity: 8, unit: Unit.KG, min: 5, price: 30, supplier: 'РыбаОкеан', supplierEn: 'FishOcean', supplierDe: 'FischOzean' }),
      createItem({ id: 4, name: 'Томаты', nameEn: 'Tomatoes', nameDe: 'Tomaten', category: WarehouseCategory.VEGETABLES, quantity: 20, unit: Unit.KG, min: 10, price: 3, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 5, name: 'Картофель', nameEn: 'Potatoes', nameDe: 'Kartoffeln', category: WarehouseCategory.VEGETABLES, quantity: 50, unit: Unit.KG, min: 20, price: 1.5, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 6, name: 'Сыр Пармезан', nameEn: 'Parmesan cheese', nameDe: 'Parmesankäse', category: WarehouseCategory.DAIRY, quantity: 3, unit: Unit.KG, min: 2, price: 18, supplier: 'Италия Экспорт', supplierEn: 'Italia Export', supplierDe: 'Italien Export' }),
      createItem({ id: 7, name: 'Молоко 3.2%', nameEn: 'Milk 3.2%', nameDe: 'Milch 3,2%', category: WarehouseCategory.DAIRY, quantity: 30, unit: Unit.L, min: 15, price: 1.2, supplier: 'Молочный дом', supplierEn: 'Dairy House', supplierDe: 'Milchhaus' }),
      createItem({ id: 8, name: 'Спагетти', nameEn: 'Spaghetti', nameDe: 'Spaghetti', category: WarehouseCategory.CEREALS, quantity: 25, unit: Unit.PACK, min: 10, price: 2, supplier: 'Барилла', supplierEn: 'Barilla', supplierDe: 'Barilla' }),
      createItem({ id: 9, name: 'Оливковое масло', nameEn: 'Olive oil', nameDe: 'Olivenöl', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.L, min: 5, price: 8, supplier: 'Греция Продукты', supplierEn: 'Greece Foods', supplierDe: 'Griechenland Produkte' }),
      createItem({ id: 10, name: 'Вино красное', nameEn: 'Red wine', nameDe: 'Rotwein', category: WarehouseCategory.ALCOHOL, quantity: 24, unit: Unit.PCS, min: 12, price: 12, supplier: 'Виноторг', supplierEn: 'Vinotorg', supplierDe: 'Weinhandel' }),
      createItem({ id: 11, name: 'Багет', nameEn: 'Baguette', nameDe: 'Baguette', category: WarehouseCategory.OTHER, quantity: 40, unit: Unit.PCS, min: 15, price: 0.9, supplier: 'Пекарня Хлеб и маслины', supplierEn: 'Bread & Olives Bakery', supplierDe: 'Bäckerei Brot & Oliven' }),
      createItem({ id: 12, name: 'Базилик свежий', nameEn: 'Fresh basil', nameDe: 'Frischer Basilikum', category: WarehouseCategory.VEGETABLES, quantity: 3, unit: Unit.KG, min: 1, price: 7, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 13, name: 'Чеснок', nameEn: 'Garlic', nameDe: 'Knoblauch', category: WarehouseCategory.VEGETABLES, quantity: 6, unit: Unit.KG, min: 2, price: 4, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 14, name: 'Рукола', nameEn: 'Arugula', nameDe: 'Rucola', category: WarehouseCategory.VEGETABLES, quantity: 4, unit: Unit.KG, min: 1, price: 6, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 15, name: 'Лимон', nameEn: 'Lemon', nameDe: 'Zitrone', category: WarehouseCategory.FRUITS, quantity: 60, unit: Unit.PCS, min: 20, price: 0.8, supplier: 'ЦитрусМарт', supplierEn: 'CitrusMart', supplierDe: 'ZitrusMart' }),
      createItem({ id: 16, name: 'Креветки', nameEn: 'Shrimps', nameDe: 'Garnelen', category: WarehouseCategory.FISH, quantity: 12, unit: Unit.KG, min: 5, price: 18, supplier: 'РыбаОкеан', supplierEn: 'FishOcean', supplierDe: 'FischOzean' }),
      createItem({ id: 17, name: 'Кокосовое молоко', nameEn: 'Coconut milk', nameDe: 'Kokosmilch', category: WarehouseCategory.OTHER, quantity: 20, unit: Unit.L, min: 8, price: 3.5, supplier: 'Тропикана', supplierEn: 'Tropicana', supplierDe: 'Tropicana' }),
      createItem({ id: 18, name: 'Лайм', nameEn: 'Lime', nameDe: 'Limette', category: WarehouseCategory.FRUITS, quantity: 50, unit: Unit.PCS, min: 15, price: 0.9, supplier: 'ЦитрусМарт', supplierEn: 'CitrusMart', supplierDe: 'ZitrusMart' }),
      createItem({ id: 19, name: 'Грибы', nameEn: 'Mushrooms', nameDe: 'Pilze', category: WarehouseCategory.VEGETABLES, quantity: 15, unit: Unit.KG, min: 5, price: 4, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 20, name: 'Сливки 33%', nameEn: 'Cream 33%', nameDe: 'Sahne 33%', category: WarehouseCategory.DAIRY, quantity: 25, unit: Unit.L, min: 10, price: 1.7, supplier: 'Молочный дом', supplierEn: 'Dairy House', supplierDe: 'Milchhaus' }),
      createItem({ id: 21, name: 'Свекла', nameEn: 'Beetroot', nameDe: 'Rote Bete', category: WarehouseCategory.VEGETABLES, quantity: 20, unit: Unit.KG, min: 8, price: 2.5, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 22, name: 'Капуста', nameEn: 'Cabbage', nameDe: 'Kohl', category: WarehouseCategory.VEGETABLES, quantity: 30, unit: Unit.KG, min: 12, price: 1.2, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 23, name: 'Сметана', nameEn: 'Sour cream', nameDe: 'Sauerrahm', category: WarehouseCategory.DAIRY, quantity: 18, unit: Unit.KG, min: 6, price: 3.2, supplier: 'Молочный дом', supplierEn: 'Dairy House', supplierDe: 'Milchhaus' }),
      createItem({ id: 24, name: 'Бекон', nameEn: 'Bacon', nameDe: 'Speck', category: WarehouseCategory.MEAT, quantity: 10, unit: Unit.KG, min: 4, price: 12, supplier: 'МясоПром', supplierEn: 'MeatProm', supplierDe: 'FleischProm' }),
      createItem({ id: 25, name: 'Яйца', nameEn: 'Eggs', nameDe: 'Eier', category: WarehouseCategory.OTHER, quantity: 200, unit: Unit.PCS, min: 50, price: 0.2, supplier: 'Птичий двор', supplierEn: 'Bird Yard', supplierDe: 'Vogelhof' }),
      createItem({ id: 26, name: 'Свиные ребрышки', nameEn: 'Pork ribs', nameDe: 'Schweinerippchen', category: WarehouseCategory.MEAT, quantity: 12, unit: Unit.KG, min: 5, price: 9, supplier: 'МясоПром', supplierEn: 'MeatProm', supplierDe: 'FleischProm' }),
      createItem({ id: 27, name: 'Соус барбекю', nameEn: 'Barbecue sauce', nameDe: 'Barbecuesoße', category: WarehouseCategory.OTHER, quantity: 15, unit: Unit.L, min: 5, price: 6, supplier: 'Барбекю Лаб', supplierEn: 'BBQ Lab', supplierDe: 'BBQ Labor' }),
      createItem({ id: 28, name: 'Томатный соус', nameEn: 'Tomato sauce', nameDe: 'Tomatensoße', category: WarehouseCategory.OTHER, quantity: 20, unit: Unit.L, min: 8, price: 2.5, supplier: 'Томатик', supplierEn: 'Tomatik', supplierDe: 'Tomatik' }),
      createItem({ id: 29, name: 'Фарш говяжий', nameEn: 'Ground beef', nameDe: 'Rinderhack', category: WarehouseCategory.MEAT, quantity: 18, unit: Unit.KG, min: 7, price: 10, supplier: 'МясоПром', supplierEn: 'MeatProm', supplierDe: 'FleischProm' }),
      createItem({ id: 30, name: 'Оливки', nameEn: 'Olives', nameDe: 'Oliven', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.KG, min: 4, price: 7, supplier: 'Греция Продукты', supplierEn: 'Greece Foods', supplierDe: 'Griechenland Produkte' }),
      createItem({ id: 31, name: 'Огурцы', nameEn: 'Cucumbers', nameDe: 'Gurken', category: WarehouseCategory.VEGETABLES, quantity: 25, unit: Unit.KG, min: 8, price: 2, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 32, name: 'Сыр фета', nameEn: 'Feta cheese', nameDe: 'Feta-Käse', category: WarehouseCategory.DAIRY, quantity: 4, unit: Unit.KG, min: 2, price: 10, supplier: 'Балканские сыры', supplierEn: 'Balkan Cheeses', supplierDe: 'Balkan-Käse' }),
      createItem({ id: 33, name: 'Салат ромэн', nameEn: 'Romaine lettuce', nameDe: 'Römersalat', category: WarehouseCategory.VEGETABLES, quantity: 18, unit: Unit.KG, min: 5, price: 5, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 34, name: 'Тунец консервированный', nameEn: 'Canned tuna', nameDe: 'Dosen-Thunfisch', category: WarehouseCategory.OTHER, quantity: 12, unit: Unit.KG, min: 4, price: 11, supplier: 'Морепродукты UA', supplierEn: 'Seafood UA', supplierDe: 'Meeresfrüchte UA' }),
      createItem({ id: 35, name: 'Микс зелени', nameEn: 'Herb mix', nameDe: 'Kräutermix', category: WarehouseCategory.VEGETABLES, quantity: 10, unit: Unit.KG, min: 3, price: 6, supplier: 'ФрешОвощ', supplierEn: 'FreshVeg', supplierDe: 'FrischGemüse' }),
      createItem({ id: 36, name: 'Маскарпоне', nameEn: 'Mascarpone', nameDe: 'Mascarpone', category: WarehouseCategory.DAIRY, quantity: 8, unit: Unit.KG, min: 3, price: 14, supplier: 'Италия Экспорт', supplierEn: 'Italia Export', supplierDe: 'Italien Export' }),
      createItem({ id: 37, name: 'Кофейные зерна', nameEn: 'Coffee beans', nameDe: 'Kaffeebohnen', category: WarehouseCategory.OTHER, quantity: 5, unit: Unit.KG, min: 2, price: 18, supplier: 'Кофе&Кофе', supplierEn: 'Coffee&Coffee', supplierDe: 'Kaffee&Kaffee' }),
      createItem({ id: 38, name: 'Какао-порошок', nameEn: 'Cocoa powder', nameDe: 'Kakaopulver', category: WarehouseCategory.OTHER, quantity: 6, unit: Unit.KG, min: 2, price: 9, supplier: 'Шоколадный дом', supplierEn: 'Chocolate House', supplierDe: 'Schokoladenhaus' }),
      createItem({ id: 39, name: 'Сахар', nameEn: 'Sugar', nameDe: 'Zucker', category: WarehouseCategory.OTHER, quantity: 40, unit: Unit.KG, min: 15, price: 0.8, supplier: 'Сахарная фабрика', supplierEn: 'Sugar Factory', supplierDe: 'Zuckerfabrik' }),
      createItem({ id: 40, name: 'Савоярди', nameEn: 'Savoiardi', nameDe: 'Savoiardi', category: WarehouseCategory.OTHER, quantity: 30, unit: Unit.PACK, min: 8, price: 3, supplier: 'Италия Экспорт', supplierEn: 'Italia Export', supplierDe: 'Italien Export' }),
      createItem({ id: 41, name: 'Апельсиновый сок', nameEn: 'Orange juice', nameDe: 'Orangensaft', category: WarehouseCategory.DRINKS, quantity: 25, unit: Unit.L, min: 10, price: 2, supplier: 'ФрешСок', supplierEn: 'FreshJuice', supplierDe: 'FrischSaft' }),
      createItem({ id: 42, name: 'Яблочный сок', nameEn: 'Apple juice', nameDe: 'Apfelsaft', category: WarehouseCategory.DRINKS, quantity: 20, unit: Unit.L, min: 8, price: 2, supplier: 'ФрешСок', supplierEn: 'FreshJuice', supplierDe: 'FrischSaft' }),
      createItem({ id: 43, name: 'Газированная вода', nameEn: 'Sparkling water', nameDe: 'Sprudelwasser', category: WarehouseCategory.DRINKS, quantity: 30, unit: Unit.L, min: 10, price: 1.5, supplier: 'ВодаПлюс', supplierEn: 'WaterPlus', supplierDe: 'WasserPlus' }),
      createItem({ id: 44, name: 'Вино белое', nameEn: 'White wine', nameDe: 'Weißwein', category: WarehouseCategory.ALCOHOL, quantity: 18, unit: Unit.PCS, min: 8, price: 11, supplier: 'Виноторг', supplierEn: 'Vinotorg', supplierDe: 'Weinhandel' }),
      createItem({ id: 45, name: 'Светлое пиво', nameEn: 'Light beer', nameDe: 'Helles Bier', category: WarehouseCategory.ALCOHOL, quantity: 60, unit: Unit.L, min: 20, price: 4, supplier: 'Пивзавод', supplierEn: 'Brewery', supplierDe: 'Brauerei' }),
      createItem({ id: 46, name: 'Желатин', nameEn: 'Gelatin', nameDe: 'Gelatine', category: WarehouseCategory.OTHER, quantity: 25, unit: Unit.PACK, min: 6, price: 1.2, supplier: 'Сладкий дом', supplierEn: 'Sweet House', supplierDe: 'Süßes Haus' })
    ];
  }

  private getMockOperations(): WarehouseOperation[] {
    const t = (ru: string, en: string, de: string): TranslatedText => ({ ru, en, de });
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
      {
        id: 1,
        itemId: 1,
        itemName: 'Говядина рибай',
        type: OperationType.INCOMING,
        quantity: 20,
        unit: Unit.KG,
        date: yesterday,
        notes: 'Поставка от МясоПром',
        userName: 'admin',
        translations: {
          notes: t('Поставка от МясоПром', 'Delivery from MeatProm', 'Lieferung von FleischProm')
        }
      },
      {
        id: 2,
        itemId: 1,
        itemName: 'Говядина рибай',
        type: OperationType.OUTGOING,
        quantity: 5,
        unit: Unit.KG,
        date: today,
        notes: 'Использовано на кухне',
        userName: 'admin',
        translations: {
          notes: t('Использовано на кухне', 'Used in kitchen', 'In der Küche verwendet')
        }
      },
      {
        id: 3,
        itemId: 4,
        itemName: 'Томаты',
        type: OperationType.INCOMING,
        quantity: 30,
        unit: Unit.KG,
        date: yesterday,
        notes: 'Свежая поставка',
        userName: 'admin',
        translations: {
          notes: t('Свежая поставка', 'Fresh delivery', 'Frische Lieferung')
        }
      },
      {
        id: 4,
        itemId: 4,
        itemName: 'Томаты',
        type: OperationType.WRITE_OFF,
        quantity: 10,
        unit: Unit.KG,
        date: today,
        notes: 'Испортились',
        userName: 'admin',
        translations: {
          notes: t('Испортились', 'Spoiled', 'Verdorben')
        }
      },
      {
        id: 5,
        itemId: 10,
        itemName: 'Вино красное',
        type: OperationType.OUTGOING,
        quantity: 6,
        unit: Unit.PCS,
        date: today,
        notes: 'Продано гостям',
        userName: 'admin',
        translations: {
          notes: t('Продано гостям', 'Sold to guests', 'An Gäste verkauft')
        }
      }
    ];
  }
}


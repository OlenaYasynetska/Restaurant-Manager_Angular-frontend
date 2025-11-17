import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Order, OrderItem, OrderStatus } from '../models/restaurant.models';
import { MenuService } from './menu.service';
import { RecipeService } from './recipe.service';
import { WarehouseService } from './warehouse.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>(this.getMockOrders());
  public orders$ = this.ordersSubject.asObservable();
  private nextOrderId = 4;
  private nextItemId = 100;

  constructor(
    private menuService: MenuService,
    private recipeService: RecipeService,
    private warehouseService: WarehouseService
  ) {}

  // Получить все заказы
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  // Получить заказ по ID
  getOrderById(id: number): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.id === id))
    );
  }

  // Получить активный заказ для столика
  getOrderByTableId(tableId: number): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.tableId === tableId && o.status !== OrderStatus.PAID))
    );
  }

  // Создать новый заказ
  createOrder(tableId: number, tableNumber: string, waiterName?: string): Order {
    const newOrder: Order = {
      id: this.nextOrderId++,
      tableId,
      tableNumber,
      items: [],
      status: OrderStatus.NEW,
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      waiterName
    };

    const orders = this.ordersSubject.value;
    this.ordersSubject.next([...orders, newOrder]);
    return newOrder;
  }

  // Добавить позицию в заказ
  addItemToOrder(orderId: number, menuItemId: number, quantity: number = 1, notes?: string): void {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      const menuItem = this.menuService.getMenuItemById(menuItemId);
      
      if (menuItem) {
        // Проверяем, есть ли уже такая позиция
        const existingItemIndex = order.items.findIndex(item => item.menuItemId === menuItemId);
        
        if (existingItemIndex !== -1) {
          // Увеличиваем количество
          order.items[existingItemIndex].quantity += quantity;
          order.items[existingItemIndex].subtotal = 
            order.items[existingItemIndex].quantity * order.items[existingItemIndex].price;
        } else {
          // Добавляем новую позицию
          const newItem: OrderItem = {
            id: this.nextItemId++,
            menuItemId,
            name: menuItem.name,
            quantity,
            price: menuItem.price,
            subtotal: menuItem.price * quantity,
            notes
          };
          order.items.push(newItem);
        }
        
        // Пересчитываем общую сумму
        order.totalAmount = order.items.reduce((sum, item) => sum + item.subtotal, 0);
        order.updatedAt = new Date();
        order.status = OrderStatus.IN_PROGRESS;
        
        this.ordersSubject.next([...orders]);
      }
    }
  }

  // Обновить количество позиции
  updateItemQuantity(orderId: number, itemId: number, quantity: number): void {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      const itemIndex = order.items.findIndex(i => i.id === itemId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Удаляем позицию, если количество 0 или меньше
          order.items.splice(itemIndex, 1);
        } else {
          order.items[itemIndex].quantity = quantity;
          order.items[itemIndex].subtotal = order.items[itemIndex].price * quantity;
        }
        
        // Пересчитываем общую сумму
        order.totalAmount = order.items.reduce((sum, item) => sum + item.subtotal, 0);
        order.updatedAt = new Date();
        
        this.ordersSubject.next([...orders]);
      }
    }
  }

  // Удалить позицию из заказа
  removeItemFromOrder(orderId: number, itemId: number): void {
    this.updateItemQuantity(orderId, itemId, 0);
  }

  // Обновить статус заказа
  updateOrderStatus(orderId: number, status: OrderStatus): void {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      
      // 🔥 АВТОМАТИЧЕСКОЕ СПИСАНИЕ ИНГРЕДИЕНТОВ ПРИ ПОДАЧЕ БЛЮДА
      if (status === OrderStatus.SERVED && order.status !== OrderStatus.SERVED) {
        // Проверяем и списываем ингредиенты для всех блюд в заказе
        let allIngredientsAvailable = true;
        const missingIngredients: string[] = [];

        // Сначала проверяем наличие всех ингредиентов
        for (const orderItem of order.items) {
          const recipe = this.recipeService.getRecipeByMenuItemId(orderItem.menuItemId);
          if (recipe) {
            for (const ingredient of recipe.ingredients) {
              const warehouseItem = this.warehouseService.getItemById(ingredient.warehouseItemId);
              const requiredQuantity = ingredient.quantity * orderItem.quantity;
              
              if (!warehouseItem || warehouseItem.quantity < requiredQuantity) {
                allIngredientsAvailable = false;
                missingIngredients.push(`${ingredient.warehouseItemName} для блюда "${orderItem.name}" (нужно: ${requiredQuantity} ${ingredient.unit}, доступно: ${warehouseItem?.quantity || 0} ${ingredient.unit})`);
              }
            }
          }
        }

        if (!allIngredientsAvailable) {
          // Если недостаточно ингредиентов, показываем ошибку и не меняем статус
          alert(`❌ Невозможно подать блюда!\n\nНедостаточно ингредиентов на складе:\n\n${missingIngredients.join('\n')}\n\nПополните склад перед подачей блюд.`);
          return;
        }

        // Если все ингредиенты есть, списываем их
        for (const orderItem of order.items) {
          const recipe = this.recipeService.getRecipeByMenuItemId(orderItem.menuItemId);
          if (recipe) {
            for (const ingredient of recipe.ingredients) {
              const requiredQuantity = ingredient.quantity * orderItem.quantity;
              this.warehouseService.addOutgoing(
                ingredient.warehouseItemId,
                requiredQuantity,
                `Подача блюда: ${orderItem.name} (Заказ #${orderId}, Столик ${order.tableNumber})`
              );
            }
          }
        }
      }
      
      order.status = status;
      order.updatedAt = new Date();
      this.ordersSubject.next([...orders]);
    }
  }

  // Закрыть заказ (перевести на оплату)
  closeOrder(orderId: number): void {
    this.updateOrderStatus(orderId, OrderStatus.WAITING_PAYMENT);
  }

  // Отметить заказ как оплаченный
  markOrderAsPaid(orderId: number): void {
    this.updateOrderStatus(orderId, OrderStatus.PAID);
  }

  // Мок данные
  private getMockOrders(): Order[] {
    return [
      {
        id: 1,
        tableId: 3,
        tableNumber: '3',
        items: [
          { id: 1, menuItemId: 4, name: 'Том Ям', quantity: 2, price: 450, subtotal: 900 },
          { id: 2, menuItemId: 7, name: 'Стейк Рибай', quantity: 1, price: 1850, subtotal: 1850 },
          { id: 3, menuItemId: 20, name: 'Эспрессо', quantity: 2, price: 150, subtotal: 300 }
        ],
        status: OrderStatus.IN_PROGRESS,
        totalAmount: 3050,
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(),
        waiterName: 'Иван'
      },
      {
        id: 2,
        tableId: 5,
        tableNumber: '5',
        items: [
          { id: 4, menuItemId: 11, name: 'Карбонара', quantity: 1, price: 550, subtotal: 550 },
          { id: 5, menuItemId: 14, name: 'Цезарь с курицей', quantity: 1, price: 450, subtotal: 450 }
        ],
        status: OrderStatus.WAITING_PAYMENT,
        totalAmount: 1000,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 300000),
        waiterName: 'Мария'
      },
      {
        id: 3,
        tableId: 8,
        tableNumber: '8',
        items: [
          { id: 6, menuItemId: 8, name: 'Лосось на гриле', quantity: 2, price: 1350, subtotal: 2700 },
          { id: 7, menuItemId: 15, name: 'Греческий салат', quantity: 2, price: 420, subtotal: 840 },
          { id: 8, menuItemId: 24, name: 'Вино красное (бокал)', quantity: 2, price: 450, subtotal: 900 }
        ],
        status: OrderStatus.IN_PROGRESS,
        totalAmount: 4440,
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(),
        waiterName: 'Петр'
      }
    ];
  }
}


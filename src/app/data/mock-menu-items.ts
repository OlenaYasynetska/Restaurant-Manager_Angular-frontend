import { MenuCategory, MenuItem } from '../core/models/restaurant.models';

export const mockMenuItems: MenuItem[] = [
  // Закуски
  { id: 1, name: 'Брускетта с томатами', category: MenuCategory.APPETIZERS, price: 8, available: true, preparationTime: 5, description: 'Хрустящий хлеб с томатами и базиликом', image: '🍞' },
  { id: 2, name: 'Сырная тарелка', category: MenuCategory.APPETIZERS, price: 12, available: true, preparationTime: 3, description: 'Ассорти из 5 видов сыров', image: '🧀' },
  { id: 3, name: 'Карпаччо из говядины', category: MenuCategory.APPETIZERS, price: 15, available: true, preparationTime: 7, description: 'Тонко нарезанная говядина с рукколой', image: '🥩' },

  // Супы
  { id: 4, name: 'Том Ям', category: MenuCategory.SOUPS, price: 14, available: true, preparationTime: 15, description: 'Острый тайский суп с морепродуктами', image: '🍲' },
  { id: 5, name: 'Крем-суп из грибов', category: MenuCategory.SOUPS, price: 9, available: true, preparationTime: 10, description: 'Нежный суп с белыми грибами', image: '🍄' },
  { id: 6, name: 'Борщ украинский', category: MenuCategory.SOUPS, price: 10, available: true, preparationTime: 12, description: 'Традиционный борщ со сметаной', image: '🥘' },

  // Горячие блюда
  { id: 7, name: 'Стейк Рибай', category: MenuCategory.MAIN_DISHES, price: 28, available: true, preparationTime: 20, description: 'Премиальный стейк из мраморной говядины', image: '🥩' },
  { id: 8, name: 'Лосось на гриле', category: MenuCategory.MAIN_DISHES, price: 22, available: true, preparationTime: 18, description: 'Свежий лосось с овощами', image: '🐟' },
  { id: 9, name: 'Куриное филе в сливочном соусе', category: MenuCategory.MAIN_DISHES, price: 16, available: true, preparationTime: 15, description: 'Нежное филе с грибами и сливками', image: '🍗' },
  { id: 10, name: 'Свиные ребрышки BBQ', category: MenuCategory.MAIN_DISHES, price: 18, available: true, preparationTime: 25, description: 'Сочные ребрышки в соусе барбекю', image: '🍖' },

  // Паста
  { id: 11, name: 'Карбонара', category: MenuCategory.PASTA, price: 13, available: true, preparationTime: 12, description: 'Классическая паста с беконом', image: '🍝' },
  { id: 12, name: 'Болоньезе', category: MenuCategory.PASTA, price: 12, available: true, preparationTime: 12, description: 'Спагетти с мясным соусом', image: '🍝' },
  { id: 13, name: 'Паста с морепродуктами', category: MenuCategory.PASTA, price: 19, available: true, preparationTime: 15, description: 'Микс из морепродуктов', image: '🦐' },

  // Салаты
  { id: 14, name: 'Цезарь с курицей', category: MenuCategory.SALADS, price: 12, available: true, preparationTime: 8, description: 'Классический салат с курицей гриль', image: '🥗' },
  { id: 15, name: 'Греческий салат', category: MenuCategory.SALADS, price: 11, available: true, preparationTime: 7, description: 'Свежие овощи с фетой', image: '🥗' },
  { id: 16, name: 'Салат с тунцом', category: MenuCategory.SALADS, price: 12, available: true, preparationTime: 8, description: 'Микс салатов с тунцом', image: '🥗' },

  // Десерты
  { id: 17, name: 'Тирамису', category: MenuCategory.DESSERTS, price: 9, available: true, preparationTime: 5, description: 'Классический итальянский десерт', image: '🍰' },
  { id: 18, name: 'Чизкейк Нью-Йорк', category: MenuCategory.DESSERTS, price: 9, available: true, preparationTime: 5, description: 'Нежный сырный торт', image: '🍰' },
  { id: 19, name: 'Панна-котта', category: MenuCategory.DESSERTS, price: 8, available: true, preparationTime: 5, description: 'Итальянский десерт с ягодами', image: '🍮' },

  // Напитки
  { id: 20, name: 'Эспрессо', category: MenuCategory.DRINKS, price: 3, available: true, preparationTime: 2, description: 'Крепкий итальянский кофе', image: '☕' },
  { id: 21, name: 'Капучино', category: MenuCategory.DRINKS, price: 4, available: true, preparationTime: 3, description: 'Кофе с молочной пенкой', image: '☕' },
  { id: 22, name: 'Свежевыжатый сок', category: MenuCategory.DRINKS, price: 5, available: true, preparationTime: 5, description: 'Апельсиновый или яблочный', image: '🥤' },
  { id: 23, name: 'Лимонад домашний', category: MenuCategory.DRINKS, price: 4, available: true, preparationTime: 3, description: 'Освежающий домашний лимонад', image: '🍋' },

  // Алкоголь
  { id: 24, name: 'Вино красное (бокал)', category: MenuCategory.ALCOHOL, price: 7, available: true, preparationTime: 2, description: 'Красное сухое вино', image: '🍷' },
  { id: 25, name: 'Вино белое (бокал)', category: MenuCategory.ALCOHOL, price: 7, available: true, preparationTime: 2, description: 'Белое сухое вино', image: '🍷' },
  { id: 26, name: 'Пиво разливное', category: MenuCategory.ALCOHOL, price: 5, available: true, preparationTime: 2, description: 'Светлое пиво 0.5л', image: '🍺' },
];


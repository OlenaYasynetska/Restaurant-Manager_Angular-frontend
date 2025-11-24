import { MenuCategory, MenuItem } from '../core/models/restaurant.models';

export const mockMenuItems: MenuItem[] = [
  // Закуски
  {
    id: 1,
    name: 'Брускетта с томатами',
    category: MenuCategory.APPETIZERS,
    price: 8,
    available: true,
    preparationTime: 5,
    description: 'Хрустящий хлеб с томатами и базиликом',
    image: '🍞',
    translations: {
      name: { ru: 'Брускетта с томатами', en: 'Tomato Bruschetta', de: 'Tomaten-Bruschetta' },
      description: {
        ru: 'Хрустящий хлеб с томатами и базиликом',
        en: 'Crispy bread with tomatoes and basil',
        de: 'Knuspriges Brot mit Tomaten und Basilikum'
      }
    }
  },
  {
    id: 2,
    name: 'Сырная тарелка',
    category: MenuCategory.APPETIZERS,
    price: 12,
    available: true,
    preparationTime: 3,
    description: 'Ассорти из 5 видов сыров',
    image: '🧀',
    translations: {
      name: { ru: 'Сырная тарелка', en: 'Cheese Platter', de: 'Käseplatte' },
      description: {
        ru: 'Ассорти из 5 видов сыров',
        en: 'Assortment of five cheeses',
        de: 'Auswahl aus fünf Käsesorten'
      }
    }
  },
  {
    id: 3,
    name: 'Карпаччо из говядины',
    category: MenuCategory.APPETIZERS,
    price: 15,
    available: true,
    preparationTime: 7,
    description: 'Тонко нарезанная говядина с рукколой',
    image: '🥩',
    translations: {
      name: { ru: 'Карпаччо из говядины', en: 'Beef Carpaccio', de: 'Rindercarpaccio' },
      description: {
        ru: 'Тонко нарезанная говядина с рукколой',
        en: 'Thinly sliced beef with arugula',
        de: 'Dünn geschnittenes Rindfleisch mit Rucola'
      }
    }
  },

  // Супы
  {
    id: 4,
    name: 'Том Ям',
    category: MenuCategory.SOUPS,
    price: 14,
    available: true,
    preparationTime: 15,
    description: 'Острый тайский суп с морепродуктами',
    image: '🍲',
    translations: {
      name: { ru: 'Том Ям', en: 'Tom Yum', de: 'Tom Yam' },
      description: {
        ru: 'Острый тайский суп с морепродуктами',
        en: 'Spicy Thai soup with seafood',
        de: 'Scharfe thailändische Suppe mit Meeresfrüchten'
      }
    }
  },
  {
    id: 5,
    name: 'Крем-суп из грибов',
    category: MenuCategory.SOUPS,
    price: 9,
    available: true,
    preparationTime: 10,
    description: 'Нежный суп с белыми грибами',
    image: '🍄',
    translations: {
      name: { ru: 'Крем-суп из грибов', en: 'Cream of Mushroom Soup', de: 'Cremige Pilzsuppe' },
      description: {
        ru: 'Нежный суп с белыми грибами',
        en: 'Delicate soup with porcini mushrooms',
        de: 'Feine Suppe mit Steinpilzen'
      }
    }
  },
  {
    id: 6,
    name: 'Борщ украинский',
    category: MenuCategory.SOUPS,
    price: 10,
    available: true,
    preparationTime: 12,
    description: 'Традиционный борщ со сметаной',
    image: '🥘',
    translations: {
      name: { ru: 'Борщ украинский', en: 'Ukrainian Borscht', de: 'Ukrainischer Borschtsch' },
      description: {
        ru: 'Традиционный борщ со сметаной',
        en: 'Traditional beet soup with sour cream',
        de: 'Traditionelle Rote-Bete-Suppe mit Sauerrahm'
      }
    }
  },

  // Горячие блюда
  {
    id: 7,
    name: 'Стейк Рибай',
    category: MenuCategory.MAIN_DISHES,
    price: 28,
    available: true,
    preparationTime: 20,
    description: 'Премиальный стейк из мраморной говядины',
    image: '🥩',
    translations: {
      name: { ru: 'Стейк Рибай', en: 'Ribeye Steak', de: 'Ribeye-Steak' },
      description: {
        ru: 'Премиальный стейк из мраморной говядины',
        en: 'Premium marbled beef steak',
        de: 'Premium-Steak aus marmoriertem Rindfleisch'
      }
    }
  },
  {
    id: 8,
    name: 'Лосось на гриле',
    category: MenuCategory.MAIN_DISHES,
    price: 22,
    available: true,
    preparationTime: 18,
    description: 'Свежий лосось с овощами',
    image: '🐟',
    translations: {
      name: { ru: 'Лосось на гриле', en: 'Grilled Salmon', de: 'Gegrillter Lachs' },
      description: {
        ru: 'Свежий лосось с овощами',
        en: 'Fresh salmon with vegetables',
        de: 'Frischer Lachs mit Gemüse'
      }
    }
  },
  {
    id: 9,
    name: 'Куриное филе в сливочном соусе',
    category: MenuCategory.MAIN_DISHES,
    price: 16,
    available: true,
    preparationTime: 15,
    description: 'Нежное филе с грибами и сливками',
    image: '🍗',
    translations: {
      name: {
        ru: 'Куриное филе в сливочном соусе',
        en: 'Chicken Fillet in Cream Sauce',
        de: 'Hähnchenfilet in Sahnesoße'
      },
      description: {
        ru: 'Нежное филе с грибами и сливками',
        en: 'Tender fillet with mushrooms and cream',
        de: 'Zartes Filet mit Pilzen und Sahne'
      }
    }
  },
  {
    id: 10,
    name: 'Свиные ребрышки BBQ',
    category: MenuCategory.MAIN_DISHES,
    price: 18,
    available: true,
    preparationTime: 25,
    description: 'Сочные ребрышки в соусе барбекю',
    image: '🍖',
    translations: {
      name: { ru: 'Свиные ребрышки BBQ', en: 'BBQ Pork Ribs', de: 'BBQ-Schweinerippchen' },
      description: {
        ru: 'Сочные ребрышки в соусе барбекю',
        en: 'Juicy ribs in barbecue sauce',
        de: 'Saftige Rippchen in Barbecuesoße'
      }
    }
  },

  // Паста
  {
    id: 11,
    name: 'Карбонара',
    category: MenuCategory.PASTA,
    price: 13,
    available: true,
    preparationTime: 12,
    description: 'Классическая паста с беконом',
    image: '🍝',
    translations: {
      name: { ru: 'Карбонара', en: 'Carbonara', de: 'Carbonara' },
      description: {
        ru: 'Классическая паста с беконом',
        en: 'Classic pasta with bacon',
        de: 'Klassische Pasta mit Speck'
      }
    }
  },
  {
    id: 12,
    name: 'Болоньезе',
    category: MenuCategory.PASTA,
    price: 12,
    available: true,
    preparationTime: 12,
    description: 'Спагетти с мясным соусом',
    image: '🍝',
    translations: {
      name: { ru: 'Болоньезе', en: 'Bolognese', de: 'Bolognese' },
      description: {
        ru: 'Спагетти с мясным соусом',
        en: 'Spaghetti with meat sauce',
        de: 'Spaghetti mit Fleischsoße'
      }
    }
  },
  {
    id: 13,
    name: 'Паста с морепродуктами',
    category: MenuCategory.PASTA,
    price: 19,
    available: true,
    preparationTime: 15,
    description: 'Микс из морепродуктов',
    image: '🦐',
    translations: {
      name: { ru: 'Паста с морепродуктами', en: 'Seafood Pasta', de: 'Pasta mit Meeresfrüchten' },
      description: {
        ru: 'Микс из морепродуктов',
        en: 'Mix of seafood',
        de: 'Mischung aus Meeresfrüchten'
      }
    }
  },

  // Салаты
  {
    id: 14,
    name: 'Цезарь с курицей',
    category: MenuCategory.SALADS,
    price: 12,
    available: true,
    preparationTime: 8,
    description: 'Классический салат с курицей гриль',
    image: '🥗',
    translations: {
      name: { ru: 'Цезарь с курицей', en: 'Chicken Caesar Salad', de: 'Caesar-Salat mit Hähnchen' },
      description: {
        ru: 'Классический салат с курицей гриль',
        en: 'Classic salad with grilled chicken',
        de: 'Klassischer Salat mit gegrilltem Hähnchen'
      }
    }
  },
  {
    id: 15,
    name: 'Греческий салат',
    category: MenuCategory.SALADS,
    price: 11,
    available: true,
    preparationTime: 7,
    description: 'Свежие овощи с фетой',
    image: '🥗',
    translations: {
      name: { ru: 'Греческий салат', en: 'Greek Salad', de: 'Griechischer Salat' },
      description: {
        ru: 'Свежие овощи с фетой',
        en: 'Fresh vegetables with feta',
        de: 'Frisches Gemüse mit Feta'
      }
    }
  },
  {
    id: 16,
    name: 'Салат с тунцом',
    category: MenuCategory.SALADS,
    price: 12,
    available: true,
    preparationTime: 8,
    description: 'Микс салатов с тунцом',
    image: '🥗',
    translations: {
      name: { ru: 'Салат с тунцом', en: 'Tuna Salad', de: 'Thunfischsalat' },
      description: {
        ru: 'Микс салатов с тунцом',
        en: 'Salad mix with tuna',
        de: 'Salatmischung mit Thunfisch'
      }
    }
  },

  // Десерты
  {
    id: 17,
    name: 'Тирамису',
    category: MenuCategory.DESSERTS,
    price: 9,
    available: true,
    preparationTime: 5,
    description: 'Классический итальянский десерт',
    image: '🍰',
    translations: {
      name: { ru: 'Тирамису', en: 'Tiramisu', de: 'Tiramisu' },
      description: {
        ru: 'Классический итальянский десерт',
        en: 'Classic Italian dessert',
        de: 'Klassisches italienisches Dessert'
      }
    }
  },
  {
    id: 18,
    name: 'Чизкейк Нью-Йорк',
    category: MenuCategory.DESSERTS,
    price: 9,
    available: true,
    preparationTime: 5,
    description: 'Нежный сырный торт',
    image: '🍰',
    translations: {
      name: { ru: 'Чизкейк Нью-Йорк', en: 'New York Cheesecake', de: 'New-York-Käsekuchen' },
      description: {
        ru: 'Нежный сырный торт',
        en: 'Silky baked cheesecake',
        de: 'Cremiger gebackener Käsekuchen'
      }
    }
  },
  {
    id: 19,
    name: 'Панна-котта',
    category: MenuCategory.DESSERTS,
    price: 8,
    available: true,
    preparationTime: 5,
    description: 'Итальянский десерт с ягодами',
    image: '🍮',
    translations: {
      name: { ru: 'Панна-котта', en: 'Panna Cotta', de: 'Panna Cotta' },
      description: {
        ru: 'Итальянский десерт с ягодами',
        en: 'Italian dessert with berries',
        de: 'Italienisches Dessert mit Beeren'
      }
    }
  },

  // Напитки
  {
    id: 20,
    name: 'Эспрессо',
    category: MenuCategory.DRINKS,
    price: 3,
    available: true,
    preparationTime: 2,
    description: 'Крепкий итальянский кофе',
    image: '☕',
    translations: {
      name: { ru: 'Эспрессо', en: 'Espresso', de: 'Espresso' },
      description: {
        ru: 'Крепкий итальянский кофе',
        en: 'Strong Italian coffee',
        de: 'Starker italienischer Kaffee'
      }
    }
  },
  {
    id: 21,
    name: 'Капучино',
    category: MenuCategory.DRINKS,
    price: 4,
    available: true,
    preparationTime: 3,
    description: 'Кофе с молочной пенкой',
    image: '☕',
    translations: {
      name: { ru: 'Капучино', en: 'Cappuccino', de: 'Cappuccino' },
      description: {
        ru: 'Кофе с молочной пенкой',
        en: 'Coffee with milk foam',
        de: 'Kaffee mit Milchschaum'
      }
    }
  },
  {
    id: 22,
    name: 'Свежевыжатый сок',
    category: MenuCategory.DRINKS,
    price: 5,
    available: true,
    preparationTime: 5,
    description: 'Апельсиновый или яблочный',
    image: '🥤',
    translations: {
      name: { ru: 'Свежевыжатый сок', en: 'Freshly Squeezed Juice', de: 'Frisch gepresster Saft' },
      description: {
        ru: 'Апельсиновый или яблочный',
        en: 'Orange or apple',
        de: 'Orange oder Apfel'
      }
    }
  },
  {
    id: 23,
    name: 'Лимонад домашний',
    category: MenuCategory.DRINKS,
    price: 4,
    available: true,
    preparationTime: 3,
    description: 'Освежающий домашний лимонад',
    image: '🍋',
    translations: {
      name: { ru: 'Лимонад домашний', en: 'Homemade Lemonade', de: 'Hausgemachte Limonade' },
      description: {
        ru: 'Освежающий домашний лимонад',
        en: 'Refreshing homemade lemonade',
        de: 'Erfrischende hausgemachte Limonade'
      }
    }
  },

  // Алкоголь
  {
    id: 24,
    name: 'Вино красное (бокал)',
    category: MenuCategory.ALCOHOL,
    price: 7,
    available: true,
    preparationTime: 2,
    description: 'Красное сухое вино',
    image: '🍷',
    translations: {
      name: { ru: 'Вино красное (бокал)', en: 'Red Wine (glass)', de: 'Rotwein (Glas)' },
      description: {
        ru: 'Красное сухое вино',
        en: 'Dry red wine',
        de: 'Trockener Rotwein'
      }
    }
  },
  {
    id: 25,
    name: 'Вино белое (бокал)',
    category: MenuCategory.ALCOHOL,
    price: 7,
    available: true,
    preparationTime: 2,
    description: 'Белое сухое вино',
    image: '🍷',
    translations: {
      name: { ru: 'Вино белое (бокал)', en: 'White Wine (glass)', de: 'Weißwein (Glas)' },
      description: {
        ru: 'Белое сухое вино',
        en: 'Dry white wine',
        de: 'Trockener Weißwein'
      }
    }
  },
  {
    id: 26,
    name: 'Пиво разливное',
    category: MenuCategory.ALCOHOL,
    price: 5,
    available: true,
    preparationTime: 2,
    description: 'Светлое пиво 0.5л',
    image: '🍺',
    translations: {
      name: { ru: 'Пиво разливное', en: 'Draft Beer', de: 'Frisches Fassbier' },
      description: {
        ru: 'Светлое пиво 0.5л',
        en: 'Light beer 0.5 L',
        de: 'Helles Bier 0,5 l'
      }
    }
  },
];


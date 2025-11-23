import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe, RecipeIngredient, Unit } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<Recipe[]>(this.getMockRecipes());
  recipes$ = this.recipesSubject.asObservable();
  
  private nextId = 27;

  constructor() {}

  getRecipes(): Observable<Recipe[]> {
    return this.recipes$;
  }

  getRecipeByMenuItemId(menuItemId: number): Recipe | undefined {
    return this.recipesSubject.value.find(r => r.menuItemId === menuItemId);
  }

  addRecipe(data: Partial<Recipe>): Recipe {
    const newRecipe: Recipe = {
      id: this.nextId++,
      menuItemId: data.menuItemId!,
      menuItemName: data.menuItemName!,
      ingredients: data.ingredients || [],
      description: data.description
    };

    const current = this.recipesSubject.value;
    this.recipesSubject.next([...current, newRecipe]);
    return newRecipe;
  }

  updateRecipe(id: number, data: Partial<Recipe>): void {
    const current = this.recipesSubject.value;
    const index = current.findIndex(r => r.id === id);
    
    if (index !== -1) {
      current[index] = { ...current[index], ...data, id };
      this.recipesSubject.next([...current]);
    }
  }

  deleteRecipe(id: number): void {
    const current = this.recipesSubject.value;
    this.recipesSubject.next(current.filter(r => r.id !== id));
  }

  // Проверить доступность всех ингредиентов для блюда
  checkIngredientsAvailability(menuItemId: number, warehouseItems: any[]): boolean {
    const recipe = this.getRecipeByMenuItemId(menuItemId);
    if (!recipe) return true; // Если нет рецепта, считаем что доступно

    return recipe.ingredients.every(ingredient => {
      const warehouseItem = warehouseItems.find(w => w.id === ingredient.warehouseItemId);
      if (!warehouseItem) return false;
      return warehouseItem.quantity >= ingredient.quantity;
    });
  }

  private getMockRecipes(): Recipe[] {
    return [
      {
        id: 1,
        menuItemId: 1,
        menuItemName: 'Брускетта с томатами',
        ingredients: [
          { warehouseItemId: 11, warehouseItemName: 'Багет', quantity: 0.2, unit: Unit.PCS },
          { warehouseItemId: 4, warehouseItemName: 'Томаты', quantity: 0.12, unit: Unit.KG },
          { warehouseItemId: 12, warehouseItemName: 'Базилик свежий', quantity: 0.01, unit: Unit.KG },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.005, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L }
        ],
        description: 'Подрумянить багет, натереть чесноком, выложить томаты с базиликом и сбрызнуть маслом'
      },
      {
        id: 2,
        menuItemId: 2,
        menuItemName: 'Сырная тарелка',
        ingredients: [
          { warehouseItemId: 6, warehouseItemName: 'Сыр Пармезан', quantity: 0.04, unit: Unit.KG },
          { warehouseItemId: 32, warehouseItemName: 'Сыр фета', quantity: 0.04, unit: Unit.KG },
          { warehouseItemId: 30, warehouseItemName: 'Оливки', quantity: 0.05, unit: Unit.KG }
        ],
        description: 'Сервировать сыры с оливками и подать с хрустящим хлебом'
      },
      {
        id: 3,
        menuItemId: 3,
        menuItemName: 'Карпаччо из говядины',
        ingredients: [
          { warehouseItemId: 1, warehouseItemName: 'Говядина рибай', quantity: 0.15, unit: Unit.KG },
          { warehouseItemId: 14, warehouseItemName: 'Рукола', quantity: 0.03, unit: Unit.KG },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.25, unit: Unit.PCS },
          { warehouseItemId: 30, warehouseItemName: 'Оливки', quantity: 0.01, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.005, unit: Unit.L }
        ],
        description: 'Тонко нарезать говядину, выложить на руколу, сбрызнуть лимоном и маслом'
      },
      {
        id: 4,
        menuItemId: 4,
        menuItemName: 'Том Ям',
        ingredients: [
          { warehouseItemId: 16, warehouseItemName: 'Креветки', quantity: 0.18, unit: Unit.KG },
          { warehouseItemId: 18, warehouseItemName: 'Лайм', quantity: 0.5, unit: Unit.PCS },
          { warehouseItemId: 17, warehouseItemName: 'Кокосовое молоко', quantity: 0.15, unit: Unit.L },
          { warehouseItemId: 19, warehouseItemName: 'Грибы', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L }
        ],
        description: 'Обжарить креветки с грибами и залить бульоном на кокосовом молоке с лаймом'
      },
      {
        id: 5,
        menuItemId: 5,
        menuItemName: 'Крем-суп из грибов',
        ingredients: [
          { warehouseItemId: 19, warehouseItemName: 'Грибы', quantity: 0.2, unit: Unit.KG },
          { warehouseItemId: 20, warehouseItemName: 'Сливки 33%', quantity: 0.15, unit: Unit.L },
          { warehouseItemId: 23, warehouseItemName: 'Сметана', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.01, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L }
        ],
        description: 'Обжарить грибы с чесноком, залить сливками, прогреть и добавить сметану перед подачей'
      },
      {
        id: 6,
        menuItemId: 6,
        menuItemName: 'Борщ украинский',
        ingredients: [
          { warehouseItemId: 21, warehouseItemName: 'Свекла', quantity: 0.18, unit: Unit.KG },
          { warehouseItemId: 22, warehouseItemName: 'Капуста', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 5, warehouseItemName: 'Картофель', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 23, warehouseItemName: 'Сметана', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.01, unit: Unit.KG }
        ],
        description: 'Тушить свеклу, капусту и картофель, подавать со сметаной и чесночным маслом'
      },
      {
        id: 7,
        menuItemId: 7,
        menuItemName: 'Стейк Рибай',
        ingredients: [
          { warehouseItemId: 1, warehouseItemName: 'Говядина рибай', quantity: 0.35, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.02, unit: Unit.L },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.01, unit: Unit.KG },
          { warehouseItemId: 5, warehouseItemName: 'Картофель', quantity: 0.2, unit: Unit.KG }
        ],
        description: 'Обжарить стейк с чесноком, подать с картофелем и маслом'
      },
      {
        id: 8,
        menuItemId: 8,
        menuItemName: 'Лосось на гриле',
        ingredients: [
          { warehouseItemId: 3, warehouseItemName: 'Лосось свежий', quantity: 0.25, unit: Unit.KG },
          { warehouseItemId: 4, warehouseItemName: 'Томаты', quantity: 0.07, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.25, unit: Unit.PCS }
        ],
        description: 'Жарить на гриле, подавать с томатами и лимонным маслом'
      },
      {
        id: 9,
        menuItemId: 9,
        menuItemName: 'Куриное филе в сливочном соусе',
        ingredients: [
          { warehouseItemId: 2, warehouseItemName: 'Куриное филе', quantity: 0.2, unit: Unit.KG },
          { warehouseItemId: 20, warehouseItemName: 'Сливки 33%', quantity: 0.2, unit: Unit.L },
          { warehouseItemId: 19, warehouseItemName: 'Грибы', quantity: 0.15, unit: Unit.KG },
          { warehouseItemId: 24, warehouseItemName: 'Бекон', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 23, warehouseItemName: 'Сметана', quantity: 0.05, unit: Unit.KG }
        ],
        description: 'Протушить филе с грибами, сливками и беконом до кремовой текстуры'
      },
      {
        id: 10,
        menuItemId: 10,
        menuItemName: 'Свиные ребрышки BBQ',
        ingredients: [
          { warehouseItemId: 26, warehouseItemName: 'Свиные ребрышки', quantity: 0.5, unit: Unit.KG },
          { warehouseItemId: 27, warehouseItemName: 'Соус барбекю', quantity: 0.06, unit: Unit.L },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.2, unit: Unit.PCS }
        ],
        description: 'Запечь ребрышки, смазать соусом и подать с лимоном'
      },
      {
        id: 11,
        menuItemId: 11,
        menuItemName: 'Карбонара',
        ingredients: [
          { warehouseItemId: 8, warehouseItemName: 'Спагетти', quantity: 0.1, unit: Unit.PACK },
          { warehouseItemId: 24, warehouseItemName: 'Бекон', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 6, warehouseItemName: 'Сыр Пармезан', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 25, warehouseItemName: 'Яйца', quantity: 2, unit: Unit.PCS }
        ],
        description: 'Смешать спагетти с беконом, яйцами и пармезаном'
      },
      {
        id: 12,
        menuItemId: 12,
        menuItemName: 'Болоньезе',
        ingredients: [
          { warehouseItemId: 8, warehouseItemName: 'Спагетти', quantity: 0.1, unit: Unit.PACK },
          { warehouseItemId: 29, warehouseItemName: 'Фарш говяжий', quantity: 0.15, unit: Unit.KG },
          { warehouseItemId: 28, warehouseItemName: 'Томатный соус', quantity: 0.08, unit: Unit.L },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.01, unit: Unit.KG }
        ],
        description: 'Тушить фарш с томатным соусом и чесноком, подавать со спагетти'
      },
      {
        id: 13,
        menuItemId: 13,
        menuItemName: 'Паста с морепродуктами',
        ingredients: [
          { warehouseItemId: 8, warehouseItemName: 'Спагетти', quantity: 0.1, unit: Unit.PACK },
          { warehouseItemId: 16, warehouseItemName: 'Креветки', quantity: 0.12, unit: Unit.KG },
          { warehouseItemId: 34, warehouseItemName: 'Тунец консервированный', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L }
        ],
        description: 'Обжарить морепродукты и смешать с пастой и маслом'
      },
      {
        id: 14,
        menuItemId: 14,
        menuItemName: 'Цезарь с курицей',
        ingredients: [
          { warehouseItemId: 33, warehouseItemName: 'Салат ромэн', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 2, warehouseItemName: 'Куриное филе', quantity: 0.15, unit: Unit.KG },
          { warehouseItemId: 6, warehouseItemName: 'Сыр Пармезан', quantity: 0.03, unit: Unit.KG },
          { warehouseItemId: 25, warehouseItemName: 'Яйца', quantity: 1, unit: Unit.PCS },
          { warehouseItemId: 13, warehouseItemName: 'Чеснок', quantity: 0.005, unit: Unit.KG }
        ],
        description: 'Смешать курицу и ромэн с пармезаном и яйцом, добавить чесночную заправку'
      },
      {
        id: 15,
        menuItemId: 15,
        menuItemName: 'Греческий салат',
        ingredients: [
          { warehouseItemId: 4, warehouseItemName: 'Томаты', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 31, warehouseItemName: 'Огурцы', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 32, warehouseItemName: 'Сыр фета', quantity: 0.06, unit: Unit.KG },
          { warehouseItemId: 30, warehouseItemName: 'Оливки', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 12, warehouseItemName: 'Базилик свежий', quantity: 0.01, unit: Unit.KG }
        ],
        description: 'Смешать овощи, фету и оливки, заправить базиликом и маслом'
      },
      {
        id: 16,
        menuItemId: 16,
        menuItemName: 'Салат с тунцом',
        ingredients: [
          { warehouseItemId: 35, warehouseItemName: 'Микс зелени', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 34, warehouseItemName: 'Тунец консервированный', quantity: 0.1, unit: Unit.KG },
          { warehouseItemId: 31, warehouseItemName: 'Огурцы', quantity: 0.06, unit: Unit.KG },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.2, unit: Unit.PCS }
        ],
        description: 'Соединить зелень, тунца и огурцы, заправить лимонным соком'
      },
      {
        id: 17,
        menuItemId: 17,
        menuItemName: 'Тирамису',
        ingredients: [
          { warehouseItemId: 36, warehouseItemName: 'Маскарпоне', quantity: 0.25, unit: Unit.KG },
          { warehouseItemId: 37, warehouseItemName: 'Кофейные зерна', quantity: 0.02, unit: Unit.KG },
          { warehouseItemId: 40, warehouseItemName: 'Савоярди', quantity: 0.1, unit: Unit.PACK },
          { warehouseItemId: 38, warehouseItemName: 'Какао-порошок', quantity: 0.01, unit: Unit.KG },
          { warehouseItemId: 39, warehouseItemName: 'Сахар', quantity: 0.05, unit: Unit.KG }
        ],
        description: 'Сложить савоярди с маскарпоне, пропитать кофе и посыпать какао'
      },
      {
        id: 18,
        menuItemId: 18,
        menuItemName: 'Чизкейк Нью-Йорк',
        ingredients: [
          { warehouseItemId: 36, warehouseItemName: 'Маскарпоне', quantity: 0.3, unit: Unit.KG },
          { warehouseItemId: 39, warehouseItemName: 'Сахар', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 25, warehouseItemName: 'Яйца', quantity: 2, unit: Unit.PCS },
          { warehouseItemId: 40, warehouseItemName: 'Савоярди', quantity: 0.08, unit: Unit.PACK }
        ],
        description: 'Соединить маскарпоне с яйцами и сахаром, выложить на печенье и запечь'
      },
      {
        id: 19,
        menuItemId: 19,
        menuItemName: 'Панна-котта',
        ingredients: [
          { warehouseItemId: 20, warehouseItemName: 'Сливки 33%', quantity: 0.2, unit: Unit.L },
          { warehouseItemId: 46, warehouseItemName: 'Желатин', quantity: 0.3, unit: Unit.PACK },
          { warehouseItemId: 39, warehouseItemName: 'Сахар', quantity: 0.04, unit: Unit.KG },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.15, unit: Unit.PCS }
        ],
        description: 'Прогреть сливки с сахаром и лимоном, растворить желатин и охладить'
      },
      {
        id: 20,
        menuItemId: 20,
        menuItemName: 'Эспрессо',
        ingredients: [
          { warehouseItemId: 37, warehouseItemName: 'Кофейные зерна', quantity: 0.02, unit: Unit.KG }
        ],
        description: 'Сварить концентрат из кофейных зерен'
      },
      {
        id: 21,
        menuItemId: 21,
        menuItemName: 'Капучино',
        ingredients: [
          { warehouseItemId: 37, warehouseItemName: 'Кофейные зерна', quantity: 0.015, unit: Unit.KG },
          { warehouseItemId: 7, warehouseItemName: 'Молоко 3.2%', quantity: 0.2, unit: Unit.L }
        ],
        description: 'Добавить к эспрессо горячее молоко с пенкой'
      },
      {
        id: 22,
        menuItemId: 22,
        menuItemName: 'Свежевыжатый сок',
        ingredients: [
          { warehouseItemId: 41, warehouseItemName: 'Апельсиновый сок', quantity: 0.2, unit: Unit.L },
          { warehouseItemId: 42, warehouseItemName: 'Яблочный сок', quantity: 0.2, unit: Unit.L },
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.1, unit: Unit.PCS }
        ],
        description: 'Смешать апельсиновый и яблочный сок с лимоном'
      },
      {
        id: 23,
        menuItemId: 23,
        menuItemName: 'Лимонад домашний',
        ingredients: [
          { warehouseItemId: 15, warehouseItemName: 'Лимон', quantity: 0.5, unit: Unit.PCS },
          { warehouseItemId: 39, warehouseItemName: 'Сахар', quantity: 0.08, unit: Unit.KG },
          { warehouseItemId: 43, warehouseItemName: 'Газированная вода', quantity: 0.2, unit: Unit.L }
        ],
        description: 'Смешать лимонный сок с сахаром и газировкой'
      },
      {
        id: 24,
        menuItemId: 24,
        menuItemName: 'Вино красное (бокал)',
        ingredients: [
          { warehouseItemId: 10, warehouseItemName: 'Вино красное', quantity: 1, unit: Unit.PCS }
        ],
        description: 'Подается охлажденным бокалом'
      },
      {
        id: 25,
        menuItemId: 25,
        menuItemName: 'Вино белое (бокал)',
        ingredients: [
          { warehouseItemId: 44, warehouseItemName: 'Вино белое', quantity: 1, unit: Unit.PCS }
        ],
        description: 'Подается охлажденным бокалом'
      },
      {
        id: 26,
        menuItemId: 26,
        menuItemName: 'Пиво разливное',
        ingredients: [
          { warehouseItemId: 45, warehouseItemName: 'Светлое пиво', quantity: 0.5, unit: Unit.L }
        ],
        description: 'Подается охлажденным бокалом'
      }
    ];
  }
}


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe, RecipeIngredient, Unit } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<Recipe[]>(this.getMockRecipes());
  recipes$ = this.recipesSubject.asObservable();
  
  private nextId = 4;

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
      // Стейк Рибай (id: 7 в меню)
      {
        id: 1,
        menuItemId: 7,
        menuItemName: 'Стейк Рибай',
        ingredients: [
          { warehouseItemId: 1, warehouseItemName: 'Говядина рибай', quantity: 0.3, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.02, unit: Unit.L },
          { warehouseItemId: 5, warehouseItemName: 'Картофель', quantity: 0.2, unit: Unit.KG }
        ],
        description: 'Жарить на сильном огне по 3-4 минуты с каждой стороны'
      },
      // Карбонара (id: 11 в меню)
      {
        id: 2,
        menuItemId: 11,
        menuItemName: 'Карбонара',
        ingredients: [
          { warehouseItemId: 8, warehouseItemName: 'Спагетти', quantity: 0.1, unit: Unit.PACK },
          { warehouseItemId: 6, warehouseItemName: 'Сыр Пармезан', quantity: 0.05, unit: Unit.KG },
          { warehouseItemId: 7, warehouseItemName: 'Молоко 3.2%', quantity: 0.1, unit: Unit.L }
        ],
        description: 'Отварить пасту, смешать с соусом'
      },
      // Лосось на гриле (id: 8 в меню)
      {
        id: 3,
        menuItemId: 8,
        menuItemName: 'Лосось на гриле',
        ingredients: [
          { warehouseItemId: 3, warehouseItemName: 'Лосось свежий', quantity: 0.25, unit: Unit.KG },
          { warehouseItemId: 9, warehouseItemName: 'Оливковое масло', quantity: 0.01, unit: Unit.L },
          { warehouseItemId: 4, warehouseItemName: 'Томаты', quantity: 0.1, unit: Unit.KG }
        ],
        description: 'Жарить на гриле 4-5 минут с каждой стороны'
      }
    ];
  }
}


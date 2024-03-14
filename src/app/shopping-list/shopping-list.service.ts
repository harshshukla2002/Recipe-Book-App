import { Ingredient } from '../Shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  newIncredient = new Subject<Ingredient[]>();
  editing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 10),
    new Ingredient('Tomato', 8),
  ];

  getShoppingList() {
    return this.ingredients.slice();
  }

  getIngredientWithIndex(index: number) {
    return this.ingredients[index];
  }

  addIncredient(incredientItem: Ingredient) {
    this.ingredients.push(incredientItem);
    this.newIncredient.next(this.ingredients.slice());
  }

  addIngredientFromShoppingList(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.newIncredient.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newUpdatedIngredient: Ingredient) {
    this.ingredients[index] = newUpdatedIngredient;
    this.newIncredient.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.newIncredient.next(this.ingredients.slice());
  }
}

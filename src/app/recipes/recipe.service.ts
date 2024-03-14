import { Injectable } from '@angular/core';
import { Recipes } from './recipe.model';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { ApisService } from '../Shared/apis.service';

@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipes[]>();
  postRecipeSub = new Subject<boolean>();
  private postRecipe: boolean = false;
  private recipes: Recipes[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private apisService: ApisService
  ) {}

  getRecipes() {
    if (this.recipes.length === 0 || this.postRecipe)
      this.apisService.fetchRecipes().subscribe((recipesData) => {
        this.recipes = recipesData;
        this.recipeChanged.next(this.recipes.slice());
        this.postRecipe = false;
        this.postRecipeSub.next(this.postRecipe);
      });

    return this.recipes?.slice();
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredientFromShoppingList(ingredients);
  }

  getRecipeWithIndex(index: number) {
    return this.recipes[index];
  }

  onAddRecipe(newRecipe: Recipes) {
    this.apisService.postRecipes(newRecipe).subscribe((response) => {
      this.postRecipe = true;
      this.postRecipeSub.next(this.postRecipe);
      this.getRecipes();
    });
  }

  onUpdateRecipe(newRecipe: Recipes, index: number) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}

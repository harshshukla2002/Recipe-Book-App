export class Ingredient {
  public recipeIngredientName: string;
  public recipeIngredientAmount: number;

  constructor(ingredientName: string, ingredientAmount: number) {
    this.recipeIngredientName = ingredientName;
    this.recipeIngredientAmount = ingredientAmount;
  }
}

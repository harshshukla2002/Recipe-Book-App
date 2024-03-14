import { Ingredient } from '../Shared/ingredient.model';

export class Recipes {
  public name: string = '';
  public description: string = '';
  public imageUrl: string = '';
  public ingredients: Ingredient[];
  public id?: string;

  constructor(
    name: string,
    description: string,
    imageUrl: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.ingredients = ingredients;
  }
}

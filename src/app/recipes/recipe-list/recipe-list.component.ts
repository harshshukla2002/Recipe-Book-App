import { Component, OnInit } from '@angular/core';
import { Recipes } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipes[];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipeChanged.subscribe((recipe: Recipes[]) => {
      this.recipes = recipe;
    });
    this.recipes = this.recipeService.getRecipes();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipes } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  index: number;
  edit: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.index = params['index'];
      this.edit = params['index'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName: string = '';
    let recipeImageUrl: string = '';
    let recipeDescription: string = '';
    let receipeIngredients = new FormArray([]);

    if (this.edit) {
      const recipe = this.recipeService.getRecipeWithIndex(this.index);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImageUrl = recipe.imageUrl;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          receipeIngredients.push(
            new FormGroup({
              recipeIngredientName: new FormControl(
                ingredient.recipeIngredientName,
                Validators.required
              ),
              recipeIngredientAmount: new FormControl(
                ingredient.recipeIngredientAmount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]
              ),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      recipeName: new FormControl(recipeName, Validators.required),
      recipeImageUrl: new FormControl(recipeImageUrl, Validators.required),
      recipeDescription: new FormControl(
        recipeDescription,
        Validators.required
      ),
      recipeIngredient: receipeIngredients,
    });
  }

  onSubmit() {
    const { recipeName, recipeDescription, recipeImageUrl, recipeIngredient } =
      this.recipeForm.value;
    const newRecipe = new Recipes(
      recipeName,
      recipeDescription,
      recipeImageUrl,
      recipeIngredient
    );
    if (this.edit) this.recipeService.onUpdateRecipe(newRecipe, this.index);
    else this.recipeService.onAddRecipe(newRecipe);

    this.onCancelEdit();
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('recipeIngredient')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('recipeIngredient')).push(
      new FormGroup({
        recipeIngredientName: new FormControl(null, Validators.required),
        recipeIngredientAmount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onCancelEdit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onClearIngredient(index: number) {
    (<FormArray>this.recipeForm.get('recipeIngredient')).removeAt(index);
  }
}

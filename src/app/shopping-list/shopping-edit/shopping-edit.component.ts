import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../../Shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  ingredientForm: FormGroup;
  editSubscription: Subscription;
  editMode: boolean = false;
  editItemIndex: number;
  editItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredientForm = new FormGroup({
      ingredientName: new FormControl(null, Validators.required),
      ingredientAmount: new FormControl(null, Validators.required),
    });

    this.editSubscription = this.shoppingListService.editing.subscribe(
      (index: number) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.editItem = this.shoppingListService.getIngredientWithIndex(index);
        this.ingredientForm.setValue({
          ingredientName: this.editItem.recipeIngredientName,
          ingredientAmount: this.editItem.recipeIngredientAmount,
        });
      }
    );
  }

  onAdd() {
    const { ingredientName, ingredientAmount } = this.ingredientForm.value;
    const newIngredientData = new Ingredient(ingredientName, ingredientAmount);
    if (this.editMode)
      this.shoppingListService.updateIngredient(
        this.editItemIndex,
        newIngredientData
      );
    else this.shoppingListService.addIncredient(newIngredientData);

    this.ingredientForm.reset();
    this.editMode = false;
  }

  onClear() {
    this.ingredientForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }
}

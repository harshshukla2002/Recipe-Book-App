import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeAuth } from './recipes/recipe-auth.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipe',
    pathMatch: 'full',
  },
  {
    path: 'recipe',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':index',
        component: RecipeDetailComponent,
        canActivate: [RecipeAuth],
      },
      {
        path: ':index/edit',
        component: RecipeEditComponent,
        canActivate: [RecipeAuth],
      },
    ],
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRouteModule {}

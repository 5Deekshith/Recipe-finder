export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface RecipeDetail extends Recipe {
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string | undefined; // For dynamic ingredient/measure properties
}

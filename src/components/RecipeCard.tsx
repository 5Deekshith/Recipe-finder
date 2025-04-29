import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/Recipe';

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="recipe-card">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-image"
      />
      <div className="recipe-card-content">
        <h2 className="recipe-name">{recipe.strMeal}</h2>
      </div>
    </Link>
  );
};

export default RecipeCard;

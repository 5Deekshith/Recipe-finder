import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetail } from '../types/Recipe';
import { getRecipeById } from '../services/api';
import { FaArrowLeft, FaGlobeAmericas, FaUtensils, FaYoutube } from 'react-icons/fa';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const getIngredients = (recipe: RecipeDetail): string[] => {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof RecipeDetail];
      const measure = recipe[`strMeasure${i}` as keyof RecipeDetail];
      if (ingredient && measure) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return <div className="error">{error || 'Recipe not found'}</div>;
  }

  // Split instructions into sentences for proper formatting
  const instructionsList = recipe.strInstructions.match(/[^\.\?!]+[\.\?!]+/g)?.map(s => s.trim()) || [];

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back
      </button>
      <section
        className="detail-hero"
        style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
      >
        <div className="detail-hero-overlay">
          <h1>{recipe.strMeal}</h1>
          <div className="recipe-meta">
            <span><FaGlobeAmericas /> {recipe.strArea}</span>
            <span><FaUtensils /> {recipe.strCategory}</span>
            {recipe.strYoutube && (
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link"
              >
                <FaYoutube /> Watch Video
              </a>
            )}
          </div>
        </div>
      </section>
      <div className="detail-content">
        <div className="card ingredients-card">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {getIngredients(recipe).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card instructions-card">
          <h2>Instructions</h2>
          <ol className="instructions-list">
            {instructionsList.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

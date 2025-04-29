import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/Recipe';
import { searchRecipes } from '../services/api';
import { FaUtensils, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(initialQuery !== '');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Get user from session storage
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setUserEmail(token);
    }
  }, []);
  
  // Handle window close for logout
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('token');
    };
    
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = async (query: string) => {
    // require authentication
    if (!sessionStorage.getItem('token')) {
      // Store the search query before redirecting
      sessionStorage.setItem('pendingSearch', query);
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    setSearchQuery(query);
    navigate(`/?q=${query}`, { replace: true });
    try {
      // support multi-ingredient search (split on comma or spaces)
      const ingredients = query.toLowerCase().split(/[\s,]+/).map(i => i.trim()).filter(Boolean);
      let results: Recipe[];
      if (ingredients.length > 1) {
        const lists = await Promise.all(ingredients.map(i => searchRecipes(i)));
        results = lists.reduce((common, list) =>
          common.filter(r => list.some(l => l.idMeal === r.idMeal))
        );
      } else {
        results = await searchRecipes(query);
      }
      setRecipes(results);
      if (results.length === 0) {
        setError('No recipes found. Try another ingredient!');
      }
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  }, []);

  return (
    <div>
      <div className="hero-section">
        {userEmail && (
          <div className="user-menu">
            <span className="user-email">{userEmail}</span>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
        <div className="hero-content">
          <FaUtensils className="hero-icon" />
          <h1>Discover Delicious Recipes</h1>
          <p className="hero-subtitle">Find amazing recipes using your favorite ingredients</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="container results-section">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Searching for delicious recipes...</p>
          </div>
        )}
        
        {error && (
          <div className="error">{error}</div>
        )}
        
        {searched && !loading && !error && recipes.length > 0 && (
          <>
            <h2 className="results-title">
              <FaUtensils className="results-icon" />
              Recipes for "{searchQuery}"
            </h2>
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          </>
        )}

        {!searched && !loading && (
          <div className="welcome-message">
            <h2>Welcome to Recipe Finder!</h2>
            <p>Enter an ingredient above to discover amazing recipes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

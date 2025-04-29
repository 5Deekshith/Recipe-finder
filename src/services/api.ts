import axios from 'axios';
import { Recipe, RecipeDetail } from '../types/Recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchRecipes = async (ingredient: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<RecipeDetail | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals?.[0] || null;
  } catch (error) {
    console.error('Error getting recipe details:', error);
    return null;
  }
};

// Authentication API calls
export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}
export const signupUser = async (data: SignupData) => {
  return axios.post('http://localhost:8000/signup', data);
};
export const loginUser = async (data: LoginData) => {
  return axios.post('http://localhost:8000/login', data);
};

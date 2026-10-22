
import type { Recipe } from "../types/Recipe";

const API_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:5232"}/api/favorites`;

// קבלת כל המתכונים
export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("שגיאה בטעינת המתכונים");
  }

  return await response.json();
}

// קבלת מתכון לפי מזהה
export async function getRecipeById(
  id: number
): Promise<Recipe | undefined> {
  const response = await fetch(`${API_URL}/${id}`);

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error("שגיאה בטעינת המתכון");
  }

  return await response.json();
}

// הוספת מתכון
export async function saveRecipe(
  recipe: Recipe
): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error("שגיאה בהוספת המתכון");
  }
}

// עדכון מתכון
export async function updateRecipe(
  recipe: Recipe
): Promise<void> {
  const response = await fetch(`${API_URL}/${recipe.id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error("שגיאה בעדכון המתכון");
  }
}

// מחיקת מתכון
export async function deleteRecipe(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("שגיאה במחיקת המתכון");
  }
}

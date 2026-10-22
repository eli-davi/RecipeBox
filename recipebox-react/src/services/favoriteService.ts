
import { getCsrfToken } from "./csrfService";
const API_URL = "http://localhost:5232/api/favorites";

async function checkResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("יש להתחבר כדי לשמור מועדפים");
    }

    throw new Error("אירעה שגיאה בפעולה");
  }
}

export async function getFavoriteIds(): Promise<number[]> {
  const response = await fetch(`${API_URL}/ids`, {
    credentials: "include",
  });

  await checkResponse(response);
  return response.json();
}

export async function getFavorites() {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  await checkResponse(response);
  return response.json();
}

export async function addFavorite(recipeId: number) {
  const token = await getCsrfToken();

  const response = await fetch(`${API_URL}/${recipeId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-TOKEN": token,
    },
  });

  await checkResponse(response);
}

export async function removeFavorite(recipeId: number) {
  const token = await getCsrfToken();

  const response = await fetch(`${API_URL}/${recipeId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "X-CSRF-TOKEN": token,
    },
  });

  await checkResponse(response);
}

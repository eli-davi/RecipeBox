
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../services/favoriteService";
import FavoriteButton from "../components/FavoriteButton";
import type { Recipe } from "../types/Recipe";
import "./RecipesPage.css";

function FavoritesPage() {
  const { user } = useAuth();

  const {
    data: favorites = [],
    isPending: loading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ["favorites", user?.email],
    queryFn: getFavorites,
    enabled: !!user,
  });

  if (loading) {
    return <p dir="rtl">טוען מועדפים...</p>;
  }

  if (isError) {
    return (
      <div className="recipesPage" dir="rtl">
        <h2>שגיאה בטעינת המועדפים</h2>
      </div>
    );
  }

  return (
    <div className="recipesPage" dir="rtl">
      <h1>❤️ המועדפים שלי</h1>
      <p>המתכונים ששמרת בחשבון האישי שלך</p>

      {favorites.length === 0 ? (
        <div className="noRecipes">
          <p>עדיין לא שמרת מתכונים במועדפים.</p>
          <Link to="/recipes">
            בואי לבחור מתכונים
          </Link>
        </div>
      ) : (
        <div className="recipesGrid">
          {favorites.map((recipe) => (
            <div
              className="recipeCard"
              key={recipe.id}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  zIndex: 2,
                  background: "white",
                  borderRadius: "50%",
                }}
              >
                <FavoriteButton recipeId={recipe.id} />
              </div>

              <Link
                to={`/recipes/${recipe.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                />

                <div className="recipeContent">
                  <h3>{recipe.name}</h3>
                  <p>{recipe.description}</p>
                  <p>
                    זמן הכנה: {recipe.preparationTime} דקות
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;

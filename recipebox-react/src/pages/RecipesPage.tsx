
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import FavoriteButton from "../components/FavoriteButton";
import "./RecipesPage.css";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "time-asc"
  | "time-desc"
  | "difficulty-asc"
  | "difficulty-desc";

const difficultyOrder: Record<string, number> = {
  קל: 1,
  בינוני: 2,
  קשה: 3,
};

function RecipesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("הכל");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const { user } = useAuth();

  const {
    data: recipes = [],
    isPending: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  const categories = [
    "הכל",
    ...new Set(recipes.map((recipe) => recipe.category)),
  ];

  const filteredRecipes = recipes
    .filter((recipe) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        recipe.name.toLowerCase().includes(searchText) ||
        recipe.description.toLowerCase().includes(searchText) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === "הכל" ||
        recipe.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name, "he");

        case "name-desc":
          return b.name.localeCompare(a.name, "he");

        case "time-asc":
          return a.preparationTime - b.preparationTime;

        case "time-desc":
          return b.preparationTime - a.preparationTime;

        case "difficulty-asc":
          return (
            (difficultyOrder[a.difficulty] ?? 99) -
            (difficultyOrder[b.difficulty] ?? 99)
          );

        case "difficulty-desc":
          return (
            (difficultyOrder[b.difficulty] ?? 0) -
            (difficultyOrder[a.difficulty] ?? 0)
          );

        default:
          return 0;
      }
    });

  function resetFilters() {
    setSearch("");
    setCategory("הכל");
    setSortBy("name-asc");
  }

  return (
    <div className="recipesPage" dir="rtl">
      <h1>המתכונים שלנו</h1>
      <p>מצאי את המתכון שמתאים לך</p>

      {!user && (
        <p>
          ניתן לעיין במתכונים ולחפש אותם.
          כדי לראות מצרכים והוראות הכנה יש להתחבר.{" "}
          <Link to="/login">להתחברות</Link>
        </p>
      )}

      <div className="filters">
        <input
          type="search"
          placeholder="חיפוש לפי שם, תיאור או מצרך..."
          aria-label="חיפוש מתכונים"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          aria-label="סינון לפי קטגוריה"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "הכל"
                ? "כל הקטגוריות"
                : item}
            </option>
          ))}
        </select>

        <select
          aria-label="מיון מתכונים"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as SortOption)
          }
        >
          <option value="name-asc">שם: א–ת</option>
          <option value="name-desc">שם: ת–א</option>
          <option value="time-asc">
            זמן הכנה: מהקצר לארוך
          </option>
          <option value="time-desc">
            זמן הכנה: מהארוך לקצר
          </option>
          <option value="difficulty-asc">
            רמת קושי: מהקל לקשה
          </option>
          <option value="difficulty-desc">
            רמת קושי: מהקשה לקל
          </option>
        </select>

        <button
          type="button"
          className="resetFiltersButton"
          onClick={resetFilters}
        >
          איפוס סינונים
        </button>
      </div>

      {loading && <p role="status">טוען מתכונים...</p>}

      {isError && (
        <div role="alert">
          <p>שגיאה בטעינת המתכונים מהשרת.</p>
          <button
            type="button"
            onClick={() => void refetch()}
          >
            נסי שוב
          </button>
        </div>
      )}

      {!loading && !isError && (
        <>
          <p className="recipesCount">
            נמצאו {filteredRecipes.length} מתכונים
            {filteredRecipes.length !== recipes.length &&
              ` מתוך ${recipes.length}`}
          </p>

          {filteredRecipes.length > 0 ? (
            <div className="recipesGrid">
              {filteredRecipes.map((recipe) => (
                <div
                  className="recipeCard"
                  key={recipe.id}
                  style={{ position: "relative" }}
                >
                  {user && (
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
                  )}

                  <Link
                    to={
                      user
                        ? `/recipes/${recipe.id}`
                        : "/login"
                    }
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      loading="lazy"
                    />

                    <div className="recipeContent">
                      <h3>{recipe.name}</h3>
                      <p>{recipe.description}</p>
                      <p>
                        זמן הכנה: {recipe.preparationTime} דקות
                      </p>
                      <p>
                        רמת קושי: {recipe.difficulty}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="noRecipes">
              <p>
                לא נמצאו מתכונים מתאימים לחיפוש שלך.
              </p>
              <button
                type="button"
                onClick={resetFilters}
              >
                הציגי את כל המתכונים
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecipesPage;

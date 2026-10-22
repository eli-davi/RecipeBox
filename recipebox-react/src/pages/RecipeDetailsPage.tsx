
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipeById, deleteRecipe,} from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import "./RecipesPage.css";
import FavoriteButton from "../components/FavoriteButton";

function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [error, setError] = useState("");

  const recipeId = Number(id);
  const validId =
    !!id && Number.isInteger(recipeId) && recipeId > 0;

  const {
    data: recipe,
    isPending: loading,
    isError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId),
    enabled: validId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });

      queryClient.removeQueries({
        queryKey: ["recipe", recipeId],
      });

      navigate("/recipes");
    },
    onError: () => {
      setError("שגיאה במחיקת המתכון");
    },
  });

  function handleDelete() {
    if (
      !recipe ||
      user?.role !== "Admin" ||
      deleteMutation.isPending
    ) {
      return;
    }

    const confirmed = window.confirm(
      "האם את בטוחה שברצונך למחוק את המתכון?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    deleteMutation.mutate(recipe.id);
  }

  if (!validId) {
    return (
      <div className="recipesPage" dir="rtl">
        <Link to="/recipes">חזרה למתכונים</Link>
        <h2>מזהה המתכון אינו תקין</h2>
      </div>
    );
  }

  if (loading) {
    return <p dir="rtl">טוען מתכון...</p>;
  }

  if (isError || !recipe) {
    return (
      <div className="recipesPage" dir="rtl">
        <Link to="/recipes">חזרה למתכונים</Link>
        <h2>
          {isError
            ? "שגיאה בטעינת המתכון מהשרת"
            : "המתכון לא נמצא"}
        </h2>
      </div>
    );
  }

  return (
    <div className="recipesPage" dir="rtl">
      <Link to="/recipes">חזרה למתכונים</Link>

      <h1>{recipe.name}</h1>
     <FavoriteButton recipeId={recipe.id} />
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          style={{
            width: "300px",
            borderRadius: "12px",
          }}
        />
      )}

      <p>{recipe.description}</p>
      <p>קטגוריה: {recipe.category}</p>
      <p>זמן הכנה: {recipe.preparationTime} דקות</p>
      <p>רמת קושי: {recipe.difficulty}</p>

      <h2>מצרכים</h2>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>אופן ההכנה</h2>
      <p>{recipe.instructions}</p>

      {error && <p role="alert">{error}</p>}

      {user?.role === "Admin" && (
        <div className="recipeActions">
          <Link
            className="editButton"
            to={`/edit-recipe/${recipe.id}`}
          >
            עריכת מתכון
          </Link>

          <button
            className="deleteButton"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? "מוחק..."
              : "מחיקת מתכון"}
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailsPage;

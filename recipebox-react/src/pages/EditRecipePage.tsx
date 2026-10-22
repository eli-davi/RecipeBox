
import { useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getRecipeById,
  updateRecipe,
} from "../services/recipeService";

import type { Recipe } from "../types/Recipe";
import RecipeForm, {
  type RecipeFormData,
} from "../components/RecipeForm";

import "./RecipesPage.css";

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saveError, setSaveError] = useState("");

  const recipeId = Number(id);
  const validId =
    !!id &&
    Number.isInteger(recipeId) &&
    recipeId > 0;

  const {
    data: recipe,
    isPending: loading,
    isError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId),
    enabled: validId,
  });

  const updateMutation = useMutation({
    mutationFn: updateRecipe,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["recipes"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["recipe", recipeId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites"],
        }),
      ]);

      navigate(`/recipes/${recipeId}`);
    },

    onError: () => {
      setSaveError(
        "שגיאה בשמירת השינויים. נסי שוב."
      );
    },
  });

  function onSubmit(data: RecipeFormData) {
    if (!recipe) return;

    setSaveError("");

    const updatedRecipe: Recipe = {
      ...data,
      id: recipe.id,
      name: data.name.trim(),
      description: data.description.trim(),
      instructions: data.instructions.trim(),
      imageUrl: data.imageUrl.trim(),
      ingredients: data.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    };

    updateMutation.mutate(updatedRecipe);
  }

  if (!validId) {
    return (
      <div className="recipesPage" dir="rtl">
        <Link to="/recipes">
          חזרה למתכונים
        </Link>
        <h2>מזהה המתכון אינו תקין</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <p dir="rtl" role="status">
        טוען מתכון לעריכה...
      </p>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="recipesPage" dir="rtl">
        <Link to="/recipes">
          חזרה למתכונים
        </Link>
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
      <Link to={`/recipes/${recipe.id}`}>
        חזרה למתכון
      </Link>

      <h1>עריכת מתכון</h1>

      <RecipeForm
        initialRecipe={recipe}
        onSubmit={onSubmit}
        isSaving={updateMutation.isPending}
        saveError={saveError}
      />
    </div>
  );
}

export default EditRecipePage;

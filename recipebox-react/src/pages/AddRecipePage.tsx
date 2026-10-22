
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { Recipe } from "../types/Recipe";
import { saveRecipe } from "../services/recipeService";
import RecipeForm, {
  type RecipeFormData,
} from "../components/RecipeForm";

import "./RecipesPage.css";

function AddRecipePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saveError, setSaveError] = useState("");

  const addMutation = useMutation({
    mutationFn: saveRecipe,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });

      navigate("/recipes");
    },

    onError: () => {
      setSaveError("שגיאה בשמירת המתכון. נסי שוב.");
    },
  });

  function onSubmit(data: RecipeFormData) {
    setSaveError("");

    const newRecipe: Recipe = {
      ...data,
      id: 0,
      name: data.name.trim(),
      description: data.description.trim(),
      instructions: data.instructions.trim(),
      imageUrl: data.imageUrl.trim(),
      ingredients: data.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    };

    addMutation.mutate(newRecipe);
  }

  return (
    <div className="recipesPage" dir="rtl">
      <h1>הוספת מתכון חדש</h1>

      <RecipeForm
        onSubmit={onSubmit}
        isSaving={addMutation.isPending}
        saveError={saveError}
      />
    </div>
  );
}

export default AddRecipePage;

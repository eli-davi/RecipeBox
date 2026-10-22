
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Recipe } from "../types/Recipe";
import "../pages/RecipesPage.css";

export type RecipeFormData =
  Omit<Recipe, "id" | "ingredients"> & {
    ingredients: string;
  };

type RecipeFormProps = {
  initialRecipe?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  isSaving: boolean;
  saveError: string;
};

function RecipeForm({
  initialRecipe,
  onSubmit,
  isSaving,
  saveError,
}: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "קינוחים",
      preparationTime: 1,
      difficulty: "קל",
      ingredients: "",
      instructions: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialRecipe) {
      reset({
        name: initialRecipe.name,
        description: initialRecipe.description,
        category: initialRecipe.category,
        preparationTime: initialRecipe.preparationTime,
        difficulty: initialRecipe.difficulty,
        ingredients: initialRecipe.ingredients.join(", "),
        instructions: initialRecipe.instructions,
        imageUrl: initialRecipe.imageUrl,
      });
    }
  }, [initialRecipe, reset]);

  return (
    <form
      className="recipeForm"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <label htmlFor="recipe-name">שם המתכון</label>
      <input
        id="recipe-name"
        {...register("name", {
          required: "חובה להזין שם",
          validate: (value) =>
            value.trim().length > 0 ||
            "יש להזין שם תקין",
        })}
      />
      {errors.name && (
        <p className="error" role="alert">
          {errors.name.message}
        </p>
      )}

      <label htmlFor="recipe-description">תיאור</label>
      <input
        id="recipe-description"
        {...register("description", {
          required: "חובה להזין תיאור",
          validate: (value) =>
            value.trim().length > 0 ||
            "יש להזין תיאור תקין",
        })}
      />
      {errors.description && (
        <p className="error" role="alert">
          {errors.description.message}
        </p>
      )}

      <label htmlFor="recipe-category">קטגוריה</label>
      <select
        id="recipe-category"
        {...register("category", {
          required: "חובה לבחור קטגוריה",
        })}
      >
        <option value="קינוחים">קינוחים</option>
        <option value="סלטים">סלטים</option>
        <option value="מנות עיקריות">
          מנות עיקריות
        </option>
      </select>
      {errors.category && (
        <p className="error" role="alert">
          {errors.category.message}
        </p>
      )}

      <label htmlFor="recipe-time">
        זמן הכנה בדקות
      </label>
      <input
        id="recipe-time"
        type="number"
        min="1"
        step="1"
        {...register("preparationTime", {
          required: "חובה להזין זמן",
          valueAsNumber: true,
          validate: (value) =>
            (Number.isInteger(value) && value > 0) ||
            "יש להזין מספר שלם וחיובי",
        })}
      />
      {errors.preparationTime && (
        <p className="error" role="alert">
          {errors.preparationTime.message}
        </p>
      )}

      <label htmlFor="recipe-difficulty">
        רמת קושי
      </label>
      <select
        id="recipe-difficulty"
        {...register("difficulty", {
          required: "חובה לבחור רמת קושי",
        })}
      >
        <option value="קל">קל</option>
        <option value="בינוני">בינוני</option>
        <option value="קשה">קשה</option>
      </select>

      <label htmlFor="recipe-ingredients">
        מצרכים (מופרדים בפסיקים)
      </label>
      <textarea
        id="recipe-ingredients"
        {...register("ingredients", {
          required: "חובה להזין מצרכים",
          validate: (value) =>
            value
              .split(",")
              .some((item) => item.trim().length > 0) ||
            "חובה להזין לפחות מצרך אחד",
        })}
      />
      {errors.ingredients && (
        <p className="error" role="alert">
          {errors.ingredients.message}
        </p>
      )}

      <label htmlFor="recipe-instructions">
        הוראות הכנה
      </label>
      <textarea
        id="recipe-instructions"
        {...register("instructions", {
          required: "חובה להזין הוראות",
          validate: (value) =>
            value.trim().length > 0 ||
            "יש להזין הוראות הכנה תקינות",
        })}
      />
      {errors.instructions && (
        <p className="error" role="alert">
          {errors.instructions.message}
        </p>
      )}

      <label htmlFor="recipe-image">
        כתובת תמונה
      </label>
      <input
        id="recipe-image"
        type="url"
        placeholder="https://example.com/image.jpg"
        {...register("imageUrl", {
          validate: (value) => {
            if (!value?.trim()) return true;

            try {
              const url = new URL(value.trim());
              return (
                ["http:", "https:"].includes(url.protocol) ||
                "יש להזין כתובת תמונה תקינה"
              );
            } catch {
              return "יש להזין כתובת תמונה תקינה";
            }
          },
        })}
      />
      {errors.imageUrl && (
        <p className="error" role="alert">
          {errors.imageUrl.message}
        </p>
      )}

      {saveError && (
        <p className="error" role="alert">
          {saveError}
        </p>
      )}

      <button type="submit" disabled={isSaving}>
        {isSaving
          ? "שומר..."
          : initialRecipe
          ? "שמירת שינויים"
          : "שמירת מתכון"}
      </button>
    </form>
  );
}

export default RecipeForm;

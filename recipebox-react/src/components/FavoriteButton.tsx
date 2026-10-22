
import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  getFavoriteIds,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService";

type Props = {
  recipeId: number;
};

export default function FavoriteButton({ recipeId }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ["favoriteIds", user?.email],
    queryFn: getFavoriteIds,
    enabled: !!user,
  });

  const isFavorite = favoriteIds.includes(recipeId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favoriteIds"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites"],
        }),
      ]);
    },
    onError: (err) => {
      setError(
        err instanceof Error
          ? err.message
          : "לא ניתן לעדכן מועדפים"
      );
    },
  });

  if (!user) {
    return null;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        disabled={mutation.isPending}
        aria-label={
          isFavorite
            ? "הסרה מהמועדפים"
            : "הוספה למועדפים"
        }
        aria-pressed={isFavorite}
        title={
          isFavorite
            ? "הסרה מהמועדפים"
            : "הוספה למועדפים"
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setError("");
          mutation.mutate();
        }}
        style={{
          fontSize: "26px",
          border: "none",
          background: "transparent",
          cursor: mutation.isPending
            ? "wait"
            : "pointer",
          color: isFavorite ? "#e63946" : "#777",
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {error && (
        <small role="alert" style={{ color: "red" }}>
          {error}
        </small>
      )}
    </span>
  );
}

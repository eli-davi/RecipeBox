
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RecipesPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/recipes", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ההתחברות נכשלה"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="recipesPage" dir="rtl">
      <h1>התחברות ל־RecipeBox</h1>
      <p>התחברי לחשבון האישי שלך</p>

      <form className="recipeForm" onSubmit={handleLogin}>
        <label htmlFor="email">כתובת אימייל</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="example@gmail.com"
        />

        <label htmlFor="password">סיסמה</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "מתחברת..." : "התחברות"}
        </button>

        <p>
          עדיין אין לך חשבון?{" "}
          <Link to="/register">להרשמה</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;


import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RecipesPage.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("יש להזין שם");
      return;
    }

    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("הסיסמה חייבת להכיל לפחות ספרה אחת");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate("/recipes", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ההרשמה נכשלה"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="recipesPage" dir="rtl">
      <h1>הרשמה ל־RecipeBox</h1>
      <p>צרי חשבון אישי לשמירת המתכונים האהובים עלייך</p>

      <form className="recipeForm" onSubmit={handleRegister}>
        <label htmlFor="name">שם משתמש</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <label htmlFor="register-email">כתובת אימייל</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="register-password">סיסמה</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          autoComplete="new-password"
        />

        <small>לפחות 8 תווים, כולל ספרה אחת</small>

        <label htmlFor="confirm-password">
          אימות סיסמה
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
          autoComplete="new-password"
        />

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "נרשמת..." : "יצירת חשבון"}
        </button>

        <p>
          כבר יש לך חשבון?{" "}
          <Link to="/login">להתחברות</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

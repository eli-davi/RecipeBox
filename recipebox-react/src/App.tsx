
import {Link, Route, Routes, Navigate, useNavigate,} from "react-router-dom";
import type { ReactNode } from "react";
import RecipesPage from "./pages/RecipesPage";
import EditRecipePage from "./pages/EditRecipePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import AddRecipePage from "./pages/AddRecipePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import FavoritesPage from "./pages/FavoritesPage";

function HomePage() {
  const { user } = useAuth();

  return (
    <main className="main">
      <h1>ברוכים הבאים ל־RecipeBox</h1>
      <p>כל המתכונים האהובים במקום אחד</p>

      {!user && (
        <p>
          הירשמי או התחברי כדי לצפות במצרכים
          ובהוראות ההכנה.
        </p>
      )}

      <Link className="mainButton" to="/recipes">
        לצפייה במתכונים
      </Link>
    </main>
  );
}

function LoggedInRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>בודק התחברות...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>בודק הרשאות...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/recipes" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      alert("ההתנתקות נכשלה. נסי שוב.");
    }
  }

  return (
    <div className="home">
      <header className="header">
        <h2>RecipeBox</h2>

        <nav>
          <Link to="/">דף הבית</Link>
          <Link to="/recipes">מתכונים</Link>
         {user && (<Link to="/favorites">❤️ המועדפים שלי</Link>)}
         {user?.role === "Admin" && (<Link to="/add-recipe"> הוספת מתכון </Link>  )}
         {!loading && (user ? (<><span> שלום,{" "}{user.role === "Admin" ? "מנהל האתר" : user.name} </span>
          <button type="button" onClick={() => void handleLogout()} > התנתקות </button> </> ) 
          : ( <>  <Link to="/login">התחברות</Link>
                  <Link to="/register">הרשמה</Link>
              </> ))}
         </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />}/>
        <Route path="/recipes/:id" element={ <LoggedInRoute>
              <RecipeDetailsPage />
            </LoggedInRoute> }  />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/edit-recipe/:id" element={ <AdminRoute>
              <EditRecipePage />
            </AdminRoute>
          } />
        <Route path="/add-recipe" element={ <AdminRoute>
              <AddRecipePage />
            </AdminRoute>
          } />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/favorites" element={<LoggedInRoute>
              <FavoritesPage />
            </LoggedInRoute>} />
      </Routes>
    </div>
  );
}

export default App;

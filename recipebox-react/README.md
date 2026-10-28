# 🍰 RecipeBox

מערכת לניהול מתכונים: צפייה, חיפוש, סינון ומיון של מתכונים, שמירת מועדפים אישיים, וניהול מתכונים על ידי מנהל האתר.

🔗 **האתר:** (https://recipebox-hu4y.onrender.com)
🔗 **השרת (API):** https://recipebox-api-c32h.onrender.com

> השרת רץ בתוכנית החינמית של Render, ולכן הכניסה הראשונה אחרי זמן ללא פעילות עשויה לקחת עד כדקה.

---

## ✨ אפשרויות המערכת

### משתמש אורח (לא מחובר)
- צפייה ברשימת המתכונים
- חיפוש לפי שם, תיאור או מצרך
- סינון לפי קטגוריה ומיון לפי שם, זמן הכנה או רמת קושי

### משתמש רשום (User)
- כל מה שמשתמש אורח יכול
- הרשמה, התחברות והתנתקות
- צפייה בפרטי מתכון מלאים: מצרכים והוראות הכנה
- הוספה והסרה של מתכונים ממועדפים, ועמוד "המועדפים שלי"

### מנהל (Admin)
- כל מה שמשתמש רשום יכול
- הוספת מתכון חדש
- עריכת מתכון קיים
- מחיקת מתכון

ההרשאות נאכפות גם בצד הלקוח (ניתובים מוגנים) וגם בצד השרת (`[Authorize]` לפי תפקיד).

---

## 🧾 מבנה מתכון

| שדה | תיאור |
|---|---|
| `name` | שם המתכון |
| `description` | תיאור קצר |
| `category` | קטגוריה |
| `preparationTime` | זמן הכנה בדקות |
| `difficulty` | רמת קושי (קל / בינוני / קשה) |
| `ingredients` | רשימת מצרכים |
| `instructions` | אופן ההכנה |
| `imageUrl` | קישור לתמונה |

---

## 🛠️ טכנולוגיות

### צד לקוח (`recipebox-react`)
- React + TypeScript (Vite)
- React Router: ניתוב בין עמודים וניתובים מוגנים לפי הרשאה
- React Query (TanStack Query): טעינת נתונים מהשרת, שמירה במטמון ועדכון אחרי שינויים
- Context API: ניהול מצב ההתחברות (`AuthContext`)

### צד שרת (`RecipeBoxApi`)
- ASP.NET Core Web API
- Entity Framework Core + Npgsql
- ASP.NET Core Identity: משתמשים ותפקידים (Admin / User)
- אימות באמצעות Cookie (`HttpOnly`, `Secure`, `SameSite=None`)
- הגנת CSRF באמצעות Antiforgery Token בכותרת `X-CSRF-TOKEN`

### מסד נתונים ופריסה
- PostgreSQL ב-[Neon](https://neon.tech)
- צד הלקוח וצד השרת מאוחסנים ב-[Render](https://render.com)

---

## 🔌 נקודות קצה (API)

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| GET | `/api/recipes` | כולם | כל המתכונים |
| GET | `/api/recipes/{id}` | כולם | מתכון לפי מזהה |
| POST | `/api/recipes` | Admin | הוספת מתכון |
| PUT | `/api/recipes/{id}` | Admin | עדכון מתכון |
| DELETE | `/api/recipes/{id}` | Admin | מחיקת מתכון |
| POST | `/api/auth/register` | כולם | הרשמה |
| POST | `/api/auth/login` | כולם | התחברות |
| GET | `/api/auth/me` | מחובר | פרטי המשתמש המחובר |
| POST | `/api/auth/logout` | מחובר | התנתקות |
| GET | `/api/favorites` | מחובר | המתכונים המועדפים |
| GET | `/api/favorites/ids` | מחובר | מזהי המתכונים המועדפים |
| POST | `/api/favorites/{recipeId}` | מחובר + CSRF | הוספה למועדפים |
| DELETE | `/api/favorites/{recipeId}` | מחובר + CSRF | הסרה מהמועדפים |
| GET | `/api/csrf-token` | כולם | קבלת טוקן CSRF |

---

## 💻 הרצה מקומית

### דרישות מוקדמות
- Node.js
- .NET SDK
- מסד PostgreSQL (מקומי או Neon)

### 1. השרת
```bash
cd RecipeBoxApi
```

הגדירי את מחרוזת החיבור ב-`appsettings.Development.json` (או ב-User Secrets):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"
  }
}
```

יצירת הטבלאות והרצת השרת:
```bash
dotnet ef database update
dotnet run
```
השרת יעלה בכתובת `http://localhost:5232`.

### 2. הלקוח
```bash
cd recipebox-react
npm install
npm run dev
```
האתר יעלה בכתובת `http://localhost:5173`.

אם לא מוגדר `VITE_API_URL`, הלקוח פונה אוטומטית ל-`http://localhost:5232`.

---

## ⚙️ משתני סביבה בפריסה (Render)

### שירות הלקוח
| משתנה | ערך |
|---|---|
| `VITE_API_URL` | כתובת השרת, ללא `/` בסוף |

כלל Rewrite: `/*` → `/index.html` (נדרש עבור React Router).

### שירות השרת
| משתנה | ערך |
|---|---|
| `ConnectionStrings__DefaultConnection` | מחרוזת החיבור ל-Neon |
| `FrontendUrl` | כתובת האתר (עבור CORS) |

---

## 📁 מבנה הפרויקט

```
recipebox-react/
└── src/
    ├── components/   קומפוננטות משותפות (טופס מתכון, כפתור מועדפים)
    ├── context/      AuthContext - מצב ההתחברות
    ├── pages/        עמודי האתר
    ├── services/     קריאות לשרת
    └── types/        טיפוסי TypeScript

RecipeBoxApi/
├── Controllers/      Recipes, Auth, Favorites
├── Data/             RecipeDbContext
├── Models/           Recipe, AppUser, Favorite
└── Program.cs        הגדרות CORS, Identity, Cookies, CSRF
```
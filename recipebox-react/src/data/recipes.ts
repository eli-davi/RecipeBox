
import type { Recipe } from "../types/Recipe";

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "עוגת שוקולד",
    description: "עוגת שוקולד רכה וקלה להכנה",
    category: "קינוחים",
    preparationTime: 45,
    difficulty: "קל",
    ingredients: ["קמח", "סוכר", "קקאו", "ביצים", "שמן"],
    instructions: "מערבבים את כל החומרים ואופים בתנור.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    id: 2,
    name: "סלט ירקות",
    description: "סלט ירקות טרי ובריא",
    category: "סלטים",
    preparationTime: 15,
    difficulty: "קל",
    ingredients: ["עגבניות", "מלפפונים", "פלפל", "שמן זית"],
    instructions: "חותכים את הירקות ומתבלים.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
  },
  {
    id: 3,
    name: "פסטה ברוטב עגבניות",
    description: "פסטה טעימה לארוחת צהריים",
    category: "מנות עיקריות",
    preparationTime: 30,
    difficulty: "בינוני",
    ingredients: ["פסטה", "עגבניות", "שום", "שמן זית"],
    instructions: "מבשלים את הפסטה ומכינים רוטב עגבניות.",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601"
  }
];

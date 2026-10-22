
export interface Recipe {
  id: number;
  name: string;
  description: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
}

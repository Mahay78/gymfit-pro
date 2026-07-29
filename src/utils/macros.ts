export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateMacros(weight: number, height: number, age: number, gender: 'male' | 'female', activity: number, goal: 'cut' | 'maintain' | 'bulk'): Macros {
  const bmr = gender === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  const tdee = Math.round(bmr * activity);
  let calories = tdee;
  if (goal === 'cut') calories = Math.round(tdee * 0.8);
  if (goal === 'bulk') calories = Math.round(tdee * 1.12);
  const protein = Math.round(weight * 2);
  const fat = Math.round(weight * 0.9);
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const carbs = Math.max(50, Math.round((calories - proteinCal - fatCal) / 4));
  return { calories, protein, carbs, fat };
}

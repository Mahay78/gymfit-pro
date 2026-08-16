import { useMemo } from 'react';

interface UserMetrics {
  userWeight: number;
  userHeight: number;
  userAge: number;
  userGender: string;
  userActivity: number;
}

export function useNutritionCalculator({
  userWeight,
  userHeight,
  userAge,
  userGender,
  userActivity,
}: UserMetrics) {
  return useMemo(() => {
    const weight = parseFloat(String(userWeight)) || 80;
    const height = userHeight || 175;
    const age = userAge || 28;

    const bmr =
      userGender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = Math.round(bmr * (parseFloat(String(userActivity)) || 1.375));
    const deficitCalories = Math.round(tdee * 0.8);
    const proteinGoal = Math.round(weight * 2);

    return {
      bmr: Math.round(bmr),
      tdee,
      deficitCalories,
      proteinGoal,
    };
  }, [userWeight, userHeight, userAge, userGender, userActivity]);
}

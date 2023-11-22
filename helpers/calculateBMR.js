const calculateBMR = (data) => {
  const { height, currentWeight, birthday, sex, levelActivity } = data;
  const activityCoefficients = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };
  const activityCoefficient = activityCoefficients[levelActivity];
  const isMale = sex === "male";
  const baseMetabolicRate = isMale
    ? (10 * currentWeight +
        6.25 * height -
        5 * (new Date().getFullYear() - new Date(birthday).getFullYear()) +
        5) *
      activityCoefficient
    : (10 * currentWeight +
        6.25 * height -
        5 * (new Date().getFullYear() - new Date(birthday).getFullYear()) -
        161) *
      activityCoefficient;

  const BMR = baseMetabolicRate * activityCoefficient;
  const dailyExerciseTime = 110;
  const calculations = {
    BMR,
    dailyExerciseTime,
  };
  return calculations;
};

export default calculateBMR;

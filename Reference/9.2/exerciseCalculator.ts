interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (arr: Array<number>): Result => {
  const target = 3;
  const periodLength = arr.length;
  const trainingDays = arr.filter(d => d !== 0).length;
  const trainingAverageHours = arr.reduce((a, b) => a + b, 0) / periodLength;
  const success = trainingAverageHours > target;
  let rating = 0;
  let ratingDescription = '';

  switch (true) {
    case (trainingAverageHours < target * .33):
      rating = 1;
      ratingDescription = 'please try harder';
      break;
    case (trainingAverageHours < target * .67):
      rating = 2;
      ratingDescription = 'not too bad could be beter';
      break;
    case (trainingAverageHours > target):
      rating = 3;
      ratingDescription = 'Great!';
      break;
    default:
      throw new Error('ERROR!')
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average: trainingAverageHours
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1]))
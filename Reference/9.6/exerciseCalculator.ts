interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface Inputs {
  target: number,
  days: Array<number>
}

const parseArgs = (args: Array<string>) => {
  const target = Number(args[2]);
  const inputNums = args.slice(3);
  return {
    target,
    days: inputNums.map(n => Number(n))
  };
};

const calculateExercises = (target: number, arr: Array<number>): Result => {
  // console.log('---', target, arr)
  const periodLength = arr.length;
  const trainingDays = arr.filter(d => d !== 0).length;
  const trainingAverageHours = arr.reduce((a, b) => a + b, 0) / periodLength;
  const success = trainingAverageHours > target;
  let rating = 0;
  let ratingDescription = '';

  switch (true) {
    case (trainingAverageHours < target * 0.5):
      rating = 1;
      ratingDescription = 'please try harder';
      break;
    case (trainingAverageHours < target):
      rating = 2;
      ratingDescription = 'not too bad could be beter';
      break;
    case (trainingAverageHours >= target):
      rating = 3;
      ratingDescription = 'Great!';
      break;
    default:
      throw new Error('ERROR!');
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average: trainingAverageHours
  };
};

const { target, days } = parseArgs(process.argv);
console.log(calculateExercises(target, days));
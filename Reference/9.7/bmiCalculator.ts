// interface Values {
//   height: number,
//   weight: number
// }

// const parseArguments = (args: Array<string>): Values => {
//   // console.log('!!!',args)
//   if (args.length > 4) throw new Error('Too many arguments!')
//   if (args.length < 4) throw new Error('Too few arguments!')

//   if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
//     return {
//       height: Number(args[2]),
//       weight: Number(args[3])
//     }
//   } else {
//     throw new Error('Provided values are not numbers!')
//   }
// }

export const calculateBmi = (height: number, weight: number): string => {
  const hMeter = height / 100;
  const bmi = weight / (hMeter * hMeter);

  switch (true) {
    case (bmi < 18.5):
      return `Underweight ${bmi}`;
    case (bmi < 25):
      return `Normal weight ${bmi}`;
    case (bmi < 30):
      return `Overweight ${bmi}`;
    case (bmi >= 30):
      return `Obese ${bmi}`;
    default:
      throw new Error('error!');
  }

};

// const { height, weight } = parseArguments(process.argv)
// console.log(calculateBmi(height, weight))
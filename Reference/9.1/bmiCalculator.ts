const calculateBmi = (height: number, weight: number): string => {
  const hMeter = height / 100;
  const bmi = weight / (hMeter * hMeter)

  switch (true) {
    case (bmi < 18.5):
      return `Underweight ${bmi}`
    case (bmi < 25):
      return `Normal weight ${bmi}`
    case (bmi < 30):
      return `Overweight ${bmi}`
    case (bmi >= 30):
      return `Obese ${bmi}`
    default:
      throw new Error('error!')
  }

}

console.log(calculateBmi(180, 74))
import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  try {
    const bmi = calculateBmi(height, weight);
    return res.json({
      weight: weight,
      height: height,
      bmi: bmi
    });
  } catch (e) {
    1;
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

app.post('/exercises', (req, res) => {
  const days = req.body.daily_exercises;
  const target = req.body.target;
  // console.log(req.body)

  if (!days || !target) {
    return res.status(400).json({
      error: "parameters missing"
    });
  }

  if (isNaN(target) || days.some(isNaN)) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const result = calculateExercises(target, days);
  return res.status(200).json({
    result
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

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
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
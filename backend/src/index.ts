import express  from 'express';
import 'dotenv/config';

import {solveIntents} from './solver';

const app = express();
const port = 8000;

app.use(express.json());

solveIntents();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

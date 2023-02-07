import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());
// to send data from the front end to the backend in the form of json

// console.log(process.env.OPENAI_API_KEY);
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'hello form xeroCode',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      //higher temperature means the model will take more risks
      max_tokens: 3000, //more and larger responses
      top_p: 1,
      frequency_penalty: 0.5,
      //less likely to repeant the answer
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(5000, () => {
  console.log('Server is running in port number 5000');
});

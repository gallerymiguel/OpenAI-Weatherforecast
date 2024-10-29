import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { date, z } from "zod";
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers';

dotenv.config();

const port = process.env.PORT || 3001;
const apiKey = process.env.OPENAI_API_KEY;
let model: OpenAI;
// Check if the API key is defined
if (!apiKey) {
  console.error('OPENAI_API_KEY is not defined. Exiting...');
  process.exit(1);
}

const app = express();
app.use(express.json());

// TODO: Initialize the OpenAI model
if (apiKey) {
model = new OpenAI({ temperature: 0, openAIApiKey: apiKey, modelName: 'gpt-3.5-turbo' });
} else {
  console.error('OPENAI_API_KEY is not configured.');
}
// TODO: Define the parser for the structured output
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  day1: "Day one weather forecast",
  day2: "Day two weather forecast",
  day3: "Day three weather forecast",
  day4: "Day four weather forecast",
  day5: "Day five weather forecast",
});

const formatInstructions = parser.getFormatInstructions();
// TODO: Get the format instructions from the parser
const promptTemplate = new PromptTemplate({
  template: "You are a sports announcer explaining the five-day weather forcast. If the input provided is unrelated to a city, do not answer.\n{format_instructions}\n{text}",
  inputVariables: ["text"],
  partialVariables: { format_instructions: formatInstructions }
});
// TODO: Define the prompt template

const fixingParser = new OutputFixingParser(forecastSchema);
// Create a prompt function that takes the user input and passes it through the call method
// zod schema for the forecast
const forecastSchema = z.object({  
  day1: z.object({
    date: date(), 
    temperature: z.number(),
    weather: z.string(),
  }),
  day2: z.object({
    date: date(), 
    temperature: z.number(),
    weather: z.string(),
  }),
  day3: z.object({
    date: date(), 
    temperature: z.number(),
    weather: z.string(),
  }),
  day4: z.object({
    date: date(), 
    temperature: z.number(),
    weather: z.string(),
  }),
  day5: z.object({
    date: date(), 
    temperature: z.number(),
    weather: z.string(),
  }),
});

// Create a prompt function that takes the user input and passes it through the call method
const promptFunc = async (input: string) => {  
  try {
    if (model) {
      // Format the prompt with user input
      const formattedPrompt = await promptTemplate.format({ text: input });
      // Call the model with the formatted prompt
      const response = await model.invoke(formattedPrompt);
      // Parse the JSON response
      const parsedResponse = await fixingParser.parse(response);
      const validatedResponse = forecastSchema.parse(parsedResponse);
      return validatedResponse;
    }
    return { error: "No OpenAI API key provided." };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
        // TODO: Format the prompt with the user input
        // TODO: Call the model with the formatted prompt
        // TODO: return the JSON response
        // TODO: Catch any errors and log them to the console
        

// Endpoint to handle request
app.post('/forecast', async (req: Request, res: Response): Promise<void> => {
  try {
    const location: string = req.body.location;
    if (!location) {
      res.status(400).json({
        error: 'Please provide a location in the request body.',
      });
    }
    const result: any = await promptFunc(location);
    res.json({ result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

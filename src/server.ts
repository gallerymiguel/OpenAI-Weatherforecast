import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
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
// model is already initialized above
} else {
  console.error('OPENAI_API_KEY is not configured.');
}
// TODO: Define the parser for the structured output
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  day1: "Day one weather forecast as a sports announcer providing at least 2 sentence detailed description of the weather and the temperature number.",
  day2: "Day two weather forecast as a sports announcer providing at least 2 sentence detailed description of the weather and the temperature number",
  day3: "Day three weather forecast as a sports announcer providing at least 2 sentence detailed description of the weather and the temperature number",
  day4: "Day four weather forecast as a sports announcer providing at least 2 sentence detailed description of the weather and the temperature number",
  day5: "Day five weather forecast as a sports announcer providing at least 2 sentence detailed description of the weather and the temperature number",
});

const formatInstructions = parser.getFormatInstructions();
// TODO: Get the format instructions from the parser
const promptTemplate = new PromptTemplate({
  template: "You are a sports announcer explaining the five-day weather forcast. If the input provided is unrelated to a city, do not answer.\n{format_instructions}\n{text}",
  inputVariables: ["text"],
  partialVariables: { format_instructions: formatInstructions }
});
// TODO: Define the prompt template

// Create a prompt function that takes the user input and passes it through the call method
// zod schema for the forecast
const forecastSchema = z.object({  
  day1: z.string(),
  day2: z.string(),
  day3: z.string(),
  day4: z.string(),
  day5: z.string(),
});
model = new OpenAI({ temperature: 0, openAIApiKey: apiKey, modelName: 'gpt-3.5-turbo' });

// Use fromZodSchema and ensure retryChain compatibility
const fixingParser = new OutputFixingParser({
  parser: StructuredOutputParser.fromZodSchema(forecastSchema),
  retryChain: model as any, // Temporarily cast `model` as `any` for compatibility
});

// Create a prompt function that takes the user input and passes it through the call method
const formatPrompt = async (location: string): Promise<string> => {
  return await promptTemplate.format({ text: location });
};

const promptFunc = async (input: string) => {  
  try {
    if (model) {
      // Use the formatPrompt function to format the input
      const formattedPrompt = await formatPrompt(input);
      // Call the model with the formatted prompt
      const response = await model.invoke(formattedPrompt);
      // Parse the JSON response
      console.log("Raw response:", response);

      const parsedResponse = await fixingParser.parse(response);
      const validatedResponse = forecastSchema.safeParse(parsedResponse);
      if (!validatedResponse.success) {
        throw new Error('Validation failed');
      }
      return validatedResponse.data;
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

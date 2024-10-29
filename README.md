
# Weather Forecast API

This project provides a five-day weather forecast using OpenAI's API, where the forecast is formatted as if announced by a sports commentator. Built with Node.js, Express, and LangChain, it parses the forecast data and validates responses using Zod to ensure structured outputs.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoint](#api-endpoint)
- [Response Format](#response-format)
- [Dependencies](#dependencies)
- [License](#license)

## Getting Started

These instructions will guide you in setting up and running the Weather Forecast API on your local machine.

### Prerequisites

- **Node.js** and **npm**: Download and install from [Node.js official site](https://nodejs.org/).
- **OpenAI API Key**: Sign up at [OpenAI](https://beta.openai.com/signup/) and retrieve an API key to use their models.

## Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/weather-forecast-api.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd weather-forecast-api
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

Start the server:

```bash
npm run start
```

The server should be running on `http://localhost:3001`.

## API Endpoint

### POST /forecast

**Description**: Retrieves a five-day weather forecast for a given location, presented as if announced by a sports commentator.

- **Request Body**:
  ```json
  {
    "location": "Austin"
  }
  ```

- **Response**:
  - On success:
    ```json
    {
      "result": {
		    "day1": "Welcome sports fans! Day one in Austin will bring clear skies and a high temperature of 85 degrees. Perfect weather for outdoor activities!",
		    "day2": "And on day two, we're expecting some clouds to roll in with a chance of showers in the afternoon. Temperatures will reach a high of 78 degrees.",
		    "day3": "Moving on to day three, the sun will be back shining bright with a high of 82 degrees. Great weather for a day at the park!",
		    "day4": "As we approach day four, expect partly cloudy skies and a high temperature of 79 degrees. A great day for a hike in the hills!",
		    "day5": "And finally, on day five, we'll see a mix of sun and clouds with a high of 81 degrees. Looks like another beautiful day in Austin!"
      }
    }
    ```
  - On error:
    ```json
    {
      "error": "Internal Server Error"
    }
    ```

## Response Format

The forecast data is validated to ensure each day's forecast includes a short description and temperature. The project uses **Zod** for validation to ensure the API response conforms to a specific structure, providing reliability and consistency in the data output.

## Dependencies

- **dotenv**: For loading environment variables from `.env` files.
- **express**: Node.js framework for building the API.
- **@langchain/openai** and **@langchain/core/prompts**: For managing the OpenAI API interactions.
- **zod**: For schema validation of the response data.
- **langchain/output_parsers**: For structured output parsing to ensure the response meets the expected format.

## License

This project is licensed under the MIT License.

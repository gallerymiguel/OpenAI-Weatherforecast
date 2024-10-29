
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
    "location": "New York"
  }
  ```

- **Response**:
  - On success:
    ```json
    {
      "result": {
        "day1": "Sunny with a high of 75°F.",
        "day2": "Partly cloudy with a chance of showers and a high of 72°F.",
        "day3": "Rainy with thunderstorms and a high of 68°F.",
        "day4": "Cloudy with a high of 70°F.",
        "day5": "Clear skies with a high of 78°F."
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

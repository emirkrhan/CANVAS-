# Canvas Chatbot Workspace

This project is a React-based web application designed to provide an interactive chatbot experience, including step-by-step analysis, customization, and workspace management. It leverages Gemini AI for advanced conversational capabilities.

## Features

- **ChatBot**: Engage with an AI-powered chatbot.
- **Step Analysis**: Analyze steps in your workflow.
- **Step Customize**: Customize steps to fit your needs.
- **Step Layout**: Organize and visualize steps.
- **Step Start**: Begin new workflows.
- **Step Upload**: Upload files for analysis.
- **Workspace**: Manage your workspace and wireframes.

## Technologies Used

- **React** (TypeScript)
- **Vite** (for fast development and build)
- **Gemini AI API** (via `geminiService.ts`)
- **Custom Components** (in `components/`)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
    ```cmd
    git clone <your-repo-url>
    cd canvas
    ```

2. Install dependencies:
    ```cmd
    npm install
    ```

3. Set up your environment variables:
    - Copy `.env.local` and replace `PLACEHOLDER_API_KEY` with your actual Gemini API key.

### Running the App

```cmd
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Project Structure

- `components/`: React components for chatbot, steps, workspace, and icons.
- `services/`: API and Gemini service integrations.
- `types.ts`: TypeScript type definitions.
- `constants.ts`: Application constants.
- `App.tsx`: Main application component.
- `index.tsx`: Entry point.
- `vite.config.ts`: Vite configuration.
- `.env.local`: Environment variables.

## Configuration

- **Gemini API Key**: Required in `.env.local` as `GEMINI_API_KEY`.
- **Other settings**: See `vite.config.ts` and `tsconfig.json` for build and TypeScript options.

## License

Specify your license here (e.g., MIT).

## Author

[@Arliiii](https://github.com/Arliiii)
[@Abdirashid-dv](https://github.com/Abdirashid-dv)
---

For more details, see the code and comments in each file.

# LOD Team Randomizer 🎯

A premium, highly dynamic web application designed to randomize teams and calculate prize payouts for Luck of the Draw (LOD) Dart Tournaments. Built with **React**, **Vite**, and **Vanilla CSS** (featuring a modern glassmorphism design system).

## Features

- **Player Management**: Easily add and remove players. The list is automatically saved to `localStorage`, so you never lose your data if you accidentally close the tab.
- **Dynamic Team Generation**: Automatically generate random teams of 2 (Doubles), 3 (Triples), or 4 (Quads) with the click of a button.
- **Prize Payout Calculator**: Enter a signup cost per person, and the app instantly calculates the total prize pool and splits it across a 3-place payout structure (1st, 2nd, and 3rd).
- **One-Click Copy**: Copy your generated teams to your clipboard instantly for easy sharing in Discord, Facebook, or SMS.
- **Premium UI**: Dark mode by default, featuring glassmorphic panels, animated transitions, and smooth scrolling for a top-tier user experience.

## Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or download this repository.
2. Open your terminal in the project directory.
3. Install the required dependencies:
   ```bash
   npm install
   ```

*(Note: `lucide-react` is included in the `package.json` dependencies and will be installed automatically).*

### Running the App

To run the application in development mode, run:

```bash
npm run dev
```

This will start a local server. Open the URL provided in your terminal (usually `http://localhost:5173`) in your web browser to view the app.

## Built With

- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Frontend Build Tool
- [Lucide React](https://lucide.dev/) - Beautiful SVG Icons
- **Vanilla CSS** - Custom glassmorphism design system

## How it Works

The randomizer uses the Fisher-Yates shuffle algorithm to ensure true randomness when pairing players together. The payout calculator takes the total prize pool and distributes it dynamically: 
- **1st Place:** ~55%
- **2nd Place:** ~25%
- **3rd Place:** ~20% (guaranteed to cover the entry fee)

# Neon Tabletop Roller

Welcome to **Neon Tabletop Roller**, a mobile application for tabletop RPG enthusiasts! This app allows you to roll dice, manage dice collections, view roll history, and customize your experience with a sleek neon-themed interface.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation Guide](#installation-guide)
- [Getting Started with React Native & Expo](#getting-started-with-react-native--expo)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Introduction

Neon Tabletop Roller is built using **React Native** and **Expo**. It provides a modern, responsive, and tactile dice rolling experience on both Android and iOS devices. Whether you need a simple d20 roll or a complex combination of dice, this app has you covered.

## Features

- **Dice Roller**: Roll various types of dice (d4, d6, d8, d10, d12, d20, etc.) with realistic animations and haptic feedback.
- **Collections**: Save your favorite dice combinations for quick access.
- **History**: Keep track of your past rolls.
- **Settings**: Customize the app's appearance and behavior.
- **Theming**: A dark, neon-inspired theme for a cool aesthetic.

## Installation Guide

Follow these steps to set up and run the project locally.

### Prerequisites

1.  **Node.js**: You need to have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Git**: Version control system to clone the repository. Download from [git-scm.com](https://git-scm.com/).
3.  **Expo Go App**:
    -   **Android**: Download from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
    -   **iOS**: Download from the [App Store](https://apps.apple.com/us/app/expo-go/id982107779).

### Steps

1.  **Clone the Repository**:
    Open your terminal or command prompt and run:
    ```bash
    git clone <repository-url>
    cd neon-tabletop-roller
    ```

2.  **Install Dependencies**:
    Install the required packages using npm:
    ```bash
    npm install
    ```

3.  **Start the Development Server**:
    Run the following command to start the Expo development server:
    ```bash
    npm start
    ```
    (or `npx expo start`)

4.  **Run on Your Device**:
    -   You will see a QR code in your terminal.
    -   Open the **Expo Go** app on your phone.
    -   **Android**: Tap "Scan QR Code" and scan the code from your terminal.
    -   **iOS**: Use the default Camera app to scan the QR code, then tap the notification to open it in Expo Go.

## Getting Started with React Native & Expo

If you are new to React Native, here is a brief overview:

### What is React Native?
[React Native](https://reactnative.dev/) is a framework that allows you to build native mobile apps using JavaScript and React. It maps your JavaScript code to native platform components, giving you the look and feel of a truly native app.

### What is Expo?
[Expo](https://expo.dev/) is a set of tools and services built around React Native that makes it easier to develop, build, and deploy apps. It provides a managed workflow, so you don't need to touch native code (Java/Kotlin for Android, Swift/Objective-C for iOS) for most use cases.

### Key Concepts for Beginners
-   **Components**: The building blocks of your UI (e.g., `<View>`, `<Text>`, `<Button>`).
-   **Props**: How you pass data from parent to child components.
-   **State**: How a component manages its own data (e.g., current dice value).
-   **Hooks**: Functions like `useState` and `useEffect` that let you use state and other React features.

## Project Structure

Here's a quick look at the project's file structure:

-   `App.tsx`: The main entry point of the application. Sets up navigation and providers.
-   `src/`: Contains the source code.
    -   `context/`: React Contexts for global state management (e.g., `ProfileContext`, `SettingsContext`).
    -   `theme.ts`: Centralized theme definitions (colors, styles).
    -   `types.ts`: TypeScript type definitions.
-   `screens/`: The main screens of the app (Roller, Collection, History, Settings).
-   `assets/`: Images, fonts, and other static assets.

## Technologies Used

-   **React Native**: Core framework.
-   **Expo**: Development platform.
-   **React Navigation**: For navigating between screens.
-   **Lucide React Native**: For icons.
-   **Expo Sensors & Haptics**: for shake detection and tactile feedback.
-   **Reanimated**: For smooth animations.
-   **Async Storage**: For persisting data locally.

---

Happy Rolling! 🎲

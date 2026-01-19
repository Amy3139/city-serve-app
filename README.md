# City Serve Monorepo 👋

This is a monorepo project managed with [Turborepo](https://turbo.build/). It contains multiple apps and shared packages.

## Structure

- `apps/`: Contains the applications.
  - `apps/volunteer-app`: The main volunteer mobile app (Expo).
- `packages/`: Shared libraries and configuration.
  - `packages/firebase`: Shared Firebase configuration and utilities.

## Get started

This project uses [Turborepo](https://turbo.build/) to manage the monorepo. It is recommended to run commands from the root directory.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   To start all apps (currently only `volunteer-app`):
   ```bash
   npm start
   ```

   To start specifically the `volunteer-app`:
   ```bash
   npm run volunteer-app
   ```

   Alternatively, use `turbo` directly:
   ```bash
   npx turbo dev
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

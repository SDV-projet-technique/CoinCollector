import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(248, 189, 42)",
    onPrimary: "rgb(64, 45, 0)",
    primaryContainer: "rgb(92, 67, 0)",
    onPrimaryContainer: "rgb(255, 223, 160)",
    secondary: "rgb(216, 196, 160)",
    onSecondary: "rgb(59, 47, 21)",
    secondaryContainer: "rgb(83, 69, 42)",
    onSecondaryContainer: "rgb(245, 224, 187)",
    tertiary: "rgb(177, 207, 169)",
    onTertiary: "rgb(29, 54, 27)",
    tertiaryContainer: "rgb(51, 77, 48)",
    onTertiaryContainer: "rgb(204, 235, 196)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(30, 27, 22)",
    onBackground: "rgb(233, 225, 216)",
    surface: "rgb(30, 27, 22)",
    onSurface: "rgb(233, 225, 216)",
    surfaceVariant: "rgb(77, 70, 57)",
    onSurfaceVariant: "rgb(208, 197, 180)",
    outline: "rgb(153, 143, 128)",
    outlineVariant: "rgb(77, 70, 57)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(233, 225, 216)",
    inverseOnSurface: "rgb(52, 48, 42)",
    inversePrimary: "rgb(121, 89, 0)",
    elevation: {
      level0: "transparent",
      level1: "rgb(41, 35, 23)",
      level2: "rgb(47, 40, 24)",
      level3: "rgb(54, 45, 24)",
      level4: "rgb(56, 46, 24)",
      level5: "rgb(61, 50, 25)",
    },
    surfaceDisabled: "rgba(233, 225, 216, 0.12)",
    onSurfaceDisabled: "rgba(233, 225, 216, 0.38)",
    backdrop: "rgba(54, 48, 36, 0.4)",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <SQLiteProvider databaseName="app.db">
        {/* <SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}> */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </PaperProvider>
  );
}

async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = (await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version")) || { user_version: 0 };
  console.log("currentDbVersion", currentDbVersion);
  console.log("DATABASE_VERSION", DATABASE_VERSION);
  // await db.execAsync(`
  // DROP TABLE IF EXISTS coins;
  // `);
  // console.log("droped");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  console.log("currentDbVersion", currentDbVersion);
  currentDbVersion = 0;
  console.log("currentDbVersion", currentDbVersion);
  if (currentDbVersion === 0) {
    await db.execAsync(`
  PRAGMA journal_mode = 'wal';
  CREATE TABLE coins ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      annee INTEGER NOT NULL,
      rarete TEXT NOT NULL,
      quantite INTEGER NOT NULL,
      valeur TEXT);
  `);
    await db.runAsync(
      "INSERT INTO coins (annee, rarete, quantite, valeur)",
      2021,
      "Rare",
      10,
      "[1.5, 2.0, 2.5]"
    );
    await db.runAsync(
      "INSERT INTO coins (annee, rarete, quantite, valeur)",
      2022,
      "Common",
      20,
      "[1.0, 1.5]"
    );
    currentDbVersion = 1;
    console.log("finished");
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

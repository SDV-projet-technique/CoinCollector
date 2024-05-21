import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { AppRegistry, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface Coin {
  id: number;
  annee: number;
  rarete: string;
  quantite: number;
  valeur: string;
}

export default function Index() {
  const db = SQLite.useSQLiteContext();
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      await db.withTransactionAsync(async () => {
        await db.execAsync(`
          PRAGMA journal_mode = 'wal';
          CREATE TABLE IF NOT EXISTS coins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            annee INTEGER NOT NULL,
            rarete TEXT NOT NULL,
            quantite INTEGER NOT NULL,
            valeur TEXT);
        `);

        const result = await db.getAllAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM coins"
        );
        if (result.length > 0 && result[0].count === 0) {
          await db.runAsync(
            "INSERT INTO coins (annee, rarete, quantite, valeur) VALUES (?, ?, ?, ?)",
            [2021, "Rare", 10, "[1.5, 2.0, 2.5]"]
          );
          await db.runAsync(
            "INSERT INTO coins (annee, rarete, quantite, valeur) VALUES (?, ?, ?, ?)",
            [2022, "Common", 20, "[1.0, 1.5]"]
          );
        }
      });

      const coinsResult = await db.getAllAsync<Coin>("SELECT * FROM coins");
      setCoins(coinsResult);
    };

    initializeDatabase();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Coins</Text>
      {coins.map((coin, index) => (
        <View key={index}>
          <Text>{coin.annee}</Text>
          <Text>{coin.rarete}</Text>
          <Text>{coin.quantite}</Text>
          <Text>{coin.valeur}</Text>
        </View>
      ))}
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => {
          console.log("Button pressed");
          db.getAllAsync<Coin>("SELECT * FROM coins").then((coins) => {
            console.log("coins", coins);
          });
        }}
      >
        Press me
      </Button>
    </View>
  );
}

AppRegistry.registerComponent("App", () => Index);

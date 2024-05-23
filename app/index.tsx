import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  AppRegistry,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { Card } from "react-native-paper";

interface Coin {
  id: number;
  name: string;
  annee: number;
  rarete: string;
  quantite: number;
  valeur: string;
  image: string;
}

export default function Index() {
  const db = SQLite.useSQLiteContext();
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      await db.withTransactionAsync(async () => {
        // await db.execAsync("DROP TABLE IF EXISTS coins");
        await db.execAsync(`
          PRAGMA journal_mode = 'wal';
          CREATE TABLE IF NOT EXISTS coins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            annee INTEGER NOT NULL,
            rarete TEXT NOT NULL,
            quantite INTEGER NOT NULL,
            valeurs TEXT,
            image TEXT
          );
        `);

        const result = await db.getAllAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM coins"
        );
        if (result.length > 0 && result[0].count === 0) {
          await db.runAsync(
            "INSERT INTO coins (name, annee, rarete, quantite, valeur, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
              "5 FRANCS OR - NAPOLÉON III TÊTE NUE",
              2021,
              "Rare",
              10,
              "[1.5, 2.0, 2.5]",
              "https://www.laposte.fr/ecom/occ/ecommerce/medias/sys_master/images/ha3/hd7/12607409586206/logo-euros-commemoratives/logo-euros-commemoratives.png",
            ]
          );
          await db.runAsync(
            "INSERT INTO coins (name, annee, rarete, quantite, valeur, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
              "10 FRANCS OR - NAPOLÉON III TÊTE NUE",
              2022,
              "Common",
              20,
              "[1.0, 1.5]",
              "https://goldunion.fr/cdn/shop/files/250-napo-face-off.png?v=1703878391&width=1080",
            ]
          );
        }
      });

      const coinsResult = await db.getAllAsync<Coin>("SELECT * FROM coins");
      setCoins(coinsResult);
    };

    initializeDatabase();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text>Coins:</Text>
        {coins.map((coin, index) => (
          <Card key={index} style={{ width: "60%", margin: 10 }}>
            <Card.Cover source={{ uri: coin.image }} />
            <Card.Title title={coin.name} key={index} />
            <Card.Content>
              <Text>Year: {coin.annee}</Text>
              <Text>Rarity: {coin.rarete}</Text>
              <Text>Quantity: {coin.quantite}</Text>
              <Text>Value: {JSON.parse(coin.valeur).pop()}€</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});

AppRegistry.registerComponent("App", () => Index);

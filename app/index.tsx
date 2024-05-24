import { Link } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  AppRegistry,
  Pressable,
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
  valeurs: string;
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
            "INSERT INTO coins (name, annee, rarete, quantite, valeurs, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
              "5 FRANCS OR - NAPOLÉON III TÊTE NUE",
              2001,
              "Rare",
              10,
              "[1.5, 2.0, 2.5]",
              "https://www.laposte.fr/ecom/occ/ecommerce/medias/sys_master/images/ha3/hd7/12607409586206/logo-euros-commemoratives/logo-euros-commemoratives.png",
            ]
          );
          await db.runAsync(
            "INSERT INTO coins (name, annee, rarete, quantite, valeurs, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
              "10 FRANCS OR - NAPOLÉON III TÊTE NUE",
              2001,
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
        {coins.length === 0 && <Text>Loading...</Text>}
        {coins.map((coin, index) => (
          <Link href={`/coins/${coin.id}`} key={index} asChild>
            <Pressable style={{ width: "60%", margin: 10 }}>
              <Card key={index}>
                <Card.Cover source={{ uri: coin.image }} />
                <Card.Title title={coin.name} key={index} />
                <Card.Content>
                  <Text>Year: {coin.annee}</Text>
                  <Text>Rarity: {coin.rarete}</Text>
                  <Text>Quantity: {coin.quantite}</Text>
                  <Text>Value: {JSON.parse(coin.valeurs).pop()}€</Text>
                </Card.Content>
              </Card>
            </Pressable>
          </Link>
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

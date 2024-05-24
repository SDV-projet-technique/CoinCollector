import { useLocalSearchParams, useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  // Card,
  Text,
} from "react-native-paper";

interface Coin {
  id: number;
  name: string;
  annee: number;
  rarete: string;
  quantite: number;
  valeurs: string;
  image: string;
}

export default function CoinInfo() {
  const db = SQLite.useSQLiteContext();
  const [coin, setCoin] = useState<Coin>({} as Coin);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      // headerShown: false,
      backButton: true,
      title: "Coin Info",
    });
    const getInfos = async () => {
      if (id) {
        const coinResult = await db.getFirstAsync<Coin>(
          "SELECT * FROM coins where id = ?",
          [Number(id)]
        );
        if (coinResult) {
          setCoin(coinResult);
        }
      }
    };

    getInfos();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LineChart
          data={{
            labels: ["2001", "2005", "2007", "2010", "2015", "2024"],
            datasets: [
              {
                data: [
                  Math.random() * 10,
                  Math.random() * 10,
                  Math.random() * 10,
                  Math.random() * 10,
                  Math.random() * 10,
                  Math.random() * 10,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="€"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
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

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function GamePage() {
  const router = useRouter();
  const { characters } = useLocalSearchParams();
  const characterList = JSON.parse(characters as string) as string[];

  const [initialView, setInitialView] = useState(true);
  const [hiddenStates, setHiddenStates] = useState<boolean[]>(
    Array(characterList.length).fill(false)
  );

  const toggleCharacter = (index: number) => {
    const updatedStates = [...hiddenStates];
    updatedStates[index] = !updatedStates[index];
    setHiddenStates(updatedStates);
  };

  if (initialView) {
    const randomCharacter =
      characterList[Math.floor(Math.random() * characterList.length)];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Random Character:</Text>
        <Text style={styles.randomCharacter}>{randomCharacter}</Text>
        <Button title="Go Back" onPress={() => router.push("/select-list")} />
        <Button
          title="OK"
          onPress={() => setInitialView(false)}
          color="green"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Grid</Text>
      <FlatList
        data={characterList}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={5}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.card,
              hiddenStates[index] && styles.hiddenCard,
            ]}
            onPress={() => toggleCharacter(index)}
          >
            {!hiddenStates[index] && <Text style={styles.cardText}>{item}</Text>}
          </TouchableOpacity>
        )}
      />
      <Button title="Go Back" onPress={() => router.push("/select-list")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  randomCharacter: { fontSize: 32, fontWeight: "bold", marginVertical: 20 },
  card: {
    width: 60,
    height: 60,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  hiddenCard: { backgroundColor: "#333" },
  cardText: { fontSize: 16 },
});



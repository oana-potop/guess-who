import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function SelectListPage() {
  const router = useRouter();
  const [lists, setLists] = useState<{ name: string; characters: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch lists from Firestore
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const docRef = doc(db, "lists", "nRFMctw2O65cJPBpXSjS"); // Replace with your document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedLists = Object.keys(data).map((key) => ({
            name: key, // Use the field name as the list name
            characters: data[key], // The array of characters
          }));
          setLists(fetchedLists);
        } else {
          console.error("Document does not exist!");
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const goToGame = (characters: string[]) => {
    // Check if the list has at least 25 characters
    if (characters.length < 25) {
      Alert.alert("Error", "The selected list must have at least 25 characters.");
      return;
    }

    // Randomly select 25 characters
    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    const selectedCharacters = shuffledCharacters.slice(0, 25);

    // Navigate to the Game page
    router.push({
      pathname: "/select-list/game",
      params: { characters: JSON.stringify(selectedCharacters) },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading lists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a List</Text>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => goToGame(item.characters)}
          >
            <Text style={styles.listName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  listName: { fontSize: 18 },
});

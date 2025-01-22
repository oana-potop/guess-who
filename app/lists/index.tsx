import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const darkTheme = {
  background: "#121212",
  cardBackground: "#1E1E1E",
  text: "#FFFFFF",
  secondaryText: "#BBBBBB",
  accent: "#00ADB5",
};

export default function ListsPage() {
  const [lists, setLists] = useState<{ name: string; characters: string[] }[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState("");
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const docRef = doc(db, "lists", "nRFMctw2O65cJPBpXSjS"); // Replace with your doc ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedLists = Object.keys(data).map((key) => ({
            name: key,
            characters: data[key],
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

  const handleAddCharacter = async () => {
    if (!selectedList || newCharacter.trim() === "") return;

    const currentCharacters =
      lists.find((list) => list.name === selectedList)?.characters || [];

    if (currentCharacters.includes(newCharacter)) {
      Alert.alert("Error", "Character already exists in the list.");
      return;
    }

    try {
      const docRef = doc(db, "lists", "nRFMctw2O65cJPBpXSjS"); // Replace with your doc ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedList = [...(data[selectedList] || []), newCharacter];

        await updateDoc(docRef, {
          [selectedList]: updatedList,
        });

        setLists((prevLists) =>
          prevLists.map((list) =>
            list.name === selectedList
              ? { ...list, characters: updatedList }
              : list
          )
        );
        setNewCharacter("");
        Alert.alert("Success", `Character added to ${selectedList}!`);
      }
    } catch (error) {
      console.error("Error adding character:", error);
      Alert.alert("Error", "Failed to add character.");
    }
  };

  const handleAddList = async () => {
    if (newListName.trim() === "") {
      Alert.alert("Error", "List name cannot be empty.");
      return;
    }

    if (lists.find((list) => list.name === newListName)) {
      Alert.alert("Error", "List with this name already exists.");
      return;
    }

    try {
      const docRef = doc(db, "lists", "nRFMctw2O65cJPBpXSjS"); // Replace with your doc ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        await updateDoc(docRef, {
          [newListName]: [],
        });

        setLists([...lists, { name: newListName, characters: [] }]);
        setNewListName("");
        Alert.alert("Success", `List "${newListName}" created!`);
      }
    } catch (error) {
      console.error("Error creating list:", error);
      Alert.alert("Error", "Failed to create list.");
    }
  };

  const renderCharacter = ({ item }: { item: string }) => (
    <Text style={styles.character}>{item}</Text>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Loading lists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Lists</Text>

      {/* New List Creation Section */}
      <TextInput
        placeholder="New List Name"
        placeholderTextColor={darkTheme.secondaryText}
        value={newListName}
        onChangeText={setNewListName}
        style={styles.input}
      />
      <Button title="Create New List" onPress={handleAddList} />

      {/* Lists Display */}
      <FlatList
        data={lists}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              selectedList === item.name && styles.selectedListItem,
            ]}
            onPress={() =>
              selectedList === item.name
                ? setSelectedList(null) // Deselect if already selected
                : setSelectedList(item.name)
            }
          >
            <Text style={styles.listName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.listContainer}
      />

      {selectedList && (
        <View style={styles.characterSection}>
          <Text style={styles.subtitle}>Characters in {selectedList}:</Text>
          <FlatList
            data={
              lists.find((list) => list.name === selectedList)?.characters || []
            }
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={renderCharacter}
            style={styles.characterList}
          />

          {/* Add Character Section */}
          <TextInput
            placeholder="Add a new character"
            placeholderTextColor={darkTheme.secondaryText}
            value={newCharacter}
            onChangeText={setNewCharacter}
            style={styles.input}
          />
          <Button title="Add Character" onPress={handleAddCharacter} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: darkTheme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: darkTheme.text,
    marginBottom: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: darkTheme.cardBackground,
    borderRadius: 5,
  },
  selectedListItem: {
    backgroundColor: darkTheme.accent,
  },
  listName: {
    fontSize: 18,
    color: darkTheme.text,
  },
  characterSection: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: darkTheme.text,
    marginVertical: 10,
  },
  characterList: {
    maxHeight: 300, // Makes it scrollable for long character lists
    marginBottom: 10,
  },
  character: {
    fontSize: 16,
    padding: 5,
    color: darkTheme.secondaryText,
  },
  input: {
    borderWidth: 1,
    borderColor: darkTheme.accent,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: darkTheme.text,
    backgroundColor: darkTheme.cardBackground,
  },
});

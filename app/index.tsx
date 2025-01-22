import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Button title="Go to Select List" onPress={() => router.push("/select-list")} />
      <Button title="Go to Lists" onPress={() => router.push("/lists")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  buttonStyle: {margin:10}
});

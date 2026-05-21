// src/View/Components/TodoInput.tsx
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { CreateTodoDTO } from "../../DTOs/CreateTodoDTO";

interface Props {
  onAdd: (dto: CreateTodoDTO) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      onAdd({ title: title.trim() });
      setTitle("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nouvelle tâche"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Ajouter" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 16 },
  input: { flex: 1, borderWidth: 1, marginRight: 8, padding: 8 },
});

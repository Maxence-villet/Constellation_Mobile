// src/View/Components/TodoItem.tsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Todo } from "../../Models/Todo";

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggle, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <Text
        style={{ textDecorationLine: todo.completed ? "line-through" : "none" }}
      >
        {todo.title}
      </Text>
      <Button title="✓" onPress={() => onToggle(todo)} />
      <Button title="✕" onPress={() => onRemove(todo)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "space-between",
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Messagerie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: Colors.light.darkBlue,
  },
});
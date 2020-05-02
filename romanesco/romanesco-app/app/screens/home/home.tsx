import React from 'react';
import { StyleSheet, Text, View, Button,  ScrollView } from 'react-native';

export function HomeScreen({ navigation}) {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Button
            title="Profile"
            color="#000"
            onPress={() => {
              navigation.navigate("Profile", {
              name: "testName",
              karma: 710,
            });
          }}
        />
        <Button
                  onPress={() => navigation.navigate("Feed")}
                  title="Feed"
                  color="#000"
                />
        <Button
                  onPress={() => navigation.navigate("Map")}
                  title="Map"
                  color="#000"
                />
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
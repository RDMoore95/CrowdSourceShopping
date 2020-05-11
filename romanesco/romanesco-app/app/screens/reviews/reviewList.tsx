import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,  ScrollView } from 'react-native';
import { ReviewFeed } from './components/reviewFeed';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


export default class ReviewList extends React.Component {
  //navigation = useNavigation();

  state = {
      
    }


    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

 render() {
  return (

        <View style={this.styles.container}>
            <ScrollView>
                

                
                <Button
                    title="Profile"
                    color="#000"
                    onPress={() => {
                      this.props.navigation.navigate("Profile", {
                      name: "testName",
                      karma: 710,
                    });
                  }}
                />
                <Button
                onPress={() => this.props.navigation.navigate("Map")}
                title="Map"
                color="#000"
                />
                <Button
                    title="Stores"
                    color="#000"
                    onPress={() => {
                      this.props.navigation.navigate("Stores", {
                    });
                  }}
                />
                <ReviewFeed></ReviewFeed>
            </ScrollView>
        </View>
    )
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
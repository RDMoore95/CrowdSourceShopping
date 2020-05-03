import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Button,  ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

var url = "http://127.0.0.1:5000/flask_api/time";
var url = "http://127.0.0.1:5000/flask_api/";
var url = "http://136.24.86.92/app/";
var url = "http://127.0.0.1:5000/";
var url = "http://136.24.86.92/";
var url = "http://192.168.1.2.:5000/getStores/";
// console.log(url);

//.json()

export default class Feed extends React.Component {
  //navigation = useNavigation();

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true
    };
  }

  state = {}

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }
   
 // render() {

 //  return (
 //        <View style={this.styles.container}>
 //            <ScrollView>    
 //                <Text>Name: {JSON.stringify("YOUR STORES PAGE")}</Text>
 //            </ScrollView>
 //        </View>
 //    )
 //  }

  componentDidMount() {
    fetch(url, {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             firstParam: 'user_id',
             secondParam: '121',
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.stores });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });       
  }

  // componentDidMount() {
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((response) => {
  //         console.log(response);
  //     })
  //     .then(console.log("Did something"))
  //     .catch((error) => console.log("My error is :", error))
  //     .finally(() => {
  //       this.setState({ isLoading: false });
  //     });
  // }

  // componentDidMount() {
  //   fetch('https://reactnative.dev/movies.json')
  //     .then((response) => response.json())
  //     .then((json) => {
  //       this.setState({ data: json.movies });
  //     })
  //     .catch((error) => console.error(error))
  //     .finally(() => {
  //       this.setState({ isLoading: false });
  //     });
  // }

//<Text>Name: {JSON.stringify('YOUR STORES PAGE')}</Text>

  render() {

    const { data, isLoading } = this.state;
    // const { data, isLoading } = this.state;

    console.log(JSON.stringify("Print something"));
    //console.log(JSON.stringify("On stores page"));    
    // console.log(JSON.stringify(response));
    //console.log(response);
    // console.log(error);

    return (

      <View style={styles.container}>

        <ScrollView>    
          <Text style={styles.title}>Your Favorite Stores:</Text>

        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <Text>{item.name}, {item.location}</Text>
            )}
          />
        )}

        </ScrollView>

      </View>
    );
  } 


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
    borderColor: "#20232a",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  }
});



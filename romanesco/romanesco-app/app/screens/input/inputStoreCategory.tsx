import React from 'react';
import { View, 
  Button,  
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { Block, Text, theme } from "galio-framework";
import { withNavigation } from 'react-navigation';
import ReadMore from 'react-native-read-more-text';
import Icon from 'react-native-vector-icons/Ionicons';

import Images from '../../../assets/imgs';

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

// var url = "http://192.168.1.7:5000";
var url = "http://flip1.engr.oregonstate.edu:5005";

export class InputStoreCategory extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        data: [],
        isLoading: true,
        refresh: false,
        firstRender: true,
      };
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: deviceWidth * 0.8,
              backgroundColor: "#fff",
            }}
          />
        );
      }

    // Get category entries
    componentDidMount() {
      fetch(url + '/getStoreCategory/', {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
           },
       }).then((response) => response.json())
        .then((json) => {
          this.setState({ data: json });
        }).finally(() => {
          this.setState({ isLoading: false });
        });       
    }

   renderSeparator = () => {
      return (
        <View style={{backgroundColor:'#fff', padding: 10}}></View>
      );
    };

   render() {

    const { isLoading } = this.state;

    return (  

    <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>
      {isLoading ? <ActivityIndicator/> : (

        <FlatList
          extraData={this.state.refresh} // Need this variable to change to force a refresh
          data={this.state.data}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent = { this.renderSeparator }
          renderItem={({ item }) => (

                <>

                <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                        this.props.navigation.navigate("InputStoreFeedback", {
                        store_feedback_category: item.store_feedback_category,
                        store_feedback_category_id: item.store_feedback_category_id,
                      });
                }}
                style={styles.TouchableOpacityStyle}>

                <View style={styles.feedBox}>

                    <Text numberOfLines={1} style={styles.headline}> 
                    {item.store_feedback_category}
                    </Text>

                </View>

                <View style={{backgroundColor:'#fff', padding: 5}}></View>

                </TouchableOpacity>
                
                </>
          )}

        />

      )}

    </View>

    );

  }
      
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(InputStoreCategory);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column',
    },
    col:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'row'
    },
    row:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column'
    },
    feedBox: {
      backgroundColor:'#fff'
      , paddingHorizontal: 6
      , paddingVertical: 12
      , marginHorizontal: theme.SIZES.BASE
      , borderColor: '#fff'
      , borderRadius: 10
      , borderWidth: 1
      , shadowColor: "black"
      , shadowOffset: { width: 0, height: 0 }
      , shadowRadius: 8
      , shadowOpacity: 0.2
      , zIndex: 2
    },
    feedBoxHeader: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReview: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReviewText: {
      backgroundColor:'#fff'
      , padding: 3
      , flex: 0.9
    },
    feedBoxReviewVote: {
      backgroundColor:'#fff'
      , flex: 0.1
    },                    
    headline: {
       fontSize: 20,
       color:'#32325D',
       textAlign: 'center',
       textAlignVertical: "center",
       paddingVertical: 15,
       width: deviceWidth * 0.75
    }
  });
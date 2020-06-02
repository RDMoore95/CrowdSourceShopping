import React from 'react';
import { View, 
  Button,  
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  TouchableHighlight,
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { Block, Text, theme } from "galio-framework";
import { withNavigation } from 'react-navigation';
import ReadMore from 'react-native-read-more-text';
import Icon from 'react-native-vector-icons/Ionicons';

import Images from '../../../assets/imgs';
import { appstyles } from '../../../styles/appStyle'

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

//var url = "localhost:5000";
var url = "http://flip1.engr.oregonstate.edu:5005";

export class FeedEntry extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        data: [],
        isLoading: true,
        refresh: false,
        firstRender: true,
      };
    }

    state = {}

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: deviceWidth * 0.8,
              backgroundColor: "#000",
            }}
          />
        );
      }

    // Used to render "Read More" when review text overflows
    _renderTruncatedFooter = (handlePress) => {
      return (
        <Text style={{marginTop: 5}} onPress={handlePress}>
          Read more
        </Text>
      );
    }
    _renderRevealedFooter = (handlePress) => {
      return (
        <Text style={{marginTop: 5}} onPress={handlePress}>
          Show less
        </Text>
      );
    }
    _handleTextReady = () => {}

  // Get feed entries
  componentDidMount() {
    fetch(url + '/getFeedEntries/', {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             id_type: this.props.id_type,
             id_value: this.props.id_value,
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      }).finally(() => {
        this.setState({ isLoading: false });
      });       
  }

  // Set right colors for icons
  upVote(item) {

    // Flip value of downvote
    item.upVote = !item.upVote;
    // Set downvote to zero
    item.downVote = 0;
    // Force a refresh
    this.setState({ refresh: !this.state.refresh})
    return item
  
  }

  downVote(item) {

    // Flip value of downvote
    item.downVote = !item.downVote;
    // Set upvote to zero
    item.upVote = 0;
    // Force a refresh
    this.setState({ refresh: !this.state.refresh})
    return item

  }

 renderSeparator = () => {
    return (
      <View style={{backgroundColor:'#fff', flex:1 ,padding: 10}}></View>
    );
  };


   // Render each feed entry in a flatlist
   render() {

    // Assign upvotes and downvotes to 0
    // Only want to do this oncee, so use firstRender 
    if( this.state.firstRender ){

      // Add upvote and downvote flags 
      this.state.data.map(function(item) {
        return item['upVote'] = 0
      })
      this.state.data.map(function(item) {
        return item['downVote'] = 0
      })

      this.setState({ firstRender: !this.state.firstRender})

    }


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

                <View style={appstyles.feedBox}>

                  <View style={appstyles.feedBoxHeader}>
                    <Avatar
                    rounded
                    source = {Images.reputation[item.user_reputation_category_id]}
                    // source={require('../../../assets/imgs/L2.jpg')}
                    onPress={() => {
                        this.props.navigation.navigate("Profile"), {
                        user_id: item.user_id,
                      };}}
                     />  
                    <Text numberOfLines={1} style={appstyles.headline}> 
                    {item.first_name} shopped {item.store_name} on {item.time_added.slice(0,10)}
                    </Text>
                  </View>  
                  
                  <View style={{backgroundColor:'#fff', padding: 3}}></View>

                  <View style={appstyles.feedBoxReview}>

                    <View style={appstyles.feedBoxReviewText}>

                    <Text size={16} color="#32325D">Feedback Type: {item.store_feedback_category}</Text>
                    <View style={{backgroundColor:'#fff', flex:1 ,padding: 1.5}}></View>
                    <ReadMore numberOfLines={3}
                    renderTruncatedFooter = {this._renderTruncatedFooter}
                    renderRevealedFooter = {this._renderRevealedFooter}
                    onReady={this._handleTextReady}
                    >
                    <Text size={16} color="#32325D">
                    {item.store_feedback_text}
                    </Text>
                    </ReadMore>

                   </View>

                   <View style={appstyles.feedBoxReviewVote}>

                    <Icon name="ios-thumbs-up" size={25} color={(item.upVote > 0) ? '#FFD500' : '#5E72E4'}
                      onPress={()=>{ item = this.upVote(item)}}
                    />
                    <Icon name="ios-thumbs-down" size={25} color={(item.downVote > 0) ? '#FFD500' : '#5E72E4'}
                      onPress={()=>{ item = this.downVote(item)} }
                    />

                   </View> 

                  </View>

                </View>
                
                </>
          )}

        />

      )}

    </View>

    );

  }
      
}

// My experience was ABSOLUTELY great/terrible! 
// Writing a longer placeholder review so we know how it will display and make sure the text cuts off after three long long lines

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(FeedEntry);


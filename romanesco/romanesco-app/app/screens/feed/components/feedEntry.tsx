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

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

// export function FeedEntry( props ) {
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
              // width: "100%",
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
        fetch('http://flip1.engr.oregonstate.edu:4545/feedEntries')
        .then((response) => response.json())
        .then((json) => {this.setState({ data: json });})
        .catch((error) => console.error(error))
        .finally(() => {this.setState({ isLoading: false });})
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


   // Render each feed entry in a flatlist
   render() {

    // Assign upvotes and downvotes to 0
    // Only want to do this oncee, so use firstRender 
    if( this.state.firstRender ){

      // console.warn("First render")

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

    <View style={{ flex: 1, padding: 5, width: deviceWidth * 0.98 }}>
      {isLoading ? <ActivityIndicator/> : (

        <FlatList
          extraData={this.state.refresh} // Need this variable to change to force a refresh
          data={this.state.data}
          //ItemSeparatorComponent = {FlatListItemSeparator}
          renderItem={({ item }) => (

                <>

                <View style={styles.feedBox}>

                  <View style={styles.feedBoxHeader}>
                    <Avatar
                    rounded
                    source={require('../../../assets/imgs/romanescoicon.png')}
                    onPress={() => {
                        this.props.navigation.navigate("storeProfile"), {
                        name: "testName",
                        karma: 710,
                      };}}
                     />  
                    <Text numberOfLines={1} style={styles.headline}> 
                    {item.first_name} shopped {item.store_name} on {item.time_added.slice(0,10)}
                    </Text>
                  </View>  
                  
                  <View style={{backgroundColor:'#F7FAFC', padding: 3}}></View>

                  <View style={styles.feedBoxReview}>

                    <View style={styles.feedBoxReviewText}>

                    <Text size={16} color="#32325D">Feedback Type: {item.store_feedback_category}, {item.store_feedback_text}</Text>
                    <View style={{backgroundColor:'#F7FAFC', flex:1 ,padding: 1.5}}></View>
                    <ReadMore numberOfLines={3}
                    renderTruncatedFooter = {this._renderTruncatedFooter}
                    renderRevealedFooter = {this._renderRevealedFooter}
                    onReady={this._handleTextReady}
                    >
                    <Text size={16} color="#32325D">My experience was ABSOLUTELY great/terrible! 
                    Writing a longer placeholder review so we know how it will display and make sure the text cuts off after three long long lines
                    </Text>
                    </ReadMore>

                   </View>

                   <View style={styles.feedBoxReviewVote}>

                    <Icon name="ios-thumbs-up" size={25} color={(item.upVote > 0) ? '#FFD500' : '#5E72E4'}
                      onPress={()=>{ item = this.upVote(item)}}
                    />
                    <Icon name="ios-thumbs-down" size={25} color={(item.downVote > 0) ? '#FFD500' : '#5E72E4'}
                      onPress={()=>{ item = this.downVote(item)} }
                    />

                   </View> 

                  </View>

                  <View style={{backgroundColor:'#F7FAFC', flex:1 ,padding: 3}}></View>

                </View>
                
                <View style={{backgroundColor:'#fff', flex:1 ,padding: 3}}></View>
                
                </>
          )}

        />

      )}

    </View>

    );

  }
      
}


// <TouchableHighlight
//     onPress={()=>{console.log("pressed");}}
//     onShowUnderlay={()=>this.setState({touchableHighlightMouseDown:true})}
//     onHideUnderlay={()=>this.setState({touchableHighlightMouseDown:false})}>
//     <View>
//     <Icon name="ios-thumbs-up" size={25} color={this.state.isCompleted ? '#1DA664' : '#DE5347'}/>
//     </View>
// </TouchableHighlight>



// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(FeedEntry);

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
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
    },
    feedBoxHeader: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReview: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReviewText: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flex: 0.9
    },
    feedBoxReviewVote: {
      backgroundColor:'#F7FAFC'
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flex: 0.1
    },                    
    headline: {
       fontSize: 14,
       color:'#32325D',
       textAlign: 'left',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });







import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const deviceWidth = Dimensions.get('window').width

const darkGreen = "336600"
const midGreen = "#ccff33"
const lightGreen = "#ccffcc"
const darkBeige = "#ffffcc"
const lightBeige = "#fffffc"

export const appstyles = StyleSheet.create({
        // container 
    /*
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    */
    
    seperator: {
        backgroundColor:'#fff', 
        flex:1 ,
        padding: 10
    },
    
    container: {
        flex: 1,
        backgroundColor: '#5E72E4',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        flexDirection: 'column',
      },
  // floating button 
      TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        //backgroundColor:'black'
      },
      // shopping list button + row
      listButton: {

        width: width * .8,
        height: height * .1,
        //color: 
    },
    listRow: {
        width: width*.85,
        flexDirection: 'row',
        alignContent: 'stretch',
        justifyContent: 'space-between'
      },
      // profile
    profile: {
    //marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: height * .1,
    marginHorizontal: width * .1,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    //backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  // modal start?
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  // modal start?
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    //backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    //color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }, 
  input: {
    width: 350,
    height: 55,
    //backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  // col + row? 
  // feed?
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
    //backgroundColor: '#5E72E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    flexDirection: 'column'
  },
  feedBox: {
    //backgroundColor:'#F7FAFC',
    padding: 3
    //, borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
  },
  feedBoxHeader: {
    //backgroundColor:'#F7FAFC', 
    padding: 3,
    //borderColor: '#F7FAFC',
    borderRadius: 25, 
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center'
  },    
  feedBoxReview: {
    //backgroundColor:'#F7FAFC', 
    padding: 3, 
    //borderColor: '#F7FAFC', 
    borderRadius: 25, 
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center'
  },    
  feedBoxReviewText: {
    //backgroundColor:'#F7FAFC', 
    padding: 3, 
    //borderColor: '#F7FAFC', 
    borderRadius: 25, 
    borderWidth: 1, 
    flex: 0.9
  },
  feedBoxReviewVote: {
    //backgroundColor:'#F7FAFC', 
    //borderColor: '#F7FAFC', 
    borderRadius: 25, 
    borderWidth: 1, 
    flex: 0.1
  },                    
  headline: {
     fontSize: 14,
     //color:'#32325D',
     textAlign: 'left',
     textAlignVertical: "center",
     paddingLeft: 10,
     width: deviceWidth * 0.75
  },
  storeHeadline: {
     fontSize: 20,
     //color:'#32325D',
     textAlign: 'left',
     textAlignVertical: "center",
     paddingLeft: 10,
     width: deviceWidth * 0.75
  },
  // shopping list
    tag1: {
        flex: 1, 
        //color: theme.COLORS.LIGHT_GREEN,
    },
    }
  );

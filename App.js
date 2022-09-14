import React, {useState, useEffect, Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Picker} from '@react-native-picker/picker';

import { Animated, Dimensions, Keyboard, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment'

const MERCHANT_CHAR_LIM = 15
const NUM_TRANSACTIONS = 15
const {State: TextInputState} = TextInput;
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

// changing moment.js default print values to shorthand
moment.updateLocale('en', {
    relativeTime : {
        s:  '%d s',
        m:  '1 m',
        mm: '%d m',
        h:  '1 h',
        hh: '%d h',
        d:  '1 d',
        dd: '%d d',
        ww: '%d w',
        M:  '4 w',
        MM: function(num) {
                return num * 4 + ' w' // months to weeks
            },
        YY: '%d y',
    }
});

function HomeScreen ({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    // TODO: add riley or determine user
    const [data, setData] = useState({unclaimed : [], joint : [], vivian : [] });

    const loadTransactions = () => {
        return fetch( 'https://vrbudget.herokuapp.com')
            .then( (response) => response.json())
            .then( (responseJson) => {
                setData(responseJson);
                setLoading(false);
            } )
            .catch( (error) => {
                console.error(error);
            });
    }

    useEffect(() => {
      loadTransactions();
    }, []);

    // transactions sorted in descending order of date
    const unclaimed = [...data.unclaimed].sort( (a,b) => moment(b.date) - moment(a.date) );
    const joint = [...data.joint].sort( (a,b) => moment(b.date) - moment(a.date) );
    const personal = [...data.vivian].sort( (a,b) => moment(b.date) - moment(a.date) );

    // arrays for display on homepage
    const unclaimedTable = [];
    const jointTable = [];
    const personalTable = [];
    for (let i=0; i<Math.min(unclaimed.length, NUM_TRANSACTIONS); i++) {
        item = unclaimed[i];
        unclaimedTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
    }
    for (let i=0; i<Math.min(joint.length, NUM_TRANSACTIONS); i++) {
        item = joint[i];
        jointTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
    }
    for (let i=0; i<Math.min(personal.length, NUM_TRANSACTIONS); i++) {
        item = personal[i];
        personalTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
    }

    // could add loading bar
    if (isLoading) {
        return (
              <View style={ {flex: 1, padding: 20, backgroundColor: 'lightcyan'} }>
              </View>
        );
    }

    return (
        // TODO: textStyle throws warning
        <ScrollView style={styles.homeContainer}>
            <Table borderStyle = { styles.homeTable }>
                <Row data={ ['Unclaimed']} style={styles.head} textStyle={styles.headtext}/>
                {unclaimedTable.map( (item, i) => {
                   return (
                       <Row
                           key={i}
                           data={item}
                           textStyle={styles.text}
                           flexArr={[1, 2, 1]}
                           onPress = { () => navigation.navigate('Details', {info: unclaimed[i]} ) } />
                   );
                })}
            </Table>
            <Table borderStyle = { styles.homeTable }>
                <Row data={ ['Joint'] } style={styles.head} textStyle={styles.headtext}/>
                {jointTable.map( (item, i) => {
                   return (
                       <Row
                           key={i}
                           data={item}
                           textStyle={styles.text}
                           onPress = { () => navigation.navigate('Details', {info: joint[i]} ) } />
                   );
                })}
            </Table>
            <Table borderStyle = { styles.homeTable }>
                <Row data={ ['Personal'] } style={styles.head} textStyle={styles.headtext}/>
                {personalTable.map( (item, i) => {
                   return (
                       <Row
                           key={i}
                           data={item}
                           textStyle={styles.text}
                           onPress = { () => navigation.navigate('Details', {info: personal[i]} ) } />
                   );
                })}
            </Table>
        </ScrollView>
      );
}


function DetailsScreen ({ navigation, route }) {
    const {info} = route.params;
    const [budget, setBudget] = useState();
    const [category, setCategory] = useState();
    const [payer, setPayer] = useState();
    const [text, setText] = useState(); // TODO maybe use empty string?
    //state = {budget: '', budgetval: '',
    //         category: '', categoryval: '',
    //         payer: '', payerval: '',
    //         text: '',
    //         shift: new Animated.Value(0)}

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);

    //updateBudget = (label, value) => {
    //    if (value !== 0) {
    //        this.setState({budget:label})
    //    }
    //}
    //updateCategory = (label, value) => {
    //    if (value !== 0) {
    //        this.setState({category:label})
    //    }
    //}
    //updatePayer = (label, value) => {
    //    if (value !== 0) {
    //        this.setState({payer:label})
    //    }
    //}
     useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus("Keyboard Shown");
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus("Keyboard Hidden");
        });
    }, []); // what are the square brackets for? They seem optional.


    const tableData = [
           ['Merchant'],
           ['Payment'],
           ['Date'],
           ['Card']
         ]
    tableData[0].push( info.merchant)
    tableData[1].push(`$${info.payment}`)
    tableData[2].push( moment(info.date).format('MMM DD YY, HH:mm') )
    tableData[3].push(info.card_last_4)

        //<Animated.View style={ [styles.detailContainer, {transform: [{translateY:shift}]}] }>
    return (
        <Animated.View style={ [styles.detailContainer] }>
            <Table borderStyle = { {borderWidth: 1, borderColor: 'mediumturquoise'}}>
                  <Row data ={['Transaction Details']} style={styles.head} textStyle={styles.headtext} />
                  <Rows data = {tableData} textStyle={styles.text} />
            </Table>

            <View style = {{alignItems: 'center', paddingTop: 0.05*HEIGHT}}>
                <Picker
                    style={styles.picker}
                    selectedValue={budget}
                    onValueChange={(itemValue, itemIndex) =>
                        setBudget(itemValue)
                    }>
                    <Picker.Item label="Please select a budget" value="0" />
                    <Picker.Item label="Joint" value="joint" />
                    <Picker.Item label="Personal" value="personal" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) =>
                        setCategory(itemValue)
                    }>
                    <Picker.Item label="Please select a category" value="0" />
                    <Picker.Item label="Housemates" value="housemates" />
                    <Picker.Item label="Groceries" value="groceries" />
                    <Picker.Item label="Entertainment" value="entertainment" />
                    <Picker.Item label="Vacation" value="vacation" />
                    <Picker.Item label="Auto" value="auto" />
                    <Picker.Item label="Misc" value="misc" />
                    <Picker.Item label="Charity" value="charity" />
                </Picker>
                <Picker
                    style={styles.picker}
                    selectedValue={payer}
                    onValueChange={(itemValue, itemIndex) =>
                        setPayer(itemValue)
                    }>
                    <Picker.Item label="Please select who paid" value="0" />
                    <Picker.Item label="Riley" value="riley" />
                    <Picker.Item label="Vivian" value="vivian" />
                </Picker>
            </View>

                </Animated.View>
    );
    //<View style = {{alignItems: 'center', paddingTop: 20}} >
            //    <TextInput
            //        style = {styles.textbox}
            //        multiline = {true}
            //        numberOfLines = {4}
            //        placeholder = "Notes and other details"
            //        onChangeText={(text) => this.setState({text})}
            //    />
            //</View>

    //handleKeyboardDidShow = (event) => {
    //    const {height: windowHeight} = Dimensions.get('window');
    //    const keyboardHeight = event.endCoordinates.height;
    //    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    //    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
    //        const fieldHeight = height;
    //        const fieldTop = pageY;
    //        const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
    //        if (gap >= 0) {
    //            return;
    //        }
    //        Animated.timing(
    //            this.state.shift,
    //            {
    //                toValue: gap,
    //                duration: 100,
    //                useNativeDriver: true,
    //            }
    //        ).start();
    //    });
    //}

    //handleKeyboardDidHide = () => {
    //    Animated.timing(
    //        this.state.shift,
    //        {
    //            toValue: 0,
    //            duration: 100,
    //            useNativeDriver: true,
    //        }
    //    ).start();
    //}
}

class SpendingScreen extends React.Component {
    render() {
        return (
            <View>
                <Text> Spending information here! </Text>
            </View>
        );
    }
}


const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            //screenOptions={{
            //    headerShown: false
            //}}
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
            />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
            />
        </Stack.Navigator>
    );
}

// TODO: find equivalent of defaultNavigationOptions
//    Stack: createStackNavigator({
//        Home: HomeScreen,
//        Details: DetailsScreen,
//      },
//      {
//        initialRouteName: 'Home',
//        defaultNavigationOptions: {
//            header: null,
//        }
//      }),


export default function App() {
    return (
        <NavigationContainer>{
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {paddingTop: 0.03*HEIGHT},
                }}
            >
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Spending" component={SpendingScreen} />
            </Tab.Navigator>
        }</NavigationContainer>
    );
}

const styles = StyleSheet.create({
    detailContainer: {
        flex: 1,
        backgroundColor: 'lightcyan',
        paddingTop: 22,
    },
    head: {height: 40, backgroundColor: 'mediumturquoise'},
    headtext: {margin: 6, fontSize: 20, fontWeight: 'bold'},
    homeContainer: {
        flex: 1,
        backgroundColor: 'lightcyan',
        paddingTop: 22,
    },
    homeTable: {
        borderWidth: 2,
        borderColor: 'transparent',
    },
    picker: {
        height:0.08*HEIGHT,
        width: 0.85*WIDTH,
    },
    text: {margin: 6, fontSize: 18},
    textbox: {
        height:0.15*HEIGHT,
        width: 0.85*WIDTH,
        borderWidth: 1,
        padding: 10},
});

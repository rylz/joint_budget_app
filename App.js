import React, {useState, useEffect, Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Picker} from '@react-native-picker/picker';

import {Dimensions, Keyboard, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DataTable} from 'react-native-paper';
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
              <View style={ {flex: 1, padding: 20} }>
              </View>
        );
    }

    return (
      <ScrollView>
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Unclaimed</DataTable.Title>
            </DataTable.Header>

            {unclaimedTable.map( (item, i) => {
                return (
                    <DataTable.Row onPress = { () => navigation.navigate('Transaction Details', {info: unclaimed[i]} ) } >
                         <DataTable.Cell>{item[0]}</DataTable.Cell>
                         <DataTable.Cell>{item[1]}</DataTable.Cell>
                         <DataTable.Cell>{item[2]}</DataTable.Cell>
                    </DataTable.Row>
                );
            })}

            <DataTable.Header>
                <DataTable.Title>Joint</DataTable.Title>
            </DataTable.Header>

            {jointTable.map( (item, i) => {
                return (
                    <DataTable.Row onPress = { () => navigation.navigate('Transaction Details', {info: unclaimed[i]} ) } >
                         <DataTable.Cell>{item[0]}</DataTable.Cell>
                         <DataTable.Cell>{item[1]}</DataTable.Cell>
                         <DataTable.Cell>{item[2]}</DataTable.Cell>
                    </DataTable.Row>
                );
            })}

            <DataTable.Header>
                <DataTable.Title>Personal</DataTable.Title>
            </DataTable.Header>
            {personalTable.map( (item, i) => {
                return (
                    <DataTable.Row onPress = { () => navigation.navigate('Transaction Details', {info: unclaimed[i]} ) } >
                         <DataTable.Cell>{item[0]}</DataTable.Cell>
                         <DataTable.Cell>{item[1]}</DataTable.Cell>
                         <DataTable.Cell>{item[2]}</DataTable.Cell>
                    </DataTable.Row>
                );
            })}


        </DataTable>
      </ScrollView>
    );
}

function DetailsScreen ({ navigation, route }) {
    const {info} = route.params;
    const [budget, setBudget] = useState();
    const [category, setCategory] = useState();
    const [payer, setPayer] = useState();
    const [text, setText] = useState(); // TODO maybe use empty string?

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus("Keyboard Shown");
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus("Keyboard Hidden");
        });
    });

    return (
        <KeyboardAwareScrollView>
            <DataTable.Row>
                 <DataTable.Cell>Merchant</DataTable.Cell>
                 <DataTable.Cell>{info.merchant}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
                 <DataTable.Cell>Payment</DataTable.Cell>
                 <DataTable.Cell>{`$${info.payment}`}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
                 <DataTable.Cell>Date</DataTable.Cell>
                 <DataTable.Cell>{ moment(info.date).format('MMM DD YY, HH:mm') }</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
                 <DataTable.Cell>Card</DataTable.Cell>
                 <DataTable.Cell>{info.card_last_4}</DataTable.Cell>
            </DataTable.Row>

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

            <View style = {{alignItems: 'center', paddingTop: 20, paddingBottom: 500}} >
                <TextInput
                    style = {styles.textbox}
                    multiline = {true}
                    numberOfLines = {4}
                    placeholder = "Notes and other details"
                    onChangeText={(text) => setText({text})}
                />
            </View>
        </KeyboardAwareScrollView>

    );
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

function HomeTabs() {
    return (
        <Tab.Navigator
               screenOptions={{
                   tabBarStyle: {paddingTop: 0.03*HEIGHT},
               }}
           >
               <Tab.Screen name="HomeScreen" component={HomeScreen} />
               <Tab.Screen name="Spending" component={SpendingScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>{
            <Stack.Navigator
            >
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="HomeTabs"
                    component={HomeTabs}
                />
                <Stack.Screen
                    name="Transaction Details"
                    component={DetailsScreen}
                />
            </Stack.Navigator>
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

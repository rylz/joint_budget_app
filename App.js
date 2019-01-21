import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Animated, Dimensions, Keyboard, Picker, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment'


import {homepage, transaction} from './example_api_results.js'

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

// fetch('https://riley_server.com/mydata.json')
class HomeScreen extends React.Component {
    state = {
        unclaimedTable: [],
        jointTable: [],
        personalTable: []
    }
    render() {
        const state = this.state;
        const {navigate} = this.props.navigation;
        // for loop for each category, for each transaction
        for (let i=0; i<Math.min(homepage.unclaimed.length, NUM_TRANSACTIONS); i++) {
            item = homepage.unclaimed[i];
            state.unclaimedTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }
        for (let i=0; i<Math.min(homepage.joint.length, NUM_TRANSACTIONS); i++) {
            item = homepage.joint[i];
            state.jointTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }
        for (let i=0; i<Math.min(homepage.personal.length, NUM_TRANSACTIONS); i++) {
            item = homepage.personal[i];
            state.personalTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }
        return (
              <ScrollView style={styles.homeContainer}>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Unclaimed']} style={styles.head} textStyle={styles.headtext}/>
                      {state.unclaimedTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 flexArr={[1, 2, 1]}
                                 onPress = { () => navigate('Details', {info: homepage.unclaimed[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Joint'] } style={styles.head} textStyle={styles.headtext}/>
                      {state.jointTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: homepage.joint[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Personal'] } style={styles.head} textStyle={styles.headtext}/>
                      {state.personalTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: homepage.personal[i]} ) } />
                         );
                      })}
                  </Table>
            </ScrollView>
        );
    }
}

class DetailsScreen extends React.Component {
    state = {budget: '', budgetval: '',
             category: '', categoryval: '',
             payer: '', payerval: '',
             text: '',
             shift: new Animated.Value(0)}

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    updateBudget = (label, value) => {
        if (value !== 0) {
            this.setState({budget:label})
        }
    }
    updateCategory = (label, value) => {
        if (value !== 0) {
            this.setState({category:label})
        }
    }
    updatePayer = (label, value) => {
        if (value !== 0) {
            this.setState({payer:label})
        }
    }
    render() {
        const {info} = this.props.navigation.state.params;
        const {shift} = this.state;
        const tableData = [
               ['Merchant'],
               ['Payment'],
               ['Date'],
               ['Card']
             ]
        tableData[0].push(info.merchant)
        tableData[1].push(`$${info.payment}`)
        tableData[2].push( moment(info.date).format('MMM DD YY, HH:mm') )
        tableData[3].push(info.card_last_4)

        return (
            <Animated.View style={ [styles.detailContainer, {transform: [{translateY:shift}]}] }>
                <Table borderStyle = { {borderWidth: 1, borderColor: 'mediumturquoise'}}>
                      <Row data ={['Transaction Details']} style={styles.head} textStyle={styles.headtext}/>
                      <Rows data = {tableData} textStyle={styles.text} />
                </Table>

                <View style = {{alignItems: 'center', paddingTop: 0.05*HEIGHT}}>
                    <Picker
                        selectedValue={this.state.budget}
                        style={styles.picker}
                        onValueChange={this.updateBudget} >
                        <Picker.Item label="Please select a budget" value="0" />
                        <Picker.Item label="Joint" value="joint" />
                        <Picker.Item label="Personal" value="personal" />
                    </Picker>
                    <Picker
                        selectedValue={this.state.category}
                        style={styles.picker}
                        onValueChange={this.updateCategory}>
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
                        selectedValue={this.state.payer}
                        style={styles.picker}
                        onValueChange={this.updatePayer}>
                        <Picker.Item label="Please select who paid" value="0" />
                        <Picker.Item label="Riley" value="riley" />
                        <Picker.Item label="Vivian" value="vivian" />
                    </Picker>
                </View>

                <View style = {{alignItems: 'center', paddingTop: 20}} >
                    <TextInput
                        style = {styles.textbox}
                        multiline = {true}
                        numberOfLines = {4}
                        placeholder = "Notes and other details"
                        onChangeText={(text) => this.setState({text})}
                    />
                </View>
            </Animated.View>
        );
    }

    handleKeyboardDidShow = (event) => {
        const {height: windowHeight} = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 100,
                    useNativeDriver: true,
                }
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }
        ).start();
    }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
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

import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Alert, Button, Picker, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment'

import {homepage, transaction} from './example_api_results.js'

const MERCHANT_CHAR_LIM = 15

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
        for (let i=0; i<2; i++) {
            // TODO: sort by date
            if (homepage.unclaimed.length !== 0) {
                item = homepage.unclaimed[i];
                state.unclaimedTable.push([ moment(item.date).fromNow() , item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        for (let i=0; i<2; i++) {
            if (homepage.joint.length !== 0) {
                item = homepage.joint[i];
                state.jointTable.push([item.date, item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        for (let i=0; i<2; i++) {
            if (homepage.personal.length !== 0) {
              item = homepage.personal[i];
              state.personalTable.push([item.date, item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        return (
              <View style={styles.homeContainer}>
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
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
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
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
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
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
            </View>
        );
    }
}

class DetailsScreen extends React.Component {
    state = {budget: '', budgetval: '',
             category: '', categoryval: '',
             payer: '', payerval: '',
             text: 'Notes: '}
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
            <View style={styles.detailContainer}>
                <Table borderStyle = { {borderWidth: 1, borderColor: 'mediumturquoise'}}>
                      <Row data ={['Transaction Details']} style={styles.head} textStyle={styles.headtext}/>
                      <Rows data = {tableData} textStyle={styles.text} />
                </Table>

                <View style = {{alignItems: 'center', paddingTop: 30}}>
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
            </View>
        );
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
    homeContainer: {
        flex: 1,
        backgroundColor: 'lightcyan',
        paddingTop: 22,
    },
    head: {height: 40, backgroundColor: 'mediumturquoise'},
    headtext: {margin: 6, fontSize: 20, fontWeight: 'bold'},
    picker: {
        height: 50,
        width: 300,
    },
    text: {margin: 6, fontSize: 18},
    textbox: {height: 100, width: 300, borderWidth: 1, padding: 10},
});

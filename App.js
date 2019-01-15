import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Alert, Button, Picker, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';

import {homepage, transaction} from './example_api_results.js'

console.log(Object.keys(homepage["unclaimed"]))
// fetch('https://riley_server.com/mydata.json')
class HomeScreen extends React.Component {
    render() {
        const {navigate} = this.props.navigation;
        const unclaimedList = [];
        // for loop for each category, for each transaction
        for (let i=0; i<2; i++) {
            // sort by date, organize for sectionlist
            //console.log(homepage.unclaimed[i].txnid)
            //console.log(homepage.unclaimed[i].merchant)
            item = homepage.unclaimed[i];
            unclaimedList.push(item.date + ' ' + item.merchant + ' ' + item.payment)
        }
        //homepage["unclaimed"]
        return (
            <View style={styles.container}>
                <SectionList
                    sections={[
                        {title: 'Unclaimed', data: unclaimedList},
                        {title: 'Joint', data: ['Purchase2']},
                        {title: 'Personal', data: ['underwear']},
                    ]}
                    renderSectionHeader={ ({section}) => (
                        <Text style={styles.sectionHeader}>
                            {section.title}
                        </Text>
                    )}
                    renderItem = { ({item}) => <Text
                        style = {styles.item}
                        onPress = { () => navigate('Details', {name: item} )} > {item}
                      </Text>}
                    keyExtractor = {(item, index) => index}
                />
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
        const {params} = this.props.navigation.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Purchase Screen -- {params.name} </Text>
                <Picker
                    selectedValue={this.state.budget}
                    style={{ height: 50, width: 250 }}
                    onValueChange={this.updateBudget}>
                    <Picker.Item label="Please select a budget" value="0" />
                    <Picker.Item label="Joint" value="joint" />
                    <Picker.Item label="Personal" value="personal" />
                </Picker>
                <Picker
                    selectedValue={this.state.category}
                    style={{ height: 50, width: 250 }}
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
                    style={{ height: 50, width: 250 }}
                    onValueChange={this.updatePayer}>
                    <Picker.Item label="Please select who paid" value="0" />
                    <Picker.Item label="Riley" value="riley" />
                    <Picker.Item label="Vivian" value="vivian" />
                </Picker>
                <TextInput
                    onChangeText={(text) => this.setState({text})}
                    value = {this.state.text}
                />
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 22
        //justifyContent: 'space-evenly',
        //alignItems: 'center',
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247, 247, 247, 1.0)',
    },
    buttonContainer: {
        margin: 20
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

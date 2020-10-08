import React from 'react';
import {Component} from 'react';
import {TextInput, StyleSheet, ScrollView, View, Text, TouchableOpacity, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';


class AddOrder extends Component {
    state = {
        companyID: '',
        supplierID: '',
        address1: '',
        address2: '',
        address3: '',
        item:'',
        date: new Date(),
        quantity: '',
        description: '',
        pricePer: '',
        show: false,

        companyIDError: '',
        supplierIDError: '',
        addressError: '',
        itemError:'',
        quantityError: '',
        pricePerError: '',

        numberOrder:0,
        numberDraft:0
    };

    constructor() {
        super();
    }

    componentDidMount(): void {
        firebase.database().ref('Orders').on('value', (snapshot) => {
            this.setState({
                numberOrder: snapshot.numChildren()
            })
        });

        firebase.database().ref('Draft').on('value', (snapshot) => {
            this.setState({
                numberDraft: snapshot.numChildren()
            })
        })
    }

    showDatePicker = () => {
        this.setState({
            show: true,
        });
    };

    validateCompanyID = () => {
        if (this.state.companyID === '') {
            this.setState({
                companyIDError: 'Select Company ID!',
            });
            return false;
        } else {
            this.setState({
                companyIDError: '',
            });
            return true;
        }
    };

    validateSupplierID = () => {
        if (this.state.supplierID === '') {
            this.setState({
                supplierIDError: 'Select Supplier ID!',
            });
            return false;
        } else {
            this.setState({
                supplierIDError: '',
            });
            return true;
        }
    };

    validateAddress = () => {
        if (this.state.address1 === '' || this.state.address2 === '' || this.state.address3 === '') {
            this.setState({
                addressError: 'Address is required!',
            });
            return false;
        } else {
            this.setState({
                addressError: '',
            });
            return true;
        }
    };

    validateQuantity = () => {
        if (this.state.quantity === '') {
            this.setState({
                quantityError: 'Enter quantity of the order!',
            });
            return false;
        } else {
            this.setState({
                quantityError: '',
            });
            return true;
        }
    };

    validatePricePer = () => {
        if (this.state.pricePer === '') {
            this.setState({
                pricePerError: 'Enter item price per 1 quantity',
            });
            return false;
        } else {
            this.setState({
                pricePerError: '',
            });
            return true;
        }
    };

    validateItem = () => {
        if (this.state.item === '') {
            this.setState({
                itemError: 'Enter item!',
            });
            return false;
        } else {
            this.setState({
                itemError: '',
            });
            return true;
        }
    };

    toOrder = () => {
        let cID = this.validateCompanyID();
        let sID = this.validateSupplierID();
        let qu = this.validateQuantity();
        let pp = this.validatePricePer();
        let add = this.validateAddress();
        let it = this.validateItem();
        if (cID && sID && qu && pp && add && it) {
            let ID = this.generateOrderId();
                firebase.database().ref('Orders/' + ID).set({
                    companyID: this.state.companyID,
                    supplierID: this.state.supplierID,
                    item:this.state.item,
                    address: this.state.address1+", "+ this.state.address2+", "+ this.state.address3,
                    date: this.state.date.toString(),
                    quantity: this.state.quantity,
                    description: this.state.description,
                    pricePerUnit: this.state.pricePer,
                    status: "Pending"
                }).then(() => {
                    console.log('Inserted');
                    this.props.navigation.navigate('OrderList')
                }).catch(() => {
                    console.log('Error');
                });
        }
    };

    toOrderDraft = () => {
        let ID = this.generateDraftId();
        firebase.database().ref('Draft/' + ID).set({
            companyID: this.state.companyID,
            supplierID: this.state.supplierID,
            item: this.state.item,
            addressNo: this.state.address1,
            addressRoad: this.state.address2,
            addressCity:this.state.address3,
            date: this.state.date,
            quantity: this.state.quantity,
            description: this.state.description,
            pricePerUnit: this.state.pricePer,
        }).then(() => {
            console.log(this.state.date);
        }).catch(() => {
            console.log('Error');
        });
    };

    generateOrderId = () => {
        return  "ORD-" + (this.state.numberOrder+1)
    };

    generateDraftId = () => {
        return  "DRF-" + (this.state.numberDraft+1)
    };

    render() {
        return (
            <View style={styles.container}>
                <Icon
                    style={{ paddingLeft: 10 }}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.topic}>Add Order</Text>

                    <Text style={styles.inputLabel}>Company ID</Text>
                    <Picker
                        selectedValue={this.state.companyID}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({companyID: itemValue}, () => {
                                this.validateCompanyID();
                            });
                        }
                        }>
                        <Picker.Item label="select one" value=""/>
                        <Picker.Item label="Pearson" value="Pearson"/>
                        <Picker.Item label="Virtusa" value="Virtusa"/>
                    </Picker>
                    <Text style={styles.errorMsg}>{this.state.companyIDError}</Text>

                    <Text style={styles.inputLabel}>Item</Text>
                    <Picker
                        selectedValue={this.state.item}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({item: itemValue}, () => {
                                this.validateCompanyID();
                            });
                        }
                        }>
                        <Picker.Item label="select one" value=""/>
                        <Picker.Item label="Cement" value="Cement"/>
                        <Picker.Item label="Steel" value="Steel"/>
                        <Picker.Item label="River Sand" value="River Sand"/>
                        <Picker.Item label="Wood" value="Wood"/>
                    </Picker>
                    <Text style={styles.errorMsg}>{this.state.itemError}</Text>

                    <Text style={styles.inputLabel}>Supplier name</Text>
                    <Picker
                        selectedValue={this.state.supplierID}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({supplierID: itemValue}, () => {
                                this.validateSupplierID();
                            });
                        }

                        }>
                        <Picker.Item label="select one" value=""/>
                        <Picker.Item label="A" value="A"/>
                        <Picker.Item label="B" value="B"/>
                    </Picker>
                    <Text style={styles.errorMsg}>{this.state.supplierIDError}</Text>

                    <Text style={styles.inputLabel}>Address of the Site</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               placeholder="No:"
                               onChangeText={(text) => this.setState({address1: text})}/>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               placeholder="Line 01"
                               onChangeText={(text) => this.setState({address2: text})}/>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               placeholder="Line 02"
                               onChangeText={(text) => {
                                   this.setState({address3: text}, () => {
                                       this.validateAddress();
                                   });
                               }
                               }/>
                    <Text style={styles.errorMsg}>{this.state.addressError}</Text>

                    <Text style={styles.inputLabel}>Date<Text
                        style={{fontWeight: 'bold'}}>  {this.state.date.toDateString()}</Text></Text>
                    <View style={styles.button}><Button style={styles.button} onPress={this.showDatePicker}
                                                        title="add Date"/></View>

                    {this.state.show && (<DateTimePicker
                        style={{width: 200}}
                        value={this.state.date}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => {
                            this.setState({date: date}, () => {
                                this.setState({
                                    show: false,
                                });
                            });
                        }}
                    />)}

                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput style={styles.input}
                               keyboardType='numeric'
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               onChangeText={(text) => {
                                   this.setState({quantity: text}, () => {
                                       this.validateQuantity();
                                   });
                               }
                               }
                               secureTextEntry={true}/>
                    <Text style={styles.errorMsg}>{this.state.quantityError}</Text>

                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               onChangeText={(text) => this.setState({description: text})}
                               />

                    <Text style={styles.inputLabel}>Price of a Item</Text>
                    <TextInput style={styles.input}
                               keyboardType='numeric'
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               onChangeText={(text) => {
                                   this.setState({pricePer: text}, () => {
                                       this.validatePricePer();
                                   });
                               }
                               }
                               />
                    <Text style={styles.errorMsg}>{this.state.pricePerError}</Text>


                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            () => this.toOrder()
                        }>
                        <Text style={styles.submitButtonText}> Submit </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            () => this.toOrderDraft()
                        }>
                        <Text style={styles.submitButtonText}> Save draft </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    loginText: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
        paddingTop: 30,
    },
    inputLabel: {
        marginLeft: 10,
        fontSize: 17,
        paddingTop: 25,
    },
    errorMsg: {
        marginLeft: 15,
        color: '#800000',
    },
    input: {
        //margin: 15,
        margin: 5,
        width: 200,
        height: 40,
        borderColor: '#000000',
        borderRadius: 10,
        textAlign: 'center',
        borderWidth: 1,
    },
    submitButton: {
        backgroundColor: '#0093F6',
        padding: 10,
        margin: 15,
        width: '60%',
        height: 40,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    registerLink: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    scrollView: {
        paddingTop: 20,
    },
    button: {
        width: '40%',
        marginLeft: 10,
    },
});

export default AddOrder;

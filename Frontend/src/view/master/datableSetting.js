import React, {Component} from 'react'
import {View, StyleSheet, Switch, ImageBackground, Text, TextInput, ScrollView, Alert} from "react-native";
import CheckBox from 'react-native-checkbox';
import Picker from 'react-native-picker';
import SubmitBtn from "../../components/submitButton";
import API from "../../static/methods";
import ReactNative from "react-native";

let width = API.width;
let height = API.height;

let data = [];
for (let i = 0; i < 24; i++) {
    data.push(i + ' : 00');
}


export default class DatableSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: [false, false, false, false, false, false, false],
            openState: false,
            promptText: '开启预约功能',
            isSelect: false,
            startTime: '8 : 00',
            endTime: '17 : 00',
            place: '',
        };
    }

    componentDidMount() {
        this.fetchState();
    }

    async fetchState() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/master/state', formData}));

            console.log('!!!!!!!!!!!!!!');

            if (response.status === 200) {
                let responseJson = await response.json();
                console.log(responseJson);
                this.setState({
                    openState: responseJson.state,
                });

                if (responseJson.state) {
                    response = await API._fetch(API.GET({url: '/user/schedule/self', formData}));
                    console.log(response);
                    responseJson = await response.json();
                    console.log(responseJson);
                    let newCheck = [responseJson.Sunday ? true : false, responseJson.Monday ? true : false, responseJson.Tuesday ? true : false, responseJson.Wednesday ? true : false, responseJson.Thursday ? true : false, responseJson.Friday ? true : false, responseJson.Saturday ? true : false];
                    this.setState({
                        isChecked: newCheck,
                        promptText: '关闭预约功能',
                        startTime: responseJson.startHour + ' : 00',
                        endTime: responseJson.endHour + ' : 00',
                        place: responseJson.location,
                    })
                }
            }
        } catch (error) {
            API.toastLong('操作失败');
        }
    }

    onChangeCheckBox(index, oldCheck) {
        let newCheck = [];

        for (let i = 0; i < 7; i++) {
            if (i !== index)
                newCheck.push(oldCheck[i]);
            else
                newCheck.push(!oldCheck[i]);
        }

        this.setState({
            isChecked: newCheck
        })
    }

    // prompt参数设置为0是开始时间，为1是结束时间
    setPicker(prompt) {
        Picker.init({
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择时间',
            pickerData: data,
            selectedValue: prompt === 0 ? [8] : [17],
            onPickerConfirm: data => {
                prompt === 0 ? this.setState({startTime: data[0]}) : this.setState({endTime: data[0]});
            },
            onPickerCancel: () => {
                API.toastLong('您已取消该操作');
            },
            onPickerSelect: data => {
                prompt === 0 ? this.setState({startTime: data[0]}) : this.setState({endTime: data[0]});
            }
        });

        Picker.show();
    }

    // 开启、关闭预约功能
    async changeState(value) {
        // value仅仅是true or false
        let formData = {};

        try {
            let response = {};
            if (value)
                response = await API._fetch(API.PUT({url: '/master/schedule', formData}));
            else
                response = await API._fetch(API.POST({url: '/master/schedule', formData}));

            if (response.status !== 200) {
                API.toastLong('网络问题');
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async postDate() {
        if (parseInt(this.state.startTime.split(' ')[0]) >= parseInt(this.state.endTime.split(' ')[0])) {
            Alert.alert('温馨提示','开始时间务必早于结束时间');
            return
        }
        if (this.state.place === '') {
            Alert.alert('信息不完整','预约地点不能为空');
            return
        }

        let formData = {
            'Sunday': this.state.isChecked[0] ? 1 : 0,
            'Monday': this.state.isChecked[1] ? 1 : 0,
            'Tuesday': this.state.isChecked[2] ? 1 : 0,
            'Wednesday': this.state.isChecked[3] ? 1 : 0,
            'Thursday': this.state.isChecked[4] ? 1 : 0,
            'Friday': this.state.isChecked[5] ? 1 : 0,
            'Saturday': this.state.isChecked[6] ? 1 : 0,
            'startHour': parseInt(this.state.startTime.split(' ')[0]),
            'endHour': parseInt(this.state.endTime.split(' ')[0]),
            'location': this.state.place
        };

        console.log(formData);
        try {
            let response = await API._fetch(API.POST({
                url: '/master/week',
                formData
            }));

            console.log(response);
            if (response.status !== 200) {
                API.toastLong('操作失败');
            }
            else
                this
                    .props
                    .navigation
                    .goBack();
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    _reset() {
        this.refs.scrollView.scrollTo({y: API.reset(0)});
    }

    _onFocus(refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(this.refs[refName]), API.reset(100), true);
        }, 100);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background}>
                    <ScrollView ref="scrollView">
                        <View style={{flexDirection: 'row', height: 40}}>
                            <Text style={{
                                textAlign: 'left',
                                color: '#fff',
                                width: width - 60,
                                fontSize: 18,
                                padding: 20
                            }}>{this.state.promptText}</Text>
                            <Switch value={this.state.openState} style={{width: 60, marginTop: 15}}
                                    onValueChange={(value) => {
                                        value === false ? this.setState({
                                            openState: value,
                                            promptText: '开启预约功能'
                                        }) : this.setState({openState: value, promptText: '关闭预约功能'});

                                        this.changeState(value);
                                    }}/>
                        </View>
                        <View style={{
                            marginTop: API.reset(20),
                            marginLeft: API.reset(40),
                            marginRight: API.reset(40),
                            marginBottom: API.reset(40),
                            borderRadius: 10,
                            backgroundColor: '#fff',
                            padding: API.reset(40),
                            paddingTop: API.reset(10),
                            paddingBottom: API.reset(20),
                            paddingHorizontal: API.reset(40),
                            display: this.state.openState ? 'flex' : 'none',
                        }}>
                            <Text style={styles.title}>可预约时间</Text>
                            <CheckBox
                                label='星期日'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[0]}
                                onChange={() => {
                                    this.onChangeCheckBox(0, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期一'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[1]}
                                onChange={() => {
                                    this.onChangeCheckBox(1, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期二'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[2]}
                                onChange={() => {
                                    this.onChangeCheckBox(2, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期三'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[3]}
                                onChange={() => {
                                    this.onChangeCheckBox(3, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期四'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[4]}
                                onChange={() => {
                                    this.onChangeCheckBox(4, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期五'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[5]}
                                onChange={() => {
                                    this.onChangeCheckBox(5, this.state.isChecked);
                                }}
                            />
                            <CheckBox
                                label='星期六'
                                labelStyle={styles.checkText}
                                checked={this.state.isChecked[6]}
                                onChange={() => {
                                    this.onChangeCheckBox(6, this.state.isChecked);
                                }}
                            />

                            <View style={{flexDirection: 'row'}}>
                                <Text style={{flex: 0.5, fontSize: 18, marginTop: 20, textAlign: 'left'}}>开始时间</Text>
                                <Text style={{
                                    flex: 0.5,
                                    textAlign: 'right',
                                    marginTop: 20,
                                    marginRight: -10,
                                    fontSize: 18,
                                    color: '#333'
                                }}
                                      onPress={() => {
                                          this.setState({isSelect: true});
                                          this.setPicker(0);
                                      }}>{this.state.startTime}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 10}}>
                                <Text style={{flex: 0.5, fontSize: 18, marginTop: 20, textAlign: 'left'}}>结束时间</Text>
                                <Text style={{
                                    flex: 0.5,
                                    textAlign: 'right',
                                    marginTop: 20,
                                    marginRight: -10,
                                    fontSize: 18,
                                    color: '#333'
                                }}
                                      onPress={() => {
                                          this.setState({isSelect: true});
                                          this.setPicker(1);
                                      }}>{this.state.endTime}</Text>
                            </View>

                            <Text style={styles.title}>可预约地点</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='请输入可预约地点'
                                placeholderTextColor='#858585'
                                ref="placeInput"
                                onBlur={this._reset.bind(this)}
                                onFocus={this._onFocus.bind(this, 'placeInput')}
                                onChangeText={(text) => this.setState({place: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                                value={this.state.place}
                            />
                            <SubmitBtn text={'确认'} onPress={() => {
                                this.postDate();
                            }}/>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        background: {
            width: width,
            height: height,
        },
        checkText: {
            textAlign: 'right',
            width: width - API.reset(190),
            fontSize: 18
        },
        title: {
            fontSize: 20,
            margin: 15,
            textAlign: 'center',
            marginTop: 20,
        },
        input: {
            fontSize: 16,
            marginBottom: 40,
        }
    }
);
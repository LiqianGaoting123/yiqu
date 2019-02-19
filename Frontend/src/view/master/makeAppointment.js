import React, {Component} from 'react'
import {View, StyleSheet, ImageBackground, Text, Alert} from "react-native";
import Picker from 'react-native-picker';
import SubmitBtn from "../../components/submitButton";
import API from "../../static/methods";
import RadioForm from 'react-native-simple-radio-button';

let width = API.width;
let height = API.height;

let data = [];
for (let i = 0; i < 24; i++) {
    data.push(i + ' : 00');
}

export default class MakeAppointment extends Component {
    componentDidMount() {
        this.fetchTime();
    }

    async fetchTime() {
        // 根据艺术家id获得艺术家可预约时间
        let masterId = this.props.navigation.state.params.masterId;
        let formData = new FormData();
        try {
            let response = await API._fetch(API.GET({url: '/user/master/schedule/' + masterId, formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                let date = [];
                if (responseJson.Sunday)
                    date.push(0);
                if (responseJson.Monday)
                    date.push(1);
                if (responseJson.Tuesday)
                    date.push(2);
                if (responseJson.Wednesday)
                    date.push(3);
                if (responseJson.Thursday)
                    date.push(4);
                if (responseJson.Friday)
                    date.push(5);
                if (responseJson.Saturday)
                    date.push(6);

                if (date.length === 0) {
                    API.toastLong('抱歉，该艺术家近期没有空闲时间');
                    this
                        .props
                        .navigation
                        .goBack();
                    return
                }

                this.setState({
                    defaultStartTime: responseJson.startHour,
                    defaultEndTime: responseJson.endHour,
                    place: responseJson.location,
                    dates: date,
                    price: responseJson.price
                });

                response = await API._fetch(API.GET({url: '/master/week', formData}));
                let responseJson1 = await response.json();

                let newDateText = [];
                if (responseJson.Sunday)
                    newDateText.push(responseJson1.Sunday);
                if (responseJson.Monday)
                    newDateText.push(responseJson1.Monday);
                if (responseJson.Tuesday)
                    newDateText.push(responseJson1.Tuesday);
                if (responseJson.Wednesday)
                    newDateText.push(responseJson1.Wednesday);
                if (responseJson.Thursday)
                    newDateText.push(responseJson1.Thursday);
                if (responseJson.Friday)
                    newDateText.push(responseJson1.Friday);
                if (responseJson.Saturday)
                    newDateText.push(responseJson1.Saturday);

                // 设置选项
                let newRadioProps = [];
                for (let i = 0; i < this.state.dates.length; i++) {
                    newRadioProps = newRadioProps.concat({label: newDateText[i], value: i});
                }

                this.setState({
                    radioProps: newRadioProps,
                    dateText: newDateText,
                    date: newDateText[0],
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }


    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            // 艺术家设置的开始时间和结束时间
            defaultStartTime: 8,
            defaultEndTime: 17,
            place: '',
            dates: [1, 2, 3],

            // 客户设置的时间
            startTime: '8 : 00',
            endTime: '17 : 00',
            date: '',

            radioProps: {},
            dateText: [],
            price: 0,
        };

        this.confirm = this.confirm.bind(this);
        this.confirmDate = this.confirmDate.bind(this);
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
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                prompt === 0 ? this.setState({startTime: data[0]}) : this.setState({endTime: data[0]});
            }
        });

        Picker.show();
    }

    async confirmDate() {
        if (parseInt(this.state.startTime.split(' ')[0]) >= parseInt(this.state.endTime.split(' ')[0])) {
            Alert.alert('警告', '开始时间务必早于结束时间');
            return
        }
        if (parseInt(this.state.startTime.split(' ')[0]) < this.state.defaultStartTime) {
            Alert.alert('警告', '抱歉，艺术家设置的开始时间为' + this.state.defaultStartTime + ' : 00');
            return
        }
        if (parseInt(this.state.endTime.split(' ')[0]) > this.state.defaultEndTime) {
            Alert.alert('警告', '抱歉，艺术家设置的结束时间为' + this.state.defaultEndTime + ' : 00');
            return
        }

        Alert.alert('温馨提示', '预约此艺术家需要缴纳' + this.state.price + 'GAB', [
            {text: '取消', style: 'cancel'},
            {
                text: '确认', onPress: async function () {
                    await _this.confirm();
                }
            },
        ]);
    }

    async confirm() {
        let formData = {
            masterId: this.props.navigation.state.params.masterId,
            day: this.state.date,
            startHour: parseInt(this.state.startTime.split(' ')[0]),
            endHour: parseInt(this.state.endTime.split(' ')[0]),
            location: this.state.place
        };
        try {
            let response = await API._fetch(API.POST({url: '/user/master/dating', formData}));

            let responseJson = await response.json();

            console.log(responseJson);
            if (response.status === 403) {
                Alert.alert('温馨提示', '您今天已经提交过对该艺术家的预约了，请不要重复预约');
                _this.props.navigation.goBack();
            }
            else if(response.status !== 200){
                API.toastLong('请求失败');
            }
            else {
                this.props.navigation.navigate('Pay', {
                    orderId: responseJson.id, price: this.state.price, refresh: async function () {
                        _this.props.navigation.goBack();
                    },
                });
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background}>
                <View style={styles.container}>
                    <View style={{
                        marginTop: API.reset(20),
                        marginLeft: API.reset(40),
                        marginRight: API.reset(40),
                        marginBottom: API.reset(40),
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        padding: API.reset(40),
                        paddingTop: API.reset(15),
                        paddingBottom: API.reset(40),
                        paddingHorizontal: API.reset(40),
                    }}>
                        <Text style={styles.title}>预 约 时 间</Text>
                        <View style={{alignItems: 'center', alignContent: 'center'}}>
                            <RadioForm
                                radio_props={this.state.radioProps}
                                initial={0}
                                buttonSize={15}
                                labelStyle={{fontSize: 20, color: '#515151'}}
                                onPress={(value) => {
                                    this.setState({date: this.state.dateText[value]})
                                }}
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{
                                flex: 0.5,
                                fontSize: 18,
                                marginTop: API.reset(20),
                                textAlign: 'left'
                            }}>开始时间</Text>
                            <Text style={{
                                flex: 0.5,
                                textAlign: 'right',
                                marginTop: API.reset(20),
                                fontSize: 18,
                                color: '#333'
                            }}
                                  onPress={() => {
                                      this.setState({isSelect: true});
                                      this.setPicker(0);
                                  }}>{this.state.startTime}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: API.reset(10)}}>
                            <Text style={{
                                flex: 0.5,
                                fontSize: 18,
                                marginTop: API.reset(20),
                                textAlign: 'left'
                            }}>结束时间</Text>
                            <Text style={{
                                flex: 0.5,
                                textAlign: 'right',
                                marginTop: API.reset(20),
                                fontSize: 18,
                                color: '#333'
                            }}
                                  onPress={() => {
                                      this.setState({isSelect: true});
                                      this.setPicker(1);
                                  }}>{this.state.endTime}</Text>
                        </View>

                        <Text style={{
                            fontSize: 15,
                            marginHorizontal: API.reset(10),
                            textAlign: 'center',
                            color: '#9a9a9a',
                            marginTop: API.reset(5)
                        }}>艺术家可预约时间段为</Text>
                        <Text style={{
                            fontSize: 15,
                            marginHorizontal: API.reset(10),
                            textAlign: 'center',
                            color: '#9a9a9a',
                            marginTop: API.reset(5)
                        }}>{this.state.defaultStartTime} : 00 - {this.state.defaultEndTime} : 00</Text>

                        <Text style={styles.title}>可预约地点</Text>
                        <Text style={{textAlign: 'center', marginTop: API.reset(10), marginBottom: API.reset(30),}}>
                            {this.state.place}
                        </Text>
                        <SubmitBtn text={'确认'} onPress={() => {
                            this.confirmDate();
                        }}/>
                    </View>
                </View>
            </ImageBackground>
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
            width: width - API.reset(200),
            fontSize: 18
        },
        title: {
            fontSize: 20,
            margin: API.reset(15),
            textAlign: 'center',
            marginTop: API.reset(20),
        },
        input: {
            fontSize: 16,
            marginBottom: API.reset(40),
        }
    }
);
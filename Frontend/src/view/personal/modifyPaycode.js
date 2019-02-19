import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, ImageBackground, Alert} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {showLoading} from '../../redux/actions'
import {connect} from 'react-redux'
import VerificationCodeButton from "../../components/verificationCodeButton";

class ModifyPaycode extends Component {

    constructor() {
        super();
        this.state = {
            payCode: '',
            new_paycode: '',
            isCode: false,
            code: ''
        }
    }

    async savePassword() {
        let formData = this.state.isCode ? {
            'password': this.state.new_paycode,
            'code': this.state.code
        } : {
            'oldPayCode': this.state.payCode,
            'newPayCode': this.state.new_paycode
        };

        try {
            this
                .props
                .dispatch(showLoading(true));

            let response = this.state.isCode ? await API._fetch(API.PUT({
                url: '/account/payCode',
                formData
            })) : await API._fetch(API.POST({url: '/account/changePayCode', formData}));

            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                API.toastLong('修改成功');
                this.props.navigation.goBack();
            } else if (response.status === 403) {
                this.state.isCode ? Alert.alert('错误', '验证码错误') : Alert.alert('错误', '原付款码错误');
            }
            else
                API.toastLong('修改失败');
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
    }

    async fetchCode() {
        try {
            let response = await API._fetch(API.POST({
                url: '/message',
                formData: {'phoneNumber': this.props.userData.phone}
            }));
            if (response.status === 200) {
                API.toastLong('短信成功发送');
                return true
            } else {
                API.toastLong('发送失败');
                return false
            }
        } catch (error) {
            return false
        }
    }


    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <View style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <Text
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                            >{this.props.userData.phone}</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>

                        {!this.state.isCode ? [<View
                            style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <TextInput
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                placeholder='请输入原支付码（6位）'
                                keyboardType={'numeric'}
                                placeholderTextColor='#858585'
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({payCode: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                                maxLength={6}
                            />
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>] : [
                            <View style={{
                                width: '100%',
                                height: 50,
                                backgroundColor: 'transparent',
                                flexDirection: 'row'
                            }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        height: 49,
                                        fontSize: 14,
                                        color: '#000000',
                                        borderBottomColor: '#e6e6e6',
                                        borderBottomWidth: 1,
                                        width: API.width - API.reset(50)
                                    }}
                                    // style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                    placeholder='请输入验证码'
                                    placeholderTextColor='#858585'
                                    maxLength={4}
                                    underlineColorAndroid="transparent"
                                    keyboardType={'numeric'}
                                    value={this.state.code}
                                    onChangeText={(text) => /^[0-9]*$/.test(text)
                                        ? this.setState({code: text})
                                        : ''}
                                />
                                <VerificationCodeButton
                                    buttonStyle={styles.fetchCode}
                                    textStyle={{fontSize: 14, color: '#000000', marginTop: API.reset(20)}}
                                    text='获取验证码'
                                    fetchCode={() => this.fetchCode()}/></View>]}
                        <View style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <TextInput
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                placeholder='请输入新支付码（6位）'
                                placeholderTextColor='#858585'
                                secureTextEntry={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setState({new_paycode: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                                maxLength={6}
                                value={this.state.new_paycode}
                            />
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>
                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='保存'
                            onPress={() => this.savePassword()}/>
                        <SubmitBtn
                            text='忘记付款码'
                            onPress={() => this.setState({isCode: true, new_paycode: ''})}/>
                    </View>

                    <View style={{backgroundColor: 'transparent', height: 60}}/>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(ModifyPaycode)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: API.reset(23)
    },
    box: {
        paddingTop: API.reset(30),
        paddingBottom: API.reset(30),
        paddingHorizontal: API.reset(29),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    logo: {
        alignSelf: 'center',
        width: API.reset(54),
        height: API.reset(54)
    },
    name: {
        alignSelf: 'center',
        fontSize: 17,
        marginTop: API.reset(14),
        marginBottom: API.reset(23)
    },
    content: {
        fontSize: 12,
        lineHeight: 18
    },
    item: {
        flexDirection: 'row',
        paddingVertical: API.reset(21),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    label: {
        flex: 1,
        paddingLeft: API.reset(9),
        color: '#333'
    },
    goRight: {
        width: API.reset(8),
        height: API.reset(14)
    },
    submitBtn: {
        marginTop: API.reset(46),
        marginBottom: API.reset(30)
    }
});
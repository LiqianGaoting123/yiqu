import React, {Component} from 'react'
import {View, TextInput, StyleSheet, ImageBackground, ScrollView, Alert} from 'react-native'
import {connect} from 'react-redux'
import {showLoading} from '../../redux/actions'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton'
import VerificationCodeButton from '../../components/verificationCodeButton'
import {initData} from '../../redux/actions'
import ReactNative from "react-native";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            //timothy add
            phone: '',//手机号
            password: '',//密码
            sms: '',//验证码

            code: '',//邀请码
            nickName: '',//昵称

            payCode: ''//付款的6位数密码
        }
    }

    async Next() {
        if (this.state.phone === '' || this.state.password === '' || this.state.sms === '' || this.state.nickName === '') {
            Alert.alert('信息不完整', '请输入所有信息');
            return
        }

        if (this.state.payCode.length < 6) {
            Alert.alert('错误', '请输入6位付款码');
            return
        }

        // mobile	文本	必填	手机号
        // code	文本	必填	验证码
        // password	文本	必填	密码
        // inviteCode	文本	选填	邀请码
        // nickName	文本	必填	昵称
        // formData.append('token', data.token)
        let formData = {
            'phoneNumber': this.state.phone,
            'code': this.state.sms,
            'password': this.state.password,
            'inviteCode': this.state.code,
            'username': this.state.nickName,
            'payCode': this.state.payCode
        };

        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.PUT({url: '/account/', formData}));
            let responseJson = await response.json();
            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                //注册成功，直接跳转首页。
                global.token = responseJson.token;
                this
                    .props
                    .dispatch(initData(responseJson.data));
                storage.save({
                    key: 'token',
                    id: '2',
                    data: responseJson.token
                });
                // storage.save({
                //     key: 'userInfo',
                //     id: '3',
                //     data: {
                //         id: responseJson.data.id,
                //         phone: responseJson.data.mobile,
                //         name: responseJson.data.real_name,
                //         IDcard: responseJson.data.id_card,
                //     }
                // });
                // storage.save({
                //     key: 'property',
                //     id: '4',
                //     data: {
                //         leadership: responseJson.data.leadership,
                //         particle: responseJson.data.particle
                //     }
                // });
                // storage.save({
                //     key: 'custom',
                //     id: '5',
                //     data: {
                //         portrait: {
                //             uri: responseJson.data.head_pic
                //         },
                //         nickname: responseJson.data.nickName
                //     }
                // });
                // storage.save({
                //     key: 'invitation',
                //     id: '6',
                //     data: {
                //         recommend_code: responseJson.data.recommend_code,
                //         leftTimes: 0,
                //         totalTimes: 0
                //     }
                // });
                // storage.save({
                //     key: 'followStatus',
                //     id: '7',
                //     data: {
                //         status: responseJson.data.is_attention_public
                //     }
                // });
                // storage.save({
                //     key: 'loginType',
                //     id: '8',
                //     data: responseJson.data.login_type
                // });
                this
                    .props
                    .navigation
                    .navigate('Home')
            } else {
                Alert.alert('错误', '用户名已存在');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
    }

    async fetchCode() {
        if (!/^1[34578]\d{9}$/.test(this.state.phone)) {
            Alert.alert('错误', '请输入正确的电话号码');
            return
        }

        try {
            let response = await API._fetch(API.POST({url: '/message', formData: {'phoneNumber': this.state.phone}}));
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

    _reset() {
        this.refs.scrollView.scrollTo({y: API.reset(0)});
    }

    _onFocus(refName) {
        setTimeout(()=> {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(this.refs[refName]), API.reset(100), true);
        }, 100);
    }

    render() {
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.container}>
                {/*<View style={{height: API.height - API.reset(40)}}>*/}
                <ScrollView alwaysBounceVertical={false} style={styles.scrollView} ref="scrollView">
                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <TextInput
                            style={{width: '100%', height: 44, fontSize: 14, color: '#FFFFFF'}}
                            placeholder='请输入手机号'
                            placeholderTextColor='#fff'
                            maxLength={11}
                            keyboardType={'phone-pad'}
                            value={this.state.phone}
                            ref="numberInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'numberInput')}
                            onChangeText={(text) => this.setState({phone: text})}
                            underlineColorAndroid="transparent"
                            padding={0}
                        />
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <TextInput
                            style={{width: '100%', height: 44, fontSize: 14, color: '#FFFFFF'}}
                            placeholder='请输入密码'
                            placeholderTextColor='#fff'
                            secureTextEntry={true}
                            ref="passwordInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'passwordInput')}
                            onChangeText={(text) => this.setState({password: text})}
                            underlineColorAndroid="transparent"
                            padding={0}
                        />
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    {/* <View style = {{width : '100%',height : 50,backgroundColor : 'transparent'}}>
                    <TextInput
                        style = {{width : '100%',height : 49,fontSize : 14,color : '#FFFFFF'}}
                        placeholder='手机验证码'
                        placeholderTextColor='#fff'
                        keyboardType='email-address'
                        onChangeText={(text) => this.setState({ sms : text })}
                        />
                    <View style = {{width : '100%',height : 1,backgroundColor : '#3F3D4D',}}/>
                </View>
                <View style = {{height : 20,backgroundColor : 'transparent'}}/> */}

                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <View style={{
                            width: '100%', height: 44, backgroundColor: 'transparent', flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <TextInput
                                style={{flex: 1, height: 44, fontSize: 14, color: '#FFFFFF'}}
                                placeholder='手机验证码'
                                placeholderTextColor='#fff'
                                maxLength={6}
                                keyboardType={'numeric'}
                                value={this.state.sms}
                                ref="codeInput"
                                onBlur={this._reset.bind(this)}
                                onFocus={this._onFocus.bind(this, 'codeInput')}
                                onChangeText={(text) => /^[0-9]*$/.test(text)
                                    ? this.setState({sms: text})
                                    : ''}
                                underlineColorAndroid="transparent"
                                padding={0}
                            />
                            <View style={{width: 1, height: 26, backgroundColor: 'rgba(255,255,255,.3)'}}/>
                            <VerificationCodeButton
                                buttonStyle={styles.fetchCode}
                                textStyle={styles.fetchCodeText}
                                text='获取验证码'
                                fetchCode={() => this.fetchCode()}/>
                        </View>
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <TextInput
                            style={{width: '100%', height: 44, fontSize: 14, color: '#FFFFFF'}}
                            placeholder='昵称'
                            placeholderTextColor='#fff'
                            //keyboardType='email-address'
                            ref="nameInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'nameInput')}
                            onChangeText={(text) => this.setState({nickName: text})}
                            underlineColorAndroid="transparent"
                            padding={0}
                        />
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <TextInput
                            style={{width: '100%', height: 44, fontSize: 14, color: '#FFFFFF'}}
                            placeholder='邀请码（可选填）'
                            placeholderTextColor='#fff'
                            ref="inviteInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'inviteInput')}
                            onChangeText={(text) => this.setState({code: text})}
                            underlineColorAndroid="transparent"
                            padding={0}
                        />
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    <View style={{width: '100%', height: 45, backgroundColor: 'transparent'}}>
                        <TextInput
                            style={{width: '100%', height: 44, fontSize: 14, color: '#FFFFFF'}}
                            placeholder='付款码（6位）'
                            maxLength={6}
                            keyboardType={'numeric'}
                            secureTextEntry={true}
                            placeholderTextColor='#fff'
                            ref="payCodeInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'payCodeInput')}
                            onChangeText={(text) => this.setState({payCode: text})}
                            underlineColorAndroid="transparent"
                            padding={0}
                        />
                        <View style={{width: '100%', height: 1, backgroundColor: '#3F3D4D',}}/>
                    </View>
                    <View style={{height: 20, backgroundColor: 'transparent'}}/>

                    <View style={{height: 25, backgroundColor: 'transparent'}}/>
                    <SubmitBtn text='下一步' onPress={() => this.Next()}/>
                </ScrollView>
                {/*</View>*/}
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Register)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: API.reset(41),
        paddingRight: API.reset(41),
        paddingTop: API.reset(20),
    },
    scrollView: {
        paddingLeft: API.reset(41),
        paddingRight: API.reset(41),
        paddingBottom: API.reset(40),
        height: API.reset(293)
    },
    wrapper: {
        flexDirection: 'row',
        marginBottom: API.reset(38),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    input: {
        flex: 1,
        paddingBottom: API.reset(18),
        textAlign: 'center',
        color: '#fff'
    },
    code: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 21,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    codeInput: {
        flex: 1,
        paddingTop: API.reset(18),
        paddingBottom: API.reset(18),
        color: '#fff'
    },
    fetchCode: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: 90,
        height: 49,
    },
    fetchCodeText: {
        fontSize: 14,
        color: 'rgba(255,255,255,.3)'
    },
});
import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet, ImageBackground, Alert
} from 'react-native'
import {connect} from 'react-redux'
import {infoUpdate, showLoading} from '../../redux/actions'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton'
import VerificationCodeButton from "../../components/verificationCodeButton";
import ReactNative from "react-native";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            mobile: '',
            code: '',
            password: '',
            isPsw: true,
        }
    }

    async fetchCode() {
        if (!/^1[34578]\d{9}$/.test(this.state.mobile)) {
            Alert.alert('错误','请输入正确的电话号码');
            return
        }

        let formData = {'phoneNumber': this.state.mobile};
        try {
            let response = await API._fetch(API.POST({url: '/message', formData}));
            if (response.status === 200) {
                API.toastLong('短信成功发送');
                return true
            } else {
                API.toastLong('发送失败');
                return false
            }
        } catch (error) {
            API.toastLong('发送失败');
            return false
        }
    }

    async Login() {
        if (!/^1[34578]\d{9}$/.test(this.state.mobile)) {
            Alert.alert('错误','请输入正确的电话号码');
            return
        }

        let formData = this.state.isPsw ? {
            'phoneNumber': this.state.mobile,
            'password': this.state.password
        } : {
            'phoneNumber': this.state.mobile,
            'code': this.state.code
        };
        try {
            global.token = '';
            this
                .props
                .dispatch(showLoading(true));
            let response = this.state.isPsw ? await API._fetch(API.POST({
                url: '/account/',
                formData
            })) : await API._fetch(API.POST({url: '/account/code', formData}));
            console.log(response);
            if(response.status !== 200){
                this.state.isPsw ?
                    API.toastLong('手机号或者密码错误') : response.status === 403 ? API.toastLong('用户名不存在'): API.toastLong('验证码错误');
                this
                    .props
                    .dispatch(showLoading(false));
                return
            }
            let responseJson = await response.json();

            if (response.status === 200) {
                global.token = responseJson.token;
                // this
                //     .props
                //     .dispatch(initData(responseJson.data));
                storage.save({
                    key: 'token',
                    id: '2',
                    data: responseJson.token
                });
                formData = {};
                let response = await API._fetch(API.GET({url: '/profile/abstract', formData}));
                responseJson = await response.json();
                // 这边其实还有一个username没有用到
                storage.save({
                    key: 'property',
                    id: '4',
                    data: {
                        leadership: responseJson.leadership,
                        particle: responseJson.balance
                    }
                });
                // 用户信息
                response = await API._fetch(API.GET({url: '/user/identification', formData}));
                responseJson = await response.json();
                if (response.status === 200) {
                    this
                        .props
                        .dispatch(infoUpdate({
                            // id:
                            phone: responseJson.phoneNumber,
                            name: responseJson.name,
                            IDcard: responseJson.idNumber
                        }));
                    storage.save({
                        key: 'userInfo',
                        id: '3',
                        data: {
                            // id: responseJson.data.id,
                            phone: responseJson.phoneNumber,
                            name: responseJson.name,
                            IDcard: responseJson.idNumber,
                        }
                    });
                } else {
                    this
                        .props
                        .dispatch(showLoading(false));

                    API.toastLong('网络连接失败')
                }
                // storage.save({
                //     key: 'custom',
                //     id: '5',
                //     data: {
                //         portrait: {
                //             uri: responseJson.data.head_pic
                //         },
                //         nickname: responseJson.data.nick_name
                //     }
                // });
                response = await API._fetch(API.GET({url: '/mission/leadership/remain', formData})); // 剩余邀请次数
                responseJson = await response.json();
                if (response.status === 200) {
                    this
                        .props
                        .dispatch(infoUpdate({
                            leftTimes: responseJson.remain,
                            recommend_code: responseJson.myInviteCode
                        }));
                    storage.save({
                        key: 'invitation',
                        id: '6',
                        data: {
                            recommend_code: responseJson.myInviteCode,
                            leftTimes: responseJson.remain,
                            totalTimes: 10
                        }
                    });
                } else {
                    this
                        .props
                        .dispatch(showLoading(false));

                    API.toastLong('网络连接失败')
                }
                response = await API._fetch(API.GET({url: '/mission/leadership/check', formData})); // 判断是否完成任务
                responseJson = await response.json();
                if (response.status === 200) {
                    storage.save({
                        key: 'followStatus',
                        id: '7',
                        data: {
                            status: responseJson.wechat
                        }
                    });
                }
                else {
                    this
                        .props
                        .dispatch(showLoading(false));

                    API.toastLong('网络连接失败')
                }

                // 分享的二维码？
                storage.save({
                    key: 'qrcode',
                    id: '8',
                    data: {
                        qrcode: 'src/assets/'
                    }
                });
                this
                    .props
                    .navigation
                    .navigate('Main')
            } else {
                this.state.isPsw ?
                    API.toastLong('手机号或者密码错误') : API.toastLong('验证码错误')
            }
            this
                .props
                .dispatch(showLoading(false));
        } catch (error) {
            console.log(error);
            this
                .props
                .dispatch(showLoading(false));

            API.toastLong('网络连接失败')
        }

    }

    renderCode() {
        return this.state.isPsw ? <TextInput
            selectionColor='#2052E0'
            placeholder='请输入密码'
            placeholderTextColor='#fff'
            value={this.state.password}
            secureTextEntry={true}
            ref="passwordInput"
            onBlur={this._reset.bind(this)}
            onFocus={this._onFocus.bind(this, 'passwordInput')}
            onChangeText={(text) => this.setState({password: text})}
            style={[styles.input, {marginTop: 19}]}/> : <View style={styles.code}>
            <TextInput
                placeholder='手机验证码'
                placeholderTextColor='#fff'
                maxLength={4}
                keyboardType={'numeric'}
                value={this.state.code}
                ref="codeInput"
                onBlur={this._reset.bind(this)}
                onFocus={this._onFocus.bind(this, 'codeInput')}
                onChangeText={(text) => /^[0-9]*$/.test(text)
                    ? this.setState({code: text})
                    : ''}
                style={styles.codeInput}/>
            <VerificationCodeButton
                buttonStyle={styles.fetchCode}
                textStyle={styles.fetchCodeText}
                text='获取验证码'
                fetchCode={() => this.fetchCode()}/>
        </View>
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
                <ScrollView style={styles.container} ref="scrollView">
                    <Image source={require('../../assets/images/planet.png')} style={styles.planet}/>
                    <View style={styles.form}>
                        <TextInput
                            selectionColor='#2052E0'
                            placeholder='请输入手机号'
                            placeholderTextColor='#fff'
                            maxLength={11}
                            keyboardType={'phone-pad'}
                            value={this.state.mobile}
                            ref="numberInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'numberInput')}
                            onChangeText={(text) => /^[0-9]*$/.test(text)
                                ? this.setState({mobile: text})
                                : ''}
                            style={styles.input}/>

                        {this.renderCode()}
                        {/* timothy 新增，进入注册和忘记密码 */}
                        <View style={{
                            width: '100%', height: 47, backgroundColor: 'transparent',
                            flexDirection: 'row', alignItems: 'center',
                        }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                                <Text style={{fontSize: 12, color: 'rgba(255,255,255,.3)'}}>{'注册账号'}</Text>
                            </TouchableOpacity>

                            <View style={{flex: 1}}/>

                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    isPsw: false,
                                })
                            }}>
                                <Text style={{fontSize: 12, color: 'rgba(255,255,255,.3)'}}>{'手机验证码登陆'}</Text>
                            </TouchableOpacity>
                            {/*<View style={{flex: 1}}/>*/}
                            <View style={{flex: 1}}/>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPwd')}>
                                <Text style={{fontSize: 12, color: 'rgba(255,255,255,.3)'}}>{'忘记密码？'}</Text>
                            </TouchableOpacity>
                        </View>

                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='开启探索'
                            onPress={() => this.Login()}/>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Protacol')}>
                            <Text style={styles.tips}>开启即同意《用户使用协议》</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    planet: {
        alignSelf: 'center',
        width: API.reset(227),
        height: API.reset(227),
        marginTop: API.reset(17)
    },
    form: {
        paddingLeft: API.reset(41),
        paddingRight: API.reset(41),
        paddingTop: API.reset(17)
    },
    input: {
        paddingTop: API.reset(18),
        paddingBottom: API.reset(18),
        color: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
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
        justifyContent: 'center',
        minWidth: API.reset(88),
        height: API.reset(30),
        paddingLeft: API.reset(13),
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: 'rgba(255,255,255,.4)'
    },
    fetchCodeText: {
        color: 'rgba(255,255,255,.3)'
    },
    submitBtn: {
        //marginTop: API.reset(43)
        //tinothy updata
        marginTop: API.reset(17)
    },
    tips: {
        alignSelf: 'center',
        marginTop: API.reset(15),
        fontSize: 11,
        color: 'rgba(255,255,255,.3)'
    }
});
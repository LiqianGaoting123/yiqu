import React, {Component} from 'react'
import {
    View,
    ScrollView,
    TextInput,
    Image,
    StyleSheet, ImageBackground,
    Alert
} from 'react-native'
import {connect} from 'react-redux'
import {showLoading} from '../../redux/actions'
import VerificationCodeButton from '../../components/verificationCodeButton'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton'

class ForgetPwd extends Component {
    constructor() {
        super();
        this.state = {
            mobile: '',
            code: '',
            password: '',
        }
    }

    async fetchCode() {
        let formData = {
            'phoneNumber': this.state.mobile
        };
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
            return false
        }
    }

    async Login() {
        let formData = {
            'phoneNumber': this.state.mobile,
            'code': this.state.code,
            'password': this.state.password
        };

        // mobile	文本	必填	手机号
        // code	文本	必填	验证码
        // new_password	文本	必填	新密码
        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/account/password', formData}));
            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                // API.toastLong(responseJson.info);
                this
                    .props
                    .navigation
                    .navigate('Main')
            } else {
                Alert.alert('错误', '系统出错了，请稍后再尝试');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')} style={styles.container}>
                <ScrollView style={styles.container}>
                    <Image source={require('../../assets/images/planet.png')} style={styles.planet}/>
                    <View style={styles.form}>
                        <TextInput
                            selectionColor='#2052E0'
                            placeholder='请输入手机号'
                            placeholderTextColor='#fff'
                            maxLength={11}
                            keyboardType={'phone-pad'}
                            value={this.state.mobile}
                            onChangeText={(text) => /^[0-9]*$/.test(text)
                                ? this.setState({mobile: text})
                                : ''}
                            style={styles.input}/>

                        <View style={styles.code}>
                            <TextInput
                                placeholder='手机验证码'
                                placeholderTextColor='#fff'
                                maxLength={6}
                                keyboardType={'numeric'}
                                value={this.state.code}
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

                        <TextInput
                            selectionColor='#2052E0'
                            placeholder='请输入新密码'
                            placeholderTextColor='#fff'
                            //maxLength={11}
                            //keyboardType={'phone-pad'}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({password: text})}
                            style={[styles.input, {marginTop: 19}]}/>

                        {/* timothy 新增，进入注册和忘记密码 */}
                        {/* <View style = {{width : '100%',height : 47,backgroundColor : 'transparent',
                        flexDirection : 'row',alignItems : 'center',
                        }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style = {{fontSize : 12,color : 'rgba(255,255,255,.3)'}}>{'注册账号'}</Text>
                        </TouchableOpacity>

                        <View style = {{flex : 1}}/>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style = {{fontSize : 12,color : 'rgba(255,255,255,.3)'}}>{'忘记密码？'}</Text>
                        </TouchableOpacity>
                    </View> */}

                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='提交'
                            onPress={() => this.Login()}/>
                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('Protacol')}>
                        <Text style={styles.tips}>开启即同意《用户使用协议》</Text>
                    </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(ForgetPwd)

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    container: {
        flex: 1,
        // paddingHorizontal: API.reset(23),
        width: API.width,
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
        marginTop: API.reset(32)
    },
    tips: {
        alignSelf: 'center',
        marginTop: API.reset(15),
        fontSize: 11,
        color: 'rgba(255,255,255,.3)'
    }
});
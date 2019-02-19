import React, {Component} from 'react'
import {View, ScrollView, Text, TextInput, StyleSheet, ImageBackground, Alert} from 'react-native'
import {connect} from 'react-redux'
import {showLoading, authentication} from '../../redux/actions'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton'
import ReactNative from "react-native";

class Authentication extends Component {
    constructor() {
        super();
        _this = this;
        this.state = {
            real_name: '',
            id_card: ''
        };
        this.Submit = this.Submit.bind(this);
        this.press = this.press.bind(this);
    }

    async press(){
        Alert.alert('温馨提示', '提交之后姓名将不可修改，请确认之后点击提交', [
            {text: '取消', style: 'cancel'},
            {
                text: '确认', onPress: function () {
                    _this.Submit();
                }
            },
        ])
    }

    async Submit() {
        if (!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.state.id_card) ||
                /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(this.state.id_card))) {
            Alert.alert('警告', '请输入正确的身份证号码');
            return
        }
        if (!this.state.real_name) {
            API.toastLong('请输入姓名');
            return
        }
        if (!this.state.id_card) {
            API.toastLong('请输入身份证号');
            return
        }

        let formData = {
            'name': this.state.real_name,
            'idNumber': this.state.id_card
        };
        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/user/identification', formData}));
            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                this
                    .props
                    .dispatch(authentication(1));
                API.toastLong('认证成功');
                this
                    .props
                    .navigation
                    .goBack()
            } else {
                API.toastLong('认证失败');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
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
            <ImageBackground
                source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={styles.container} ref="scrollView">
                    <View style={styles.textWrapper}>
                        <Text style={styles.title}>实名信息</Text>
                        <Text style={styles.tips}>保障居民资产安全，需进行身份验证大师星球不会在任何情况泄露您的居民信息</Text>
                    </View>
                    <View style={styles.wrapper}>
                        <TextInput
                            placeholder='姓名'
                            placeholderTextColor='#fff'
                            ref="nameInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'nameInput')}
                            onChangeText={(text) => this.setState({real_name: text})}
                            style={styles.input}/>
                    </View>
                    <View style={styles.wrapper}>
                        <TextInput
                            placeholder='身份证号'
                            placeholderTextColor='#fff'
                            ref="identifyInput"
                            onBlur={this._reset.bind(this)}
                            onFocus={this._onFocus.bind(this, 'identifyInput')}
                            onChangeText={(text) => this.setState({id_card: text})}
                            maxLength={18}
                            style={styles.input}/>
                    </View>
                    <SubmitBtn text='提交' onPress={() => this.press()}/>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Authentication)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: API.reset(41),
        paddingRight: API.reset(41)
    },
    textWrapper: {
        alignItems: 'center'
    },
    title: {
        marginTop: API.reset(58),
        marginBottom: API.reset(37),
        fontSize: 28,
        color: '#fff'
    },
    tips: {
        width: API.reset(248),
        marginBottom: API.reset(69),
        textAlign: 'center',
        lineHeight: 20,
        color: '#fdcc21'
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
        color: '#fff'
    }
});
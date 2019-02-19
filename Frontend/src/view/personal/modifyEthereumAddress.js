import React, {Component} from 'react'
import {View, StyleSheet, TextInput, ImageBackground, Text, ScrollView} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {showLoading, infoUpdate} from '../../redux/actions'
import {connect} from 'react-redux'
import ReactNative from "react-native";

class ModifyEthereumAddress extends Component {
    constructor() {
        super();
        this.state = {
            account: '',
            address: '',
            isBind: false,
        }
    }

    async saveAccount() {
        let formData = {'privateKey': this.state.account};

        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/account/address', formData}));

            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                API.toastLong('绑定成功');
                this.props.navigation.goBack();
            } else {
                API.toastLong('修改失败，请输入正确的私钥');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络请求失败')
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
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={{paddingVertical: API.reset(23)}} ref="scrollView">
                    <View style={styles.container}>
                        <View style={styles.box}>
                            <View style={{width: '100%', height: 100, backgroundColor: 'transparent'}}>
                                <TextInput
                                    style={{width: '100%', height: 98, fontSize: 14, color: '#000000'}}
                                    multiline={true}
                                    placeholder='请输入以太坊私钥'
                                    placeholderTextColor='#858585'
                                    //keyboardType='email-address'
                                    ref="keyInput"
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'keyInput')}
                                    onChangeText={(text) => this.setState({account: text})}
                                    underlineColorAndroid="transparent"
                                    padding={0}
                                />
                                <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                            </View>

                            <SubmitBtn
                                buttonStyle={styles.submitBtn}
                                text='保存'
                                onPress={() => this.saveAccount()}/>
                        </View>

                        <View style={{backgroundColor: 'transparent', height: 60}}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(ModifyEthereumAddress)

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
    },
    promptContent: {
        fontSize: 16,
        lineHeight: 18,
        color: '#2c2c2c'
    }
});
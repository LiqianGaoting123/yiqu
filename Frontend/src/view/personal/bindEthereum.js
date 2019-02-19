import React, {Component} from 'react'
import {View, StyleSheet, TextInput, ImageBackground, Text, ScrollView} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {showLoading, infoUpdate} from '../../redux/actions'
import {connect} from 'react-redux'
import ReactNative from "react-native";

class BindEthereum extends Component {
    constructor() {
        super();
        this.state = {
            account: '',
            address: '',
            isBind: false,
            isPrivateKey: false,
            privateKey: '',
            masterCoin: 0,
            ethereumCoin: 0,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        let formData = {};
        try {
            this
                .props
                .dispatch(showLoading(true));

            let response = await API._fetch(API.GET({url: '/account/address', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    isBind: responseJson.hasAddress,
                    address: responseJson.address,
                });

                let temp = responseJson.address;
                if (responseJson.hasAddress) {
                    response = await API._fetch(API.GET({url: '/balance/' + temp, formData}));
                    responseJson = await response.json();
                    let balance = responseJson.balance;

                    response = await API._fetch(API.GET({url: '/balance/eth/' + temp, formData}));
                    responseJson = await response.json();
                    let address = responseJson.balance;

                    this
                        .props
                        .dispatch(showLoading(false));
                    if (response.status === 200) {
                        this.setState({
                            masterCoin: balance,
                            ethereumCoin: address,
                        })
                    }
                    else {
                        API.toastLong('操作失败');
                    }
                }
                else {
                    this
                        .props
                        .dispatch(showLoading(false));
                }
            } else {
                this
                    .props
                    .dispatch(showLoading(false));
                API.toastLong('操作失败');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络连接失败')
        }
    }

    async createAccount() {
        let formData = {};

        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/ethereum/', formData}));

            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                API.toastLong('创建成功');
                let responseJson = await response.json();
                this.setState({
                    privateKey: responseJson.privateKey,
                    isPrivateKey: true,
                    isBind: true
                })
            } else {
                API.toastLong('创建失败，请稍后再试');
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络请求失败')
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
                API.toastLong('保存失败，请输入正确的私钥');
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
        setTimeout(()=> {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(this.refs[refName]), API.reset(100), true);
        }, 100);
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={{margin: API.reset(23)}} ref="scrollView">
                    <View style={[styles.box, {marginBottom: API.reset(25)}]}>
                        {this.state.isBind ? (this.state.privateKey ? [] : [
                            <Text style={[styles.promptContent, {marginBottom: API.reset(15)}]}>您的以太坊地址为: </Text>,
                            <Text style={[styles.promptContent, {fontWeight: 'bold'}]}>{this.state.address}</Text>
                        ]) : [
                            <Text style={[styles.promptContent, {
                                textAlign: 'center',
                                marginBottom: API.reset(15)
                            }]}>您尚未绑定以太坊账号</Text>,
                            <Text style={[styles.promptContent, {textAlign: 'center'}]}>请输入私钥以绑定账号</Text>]}
                        {this.state.isPrivateKey ? [<Text
                            style={[styles.promptContent, {
                                marginBottom: API.reset(15),
                            }]}>您的以太坊私钥为: </Text>,
                            <Text style={[styles.promptContent, {
                                marginBottom: API.reset(15),
                                marginTop: API.reset(10),
                                color: '#ff2222'
                            }]}>请记住您的私钥，仅展示一次</Text>,
                            <Text
                                style={[styles.promptContent, {fontWeight: 'bold'}]}>{this.state.privateKey}</Text>] : []}
                    </View>

                    {(this.state.isBind && !this.state.isPrivateKey) ? [
                        <View style={[styles.box]}>
                            <View>
                                <Text
                                    style={[styles.promptContent, {
                                        marginBottom: API.reset(15),
                                        marginRight: API.reset(20)
                                    }]}>您的大师币余额为: </Text>
                                <Text
                                    style={[styles.promptContent, {
                                        marginBottom: API.reset(15),
                                        textAlign: 'right',
                                        fontWeight: 'bold'
                                    }]}>{this.state.masterCoin} GAB</Text>
                            </View>
                            <View>
                                <Text
                                    style={[styles.promptContent, {
                                        marginRight: API.reset(20),
                                        marginBottom: API.reset(15),
                                    }]}>您的以太币余额为: </Text>
                                <Text
                                    style={[styles.promptContent, {
                                        textAlign: 'right',
                                        fontWeight: 'bold'
                                    }]}>{this.state.ethereumCoin} ETH</Text>
                            </View>
                        </View>] : []}

                    {this.state.isBind ? [] : [
                        <View style={styles.box}>
                            <View style={{width: '100%', height: 100, backgroundColor: 'transparent'}}>
                                <TextInput
                                    style={{width: '100%', height: 98, fontSize: 14, color: '#000000'}}
                                    multiline={true}
                                    placeholder='请输入以太坊私钥'
                                    placeholderTextColor='#858585'
                                    //keyboardType='email-address'
                                    onChangeText={(text) => this.setState({account: text})}
                                    ref="keyInput"
                                    onBlur={this._reset.bind(this)}
                                    onFocus={this._onFocus.bind(this, 'keyInput')}
                                    underlineColorAndroid="transparent"
                                    padding={0}
                                    onSubmitEditing={() => this.saveAccount()}
                                />
                                <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                            </View>

                            <SubmitBtn
                                buttonStyle={styles.submitBtn}
                                text='保存'
                                onPress={() => this.saveAccount()}/>

                            <SubmitBtn
                                text='创建以太坊账号'
                                onPress={() => this.createAccount()}/>
                        </View>]}
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(BindEthereum)

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
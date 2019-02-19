import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground} from 'react-native';
import {connect} from 'react-redux'
import {follow} from '../../redux/actions'
import API from '../../static/methods';
import SubmitBtn from '../../components/submitButton';

class PublicAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
    }

    async bindWechat() {
        let formData = {'code': this.state.code};
        console.log(formData);
        try {
            let response = await API._fetch(API.POST({url: '/mission/wechat/focus', formData}));
            if (response.status === 200) {
                this.props.dispatch(follow(true));
                this.props.navigation.navigate('SuccessBind', {first: true})
            } else {
                API.toastLong('绑定失败，请确认是否输入了正确的验证码')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.explain}>
                        <Text style={styles.text}>按照如下步骤完成关注微信公众号，即可领取2创造力</Text>
                        <View style={styles.step}>
                            <Text style={styles.text}>1.在微信公众号中搜索搜索“大师星球INFO”并关注</Text>
                            <Text style={styles.text}>2.在大师星球INFO公众号中输入“领取创造力”获得验证码</Text>
                            <Text style={styles.text}>3.在下方输入验证码，验证成功后即可领取原力</Text>
                        </View>
                        <Text style={styles.text}>说明：每个星球账号仅有一次领取机会</Text>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.tips}>请输入6位验证码</Text>
                        <TextInput keyboardType='email-address' style={styles.input}
                                   onChangeText={(text) => this.setState({
                                       code: text
                                   })}/>
                        <SubmitBtn buttonStyle={styles.submitBtn} text='提交' onPress={() => this.bindWechat()}/>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

export default connect(state => state.reducer)(PublicAccount);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    explain: {
        justifyContent: 'space-between',
        height: API.reset(176),
        paddingTop: API.reset(23),
        paddingBottom: API.reset(33),
        paddingHorizontal: API.reset(23),
    },
    text: {
        fontSize: 12,
        lineHeight: API.reset(20),
        color: '#fff'
    },
    inputBox: {
        flex: 1,
        paddingTop: API.reset(19),
        backgroundColor: '#fff'
    },
    tips: {
        alignSelf: 'center',
        color: '#333'
    },
    input: {
        alignSelf: 'center',
        width: API.reset(293),
        paddingVertical: API.reset(15),
        marginTop: API.reset(12),
        textAlign: 'center',
        fontSize: 20,
        borderBottomColor: '#999',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    submitBtn: {
        marginTop: API.reset(82),
    }
});
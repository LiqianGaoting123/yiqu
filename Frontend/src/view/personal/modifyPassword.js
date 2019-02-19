import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, ImageBackground} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {showLoading} from '../../redux/actions'
import {connect} from 'react-redux'

class ModifyPassword extends Component {

    constructor() {
        super();
        this.state = {
            password: '',
            new_password: '',
        }
    }

    async savePassword() {
        let formData = {
            'oldPassword': this.state.password,
            'newPassword': this.state.new_password
        };

        // token	文本	必填	token
        // password	文本	必填	原密码
        // new_password	文本	必填	新密码
        try {
            this
                .props
                .dispatch(showLoading(true));

            let response = await API._fetch(API.POST({url: '/profile/password', formData}));
            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                API.toastLong('修改成功');

                {
                    storage.remove({key: 'token', id: '2'});
                    storage.remove({key: 'userInfo', id: '3'});
                    storage.remove({key: 'property', id: '4'});
                    storage.remove({key: 'custom', id: '5'});
                    storage.remove({key: 'invitation', id: '6'});
                    storage.remove({key: 'followStatus', id: '7'});
                    storage.remove({key: 'qrcode', id: '8'});
                    this
                        .props
                        .navigation
                        .navigate('LoginApp')
                }
            } else {
                API.toastLong('修改失败');
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
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <View style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <Text
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                            >{this.props.userData.phone}</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>

                        <View style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <TextInput
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                placeholder='请输入原密码'
                                placeholderTextColor='#858585'
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({password: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                            />
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>

                        <View style={{width: '100%', height: 50, backgroundColor: 'transparent'}}>
                            <TextInput
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                placeholder='请输入新密码'
                                placeholderTextColor='#858585'
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({new_password: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                            />
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>

                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='保存'
                            onPress={() => this.savePassword()}/>
                    </View>

                    <View style={{backgroundColor: 'transparent', height: 60}}/>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(ModifyPassword)

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
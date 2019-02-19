import React, {Component} from 'react'
import {View, StyleSheet, TextInput, ImageBackground} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {showLoading, infoUpdate} from '../../redux/actions'
import {connect} from 'react-redux'

class ModifyNickname extends Component {

    constructor() {
        super();
        this.state = {
            nick_name: '',
        }
    }

    async saveNickname() {
        let formData = {'username': this.state.nick_name};

        // token	文本	必填	token
        // nick_name	文本	必填	新昵称
        try {
            this
                .props
                .dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/profile/', formData}));

            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200) {
                API.toastLong('修改成功');
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
                this
                    .props
                    .dispatch(infoUpdate({nick_name: this.state.nick_name}))
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
                            <TextInput
                                style={{width: '100%', height: 49, fontSize: 14, color: '#000000'}}
                                placeholder='请输入新昵称'
                                placeholderTextColor='#858585'
                                //keyboardType='email-address'
                                onChangeText={(text) => this.setState({nick_name: text})}
                                underlineColorAndroid="transparent"
                                padding={0}
                            />
                            <View style={{width: '100%', height: 1, backgroundColor: '#e6e6e6',}}/>
                        </View>

                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='保存'
                            onPress={() => this.saveNickname()}/>
                    </View>

                    <View style={{backgroundColor: 'transparent', height: 60}}/>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(ModifyNickname)

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
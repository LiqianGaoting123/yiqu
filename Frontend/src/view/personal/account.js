import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
import {infoUpdate} from '../../redux/actions';
import API from '../../static/methods'

class Account extends Component {
    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/user/identification', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this
                    .props
                    .dispatch(infoUpdate({
                        phone: responseJson.phoneNumber,
                        name: responseJson.name,
                        IDcard: responseJson.idNumber
                    }))
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <View style={styles.item}>
                            <Text style={styles.label}>当前帐号</Text>
                            <Text style={styles.text}>{this.props.userData.phone}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>姓名</Text>
                            <Text style={styles.text}>{this.props.userData.name
                                ? this.props.userData.name
                                : '未填写'}</Text>
                        </View>
                        <View
                            style={[
                                styles.item, {
                                    borderBottomWidth: 0
                                }
                            ]}>
                            <Text style={styles.label}>身份证号</Text>
                            <Text style={styles.text}>{this.props.userData.IDcard
                                ? this.props.userData.IDcard
                                : '未填写'}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Account)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: API.reset(23)
    },
    box: {
        paddingVertical: API.reset(5),
        paddingHorizontal: API.reset(19),
        marginTop: API.reset(100),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    item: {
        flexDirection: 'row',
        paddingVertical: API.reset(21),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    text: {
        flex: 1,
        paddingRight: API.reset(17),
        textAlign: 'right'
    },
    goRight: {
        width: API.reset(8),
        height: API.reset(14)
    }
});
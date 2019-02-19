import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert} from 'react-native'
import API from '../../static/methods'

export default class ShoppingCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 'master'
        }
    }

    componentDidMount() {
        this.fetchType();
    }

    async fetchType() {
        try {
            let formData = {};
            let response = await API._fetch(API.GET({url: '/user/check', formData}));

            if (response.status === 200) {
                this.setState({
                    userType: 'master'
                })
            } else {
                this.setState({
                    userType: 'user'
                })
            }
        } catch (error) {
            this.setState({
                userType: 'user'
            })
        }
    }


    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        {this.state.userType === 'master' ? [
                            <TouchableOpacity
                                style={[styles.item]}
                                onPress={() => this.props.navigation.navigate('MyArtwork', {
                                    type: 'self',
                                    userType: this.state.userType
                                })}>
                                <Text style={styles.label}>我的艺术品</Text>
                                <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                            </TouchableOpacity>,
                            <TouchableOpacity
                                style={[styles.item]}
                                onPress={() => this.props.navigation.navigate('UploadPrompt')}>
                                <Text style={styles.label}>上传艺术品</Text>
                                <Image source={require('../../assets/icon/right_arrow.png')}
                                       style={styles.goRight}/>
                            </TouchableOpacity>] : [
                            <TouchableOpacity
                                style={[styles.item]}
                                onPress={async () => {
                                    let formData = {};
                                    let response3 = await API._fetch(API.POST({
                                        url: '/user/profile/access',
                                        formData
                                    })); // 判断能否进入认证
                                    // console.log(response3);
                                    response3.status === 403 ? Alert.alert('温馨提示', '您的认证信息正在审核中，请耐心等待') : this.props.navigation.navigate('UploadCertification')
                                }}>
                                <Text style={styles.label}>艺术家认证</Text>
                                <Image source={require('../../assets/icon/right_arrow.png')}
                                       style={styles.goRight}/>
                            </TouchableOpacity>]}
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('MyCareArtwork', {type: 'mystar'})}>
                            <Text style={styles.label}>我关注的艺术品</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('MyCareMaster', {type: 'mystar'})}>
                            <Text style={styles.label}>我关注的艺术家</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>

                        {/*<TouchableOpacity*/}
                        {/*style={styles.item}*/}
                        {/*onPress={() => this.props.navigation.navigate('UploadArtwork')}>*/}
                        {/*<Text style={styles.label}>上传艺术品</Text>*/}
                        {/*<Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('AppointmentList', {type: 'user'})}>
                            <Text style={styles.label}>我的预约</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>

                        {this.state.userType === 'master' ?
                            [<TouchableOpacity
                                style={styles.item}
                                onPress={() => this.props.navigation.navigate('AppointmentList', {type: this.state.userType})}>
                                <Text style={styles.label}>预约请求</Text>
                                <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                            </TouchableOpacity>,
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => this.props.navigation.navigate('DatableSetting')}>
                                    <Text style={styles.label}>设置预约时间</Text>
                                    <Image source={require('../../assets/icon/right_arrow.png')}
                                           style={styles.goRight}/>
                                </TouchableOpacity>,
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => this.props.navigation.navigate('MyCertifications')}>
                                    <Text style={styles.label}>我的证书</Text>
                                    <Image source={require('../../assets/icon/right_arrow.png')}
                                           style={styles.goRight}/>
                                </TouchableOpacity>] : []}
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: API.reset(23)
    },
    box: {
        paddingVertical: API.reset(5),
        paddingHorizontal: API.reset(19),
        marginTop: API.reset(50),
        borderRadius: 10,
        backgroundColor: '#fff'
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
        marginBottom: API.reset(40)
    }
});
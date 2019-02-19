import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native'
import {connect} from "react-redux";
import API from "../../static/methods";
import {infoUpdate} from "../../redux/actions";

class Center extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            nickname: '',
            number: 0,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/account/index', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    // nickname: responseJson.name,
                    number: responseJson.index,
                });
            } else {
                API.toastLong('操作失败');
            }

            response = await API._fetch(API.GET({url: '/user/identification', formData}));
            responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    nickname: responseJson.name,
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败');
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>

                    <View style={styles.box}>
                        <Image style={styles.portrait} source={require('../../assets/icon/portrait.png')}/>
                        <Text style={styles.name}>{this.state.nickname}</Text>
                        <View style={styles.smallWrapper}>
                            <Text style={styles.small}>星球第</Text>
                            <Text style={styles.id}>{this.state.number}</Text>
                            <Text style={styles.small}>名居民</Text>
                        </View>
                        <TouchableOpacity style={styles.navItem}
                                          onPress={() => this.props.navigation.navigate('Record')}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('../../assets/icon/asset.png')}
                                    style={{
                                        width: API.reset(22),
                                        height: API.reset(19)
                                    }}/>
                            </View>
                            <Text style={styles.navName}>艺能资产</Text>
                            <Image
                                source={require('../../assets/icon/right_arrow.png')}
                                style={{
                                    width: API.reset(8),
                                    height: API.reset(14)
                                }}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem}
                                          onPress={() => this.props.navigation.navigate('EthereumAccount')}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('../../assets/icon/account.png')}
                                    style={{
                                        width: API.reset(22),
                                        height: API.reset(19)
                                    }}/>
                            </View>
                            <Text style={styles.navName}>链上钱包</Text>
                            <Image
                                source={require('../../assets/icon/right_arrow.png')}
                                style={{
                                    width: API.reset(8),
                                    height: API.reset(14)
                                }}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem}
                                          onPress={() => this.props.navigation.navigate('Order')}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('../../assets/icon/orders.png')}
                                    style={{
                                        width: API.reset(28),
                                        height: API.reset(28),
                                        marginLeft: API.reset(-5),
                                    }}/>
                            </View>
                            <Text style={styles.navName}>我的订单</Text>
                            <Image
                                source={require('../../assets/icon/right_arrow.png')}
                                style={{
                                    width: API.reset(8),
                                    height: API.reset(14)
                                }}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem}
                                          onPress={() => this.props.navigation.navigate('Account')}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('../../assets/icon/verify.png')}
                                    style={{
                                        marginLeft: API.reset(-5),
                                        width: API.reset(28),
                                        height: API.reset(28)
                                    }}/>
                            </View>
                            <Text style={styles.navName}>认证信息</Text>
                            <Image
                                source={require('../../assets/icon/right_arrow.png')}
                                style={{
                                    width: API.reset(8),
                                    height: API.reset(14)
                                }}/>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.navItem}*/}
                        {/*onPress={() => this.props.navigation.navigate('ShoppingCenter')}>*/}
                        {/*<View style={styles.iconWrapper}>*/}
                        {/*<Image*/}
                        {/*source={require('../../assets/icon/shopping.png')}*/}
                        {/*style={{*/}
                        {/*width: API.reset(34),*/}
                        {/*height: API.reset(34),*/}
                        {/*marginLeft: API.reset(-5),*/}
                        {/*}}/>*/}
                        {/*</View>*/}
                        {/*<Text style={styles.navName}>商城信息</Text>*/}
                        {/*<Image*/}
                        {/*source={require('../../assets/icon/right_arrow.png')}*/}
                        {/*style={{*/}
                        {/*width: API.reset(8),*/}
                        {/*height: API.reset(14)*/}
                        {/*}}/>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity style={styles.navItem}
                                          onPress={() => this.props.navigation.navigate('Setting', {
                                              refresh: async function () {
                                                  _this.fetchData();
                                              }
                                          })}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={require('../../assets/icon/setting.png')}
                                    style={{
                                        width: API.reset(22),
                                        height: API.reset(22)
                                    }}/>
                            </View>
                            <Text style={styles.navName}>设置</Text>
                            <Image
                                source={require('../../assets/icon/right_arrow.png')}
                                style={{
                                    width: API.reset(8),
                                    height: API.reset(14)
                                }}/>
                        </TouchableOpacity>
                    </View>

                </View></ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Center)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: API.reset(23),
        paddingRight: API.reset(23)
    },
    box: {
        paddingTop: API.reset(40),
        paddingLeft: API.reset(19),
        paddingRight: API.reset(19),
        paddingBottom: API.reset(40),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    portrait: {
        alignSelf: 'center',
        width: API.reset(71),
        height: API.reset(71),
        marginBottom: API.reset(17),
        borderRadius: API.reset(35)
    },
    name: {
        alignSelf: 'center',
        marginBottom: API.reset(22),
        fontWeight: 'bold',
        fontSize: 21,
        color: '#333'
    },
    smallWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: API.reset(28)
    },
    id: {
        color: '#5e2ec3'
    },
    small: {
        color: '#999'
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: API.reset(55),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    iconWrapper: {
        width: API.reset(50)
    },
    navName: {
        flex: 1,
        color: '#333'
    }
});
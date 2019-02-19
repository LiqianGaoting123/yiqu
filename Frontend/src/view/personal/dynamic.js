import React, {Component} from 'react'
import {
    TouchableOpacity,
    ImageBackground,
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
} from 'react-native'
import API from '../../static/methods'

// 星球动态，展示领导力排行榜
export default class Dynamic extends Component {

    constructor() {
        super();
        this.state = {
            refereshTime: '',
            list: []
        }
    }

    componentDidMount() {
        this.fetchList()
    }

    async fetchList() {
        let date = new Date();
        let refereshTime = `更新于${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/user/leadership/sort', formData}));
            let responseJson = await response.json();
            if (response.status) {
                this.setState({list: responseJson.leaderShipSortDtos, refereshTime: refereshTime})
            } else {
                API.toastLong('操作失败');
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    renderItem = (item, index) => {
        return (
            <View style={styles.item}>
                <View style={styles.indexWrapper}>
                    {index < 3
                        ? <Image
                            source={index === 0
                                ? require('../../assets/icon/first.png')
                                : index === 1
                                    ? require('../../assets/icon/second.png')
                                    : require('../../assets/icon/third.png')}
                            style={styles.indexImg}/>
                        : <Text style={styles.indexTxt}>{index + 1}</Text>}
                </View>
                <Text style={[styles.userName, styles.userNameTxt]}>{item.username}</Text>
                <Text style={styles.value}>{item.leadership}</Text>
            </View>
        )
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Decryption')}>
                        <ImageBackground
                            source={require('../../assets/images/decryption.png')}
                            style={styles.decryption}>
                            <Text style={styles.decryptionTitle}>星球解密</Text>
                            <Text style={styles.decryptionBrief}>揭开大师星球神秘面纱</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.list}>
                        <View style={styles.title}>
                            <Text style={styles.titleName}>创造力榜</Text>
                            {/*<Text style={styles.refereshTime}>{this.state.refereshTime}</Text>*/}
                        </View>
                        <View style={styles.header}>
                            <Text style={[styles.headerTxt, styles.index]}>名次</Text>
                            <Text style={[styles.headerTxt, styles.userName]}>用户名</Text>
                            <Text style={styles.headerTxt}>创造力值</Text>
                        </View>
                        <FlatList
                            data={this.state.list}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            style={styles.flatList}/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242048'
    },
    decryption: {
        width: API.reset(322),
        height: API.reset(143),
        paddingHorizontal: API.reset(19),
        paddingVertical: API.reset(28),
        marginTop: API.reset(14),
        marginHorizontal: API.reset(25),
        borderRadius: API.reset(15)
    },
    content: {
        flex: 1
    },
    decryptionTitle: {
        marginBottom: API.reset(24),
        fontWeight: 'bold',
        fontSize: 28,
        color: '#fff'
    },
    decryptionBrief: {
        fontSize: 17,
        color: '#fff'
    },
    list: {
        flex: 1,
        paddingTop: API.reset(28),
        marginTop: API.reset(28),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(230,230,230,.2)'
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: API.reset(25),
    },
    titleName: {
        fontSize: 17,
        color: '#fff'
    },
    refereshTime: {
        fontSize: 11,
        color: 'rgba(255,255,255,.6)'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: API.reset(25),
        paddingRight: API.reset(9),
        marginTop: API.reset(18),
        marginHorizontal: API.reset(25),
        backgroundColor: 'rgba(230,230,230,.2)'
    },
    headerTxt: {
        fontSize: 11,
        color: 'rgba(255,255,255,.6)'
    },
    index: {
        width: API.reset(38),
        textAlign: 'center'
    },
    indexWrapper: {
        alignItems: 'center',
        width: API.reset(38)
    },
    indexImg: {
        width: API.reset(22),
        height: API.reset(30)
    },
    userName: {
        flex: 1,
        paddingLeft: API.reset(45),
        paddingRight: API.reset(10)
    },
    userNameTxt: {
        fontWeight: 'bold',
        color: '#fff'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: API.reset(55),
        paddingVertical: API.reset(5),
        paddingHorizontal: API.reset(25),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(230,230,230,.2)'
    },
    indexTxt: {
        width: API.reset(38),
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff'
    },
    value: {
        paddingRight: API.reset(10),
        color: '#fff'
    },
    flatList: {
        flex: 1
    }
})
import React, {Component} from 'react'
import {
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StyleSheet, ImageBackground
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import API from '../../static/methods'
import NestedScrollView from 'react-native-nested-scroll-view'

// 创造力记录
let isListDidmount = false;
export default class Leadership extends Component {
    constructor() {
        super();
        this.state = {
            total: 0,
            list: [],
            page: 1,
            dataExist: false
        }
    }

    componentDidMount() {
        this.fetchRecord();
    }

    componentDidUpdate() {
        if (isListDidmount) {
            setTimeout(() => {
                isListDidmount = false
            }, 1000);
        }
    }

    async fetchRecord(page) {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/account/leadership/record', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    list: this.state.list.concat(responseJson.dtos)
                    // return responseJson.data.log.length
                    //     ? {
                    //         total: responseJson.data.total,
                    //         list: previousState.list.concat(responseJson.data.log),
                    //         page: previousState.page + 1,
                    //         dataExist: true
                    //     }
                    //     : {
                    //         total: responseJson.data.total,
                    //         page: page + 1,
                    //         dataExist: false
                    //     }
                })
            } else {
                API.toastLong('网络故障');
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    // loadMore(page) {
    //     if (this.state.dataExist) {
    //         if (!isListDidmount) {
    //             isListDidmount = true;
    //             this.fetchRecord(page)
    //         } else {
    //             this.setState(previousState => {
    //                 return {
    //                     list: previousState.list.concat()
    //                 }
    //             })
    //         }
    //     }
    // }

    getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    getTaskName(type) {
        if (type === 0)
            return '邀请新用户';
        else if (type === 1)
            return '完成实名认证';
        else if (type === 2)
            return '关注微信公众号';
        else if(type === 3)
            return '每日登陆';
    }

    renderItem = (item) => {
        return (
            <View style={styles.item}>
                <View style={styles.itemWrapper}>
                    <Text style={styles.type}>{this.getTaskName(item.type)}</Text>
                    <Text style={styles.date}>{item.time}</Text>
                </View>
                <Text style={styles.num}>{item.leadership}</Text>
            </View>
        )
    };

    // renderFooter() {
    //     return (
    //         <View
    //             style={{
    //                 flexDirection: 'row',
    //                 alignItems: 'center',
    //                 paddingHorizontal: API.reset(25)
    //             }}>
    //             <View
    //                 style={{
    //                     flex: 1,
    //                     height: StyleSheet.hairlineWidth,
    //                     backgroundColor: '#e6e6e6'
    //                 }}/>
    //             <View
    //                 style={{
    //                     width: 2,
    //                     height: 2,
    //                     marginHorizontal: 5,
    //                     borderRadius: 1,
    //                     backgroundColor: '#e6e6e6'
    //                 }}/>
    //             <View
    //                 style={{
    //                     flex: 1,
    //                     height: StyleSheet.hairlineWidth,
    //                     backgroundColor: '#e6e6e6'
    //                 }}/>
    //         </View>
    //     )
    // }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>创造力总数</Text>
                        <Text style={styles.total}>{this.props.navigation.state.params.total}</Text>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.boxTitle}>创造力简介</Text>
                        </View>
                        <Text
                            style={styles.content}>创造力是星球居民的成长表现形式，居民可以通过创造力获得星球中的艺能，同一时段内，创造力越高，获取到的艺能数量越多，进入星球的居民可以通过完成对应的创造力任务（如邀请朋友加入星球，每日登陆提高星球活跃度等）来获得创造力，由于目前星球正在初期搭建中，未来将会支持更多的创造力提升途径如课程学习等。</Text>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.boxTitle}>收支记录</Text>
                        </View>
                        <NestedScrollView style={styles.list} onScroll={(e) => {
                        }}>
                            {this.state.list.map((item) => this.renderItem(item))}
                            <Text style={styles.emptyText}>{this.state.list.length ? '没有更多数据了' : '暂无记录'}</Text>
                        </NestedScrollView>
                        {/* <FlatList
                            data={this.state.list}
                            renderItem={({ item }) => this.renderItem(item)}
                            ListEmptyComponent={() => {
                                return (
                                    <Text style={styles.emptyText}>暂无记录</Text>
                                )
                            }}
                            onEndReached={() => this.loadMore(this.state.page)}
                            onEndReachedThreshold={.1}
                            style={styles.list} /> */}
                    </View>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('GetLeadership')}>
                    <LinearGradient
                        start={{
                            x: 0,
                            y: 1
                        }}
                        end={{
                            x: 1,
                            y: 1
                        }}
                        locations={[0, 1]}
                        colors={['#1758DE', '#7617EB']}
                        style={styles.getLeadership}>
                        <Text style={styles.leadershipText}>获取创造力</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        paddingLeft: API.reset(47)
    },
    title: {
        marginBottom: API.reset(15),
        fontSize: 17,
        color: '#fff'
    },
    total: {
        marginBottom: API.reset(27),
        fontSize: 24,
        color: '#ffc000'
    },
    box: {
        paddingTop: API.reset(23),
        paddingBottom: API.reset(29),
        marginHorizontal: API.reset(23),
        marginBottom: API.reset(23),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    titleWrapper: {
        paddingLeft: API.reset(21),
        marginBottom: API.reset(19),
        borderLeftWidth: 3,
        borderLeftColor: '#2052e0'
    },
    boxTitle: {
        fontSize: 17,
        lineHeight: API.reset(25),
        color: '#2052e0'
    },
    content: {
        paddingHorizontal: API.reset(24),
        paddingBottom: API.reset(19),
        fontSize: 12,
        lineHeight: 18,
        color: '#666'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: API.reset(10),
        marginHorizontal: API.reset(25),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e6e6e6'
    },
    type: {
        marginBottom: API.reset(12),
        fontSize: 12
    },
    date: {
        fontSize: 12,
        color: '#999'
    },
    num: {
        fontSize: 15,
        color: '#284ce0'
    },
    list: {
        height: API.reset(293)
    },
    emptyText: {
        alignSelf: 'center',
        paddingVertical: 10,
        fontSize: 12,
        lineHeight: 18,
        color: '#666'
    },
    getLeadership: {
        alignItems: 'center',
        justifyContent: 'center',
        height: API.reset(44)
    },
    leadershipText: {
        fontSize: 17,
        color: '#fff'
    }
});
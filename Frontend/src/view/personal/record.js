import React, {Component} from 'react'
import {ScrollView, View, Text, StyleSheet, ImageBackground} from 'react-native'
import API from '../../static/methods'
import NestedScrollView from 'react-native-nested-scroll-view'

let isListDidmount = false;
export default class Record extends Component {
    constructor() {
        super();
        this.state = {
            total: 0,
            list: [],
            page: 1,
            dataExist: false,
        }
    }

    componentDidMount() {
        this.fetchRecord()
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
            // 得到艺能的交易记录
            let response = await API._fetch(API.GET({url: '/grain/record', formData}));
            let responseJson = await response.json();

            let response1 = await API._fetch(API.GET({url: '/profile/abstract', formData}));
            let responseJson1 = await response1.json();

            console.log(responseJson);
            if (response.status === 200) {
                this.setState(previousState => {
                    previousState
                        .list
                        .concat(responseJson.grainDtos);
                    return responseJson.grainDtos.length
                        ? {
                            total: responseJson1.balance,
                            list: previousState
                                .list
                                .concat(responseJson.grainDtos),
                            page: previousState.page + 1,
                            dataExist: true
                        }
                        : {
                            total: responseJson1.balance,
                            page: page + 1,
                            dataExist: false
                        }
                })
            } else {
                API.toastLong(responseJson.info)
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    renderItem = (item) => {
        return (
            <View style={styles.item}>
                <View style={styles.itemWrapper}>
                    <Text style={styles.type}>{item.type === 0 ? '日常领取' : '注册获得'}</Text>
                    <Text style={styles.date}>{item.time}</Text>
                </View>
                <Text style={styles.num}>+{item.value}</Text>
            </View>
        )
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>艺能总数</Text>
                        <Text style={styles.total}>{this.state.total}</Text>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.boxTitle}>艺能简介</Text>
                        </View>
                        <Text
                            style={styles.content}>艺能是依托于区块链技术，基于星球居民在星球中的活跃度所产生的奖励，它是数字星球生态内各方进行价值结算的基础，具有流通价值。艺能总量有限，且每2年产出量减少一半，随着时间的推移，艺能获取难度越来越大，越早入驻星球越有利。</Text>
                    </View>
                    <View style={styles.box}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.boxTitle}>收支记录</Text>
                        </View>
                        <NestedScrollView style={styles.list} onScroll={(e, i) => {
                            if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height / e.nativeEvent.contentSize.height > .9) {
                            }
                        }}>
                            {this.state.list.map((item) => this.renderItem(item))}
                            <Text style={styles.emptyText}>{this.state.list.length ? '没有更多数据了' : '暂无记录'}</Text>
                        </NestedScrollView>
                    </View>
                </ScrollView>
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
        color: '#df1bf1'
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
        fontSize: 12,
        lineHeight: 18,
        color: '#666'
    }
});
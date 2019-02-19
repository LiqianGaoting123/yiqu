import {
    FlatList,
    StyleSheet,
    View,
    Text,
    TouchableHighlight, Alert
} from "react-native";
import React, {Component} from "react";
import {connect} from "react-redux";
import API from "../../static/methods";

class Order extends Component {
    componentDidMount() {
        _this.fetchList();
    }

    async fetchList() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({
                url: '/profile/order/unpaid',
                formData
            }));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    data: responseJson.dtos
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            tabIndex: 0,
            data: this._sourceData,
            type: 'master',
        };
    }

    createEmptyView() {
        return (
            <Text style={{
                fontSize: 15,
                lineHeight: 18,
                color: '#666',
                fontWeight: 'bold',
                alignSelf: 'center',
                margin: API.reset(10)
            }}>目前尚无订单</Text>
        );
    }

    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;

    _sourceData = [];

    // 此函数展示一个卡片的内容
    _renderItem = ({item, index}) => {
        // this.setState({
        //     chosenSchedule: item,
        // });
        return (
            <View style={styles.itemCard}>
                {/*<View activeOpacity={0.9} onPress={() => {*/}
                {/*// this.setState({*/}
                {/*//     chosenSchedule: item*/}
                {/*// });*/}
                {/*// // 普通用户的预约点击之后的处理*/}
                {/*// this.state.type === 'master' ? this.masterAlert(item.dateState) : this.userAlert(item.dateState);*/}
                {/*}}>*/}
                <View style={styles.lineItem}>
                    <Text style={styles.itemTitle}>流水号</Text>
                    <Text style={styles.item}>{item.scheduleId}</Text>
                </View>
                <View style={styles.lineItem}>
                    <Text style={styles.itemTitle}>订单类型</Text>
                    <Text style={styles.item}>预约艺术家</Text>
                </View>
                <View style={styles.lineItem}>
                    <Text style={styles.itemTitle}>{this.state.tabIndex === 0 ? '应付' : '订单'}费用</Text>
                    <Text style={styles.item}>{item.price} GAB</Text>
                </View>
                {this.state.tabIndex === 1 ?
                    <View style={styles.lineItem}>
                        <Text style={styles.itemTitle}>订单状态</Text>
                        <Text
                            style={styles.item}>{item.status === 0 ? '付款中' : item.status === 1 ? '付款成功' : '付款失败'}</Text>
                    </View> : []}

                <View style={[styles.lineItem, {alignSelf: 'flex-end'}]}>
                    {this.state.tabIndex === 0 ? [
                            <Text onPress={() => this.cancelOrder(item.scheduleId, index)}
                                  style={styles.itemButton}>取消订单</Text>,
                            <Text onPress={() => this.payOrder(item.scheduleId, item.price)}
                                  style={[styles.itemButton, {color: '#2052e0', borderColor: '#2052e0'}]}>立即付款</Text>]
                        : item.status === 2 ? [<Text onPress={() => this.payOrder(item.scheduleId, item.price)}
                                                     style={styles.itemButton}>重新付款</Text>] : []}
                </View>
                {/*</View>*/}
            </View>
        );
    };

    async cancelOrder(orderId, index) {
        let formData = {scheduleId: orderId};
        try {
            let response = await API._fetch(API.POST({url: '/profile/order/cancel', formData}));
            if (response.status !== 200) {
                API.toastLong('取消失败');
            }
            else {
                let newData = [];
                newData = newData.concat(this.state.data);
                newData.splice(index, 1);
                this.setState({data: newData});
            }
        } catch (error) {
            API.toastLong('网络连接问题')
        }
    };

    payOrder(orderId, price) {
        this.props.navigation.navigate('Pay', {
            refresh: async function () {
                await _this.fetchList();
            },
            orderId: orderId,
            price: price,
        });
    };

    //四个按钮被按下时处理函数
    _naviTab0Pressed() {
        this.setState({
            tabIndex: 0,
        });
        this.fetchList();
    }

    async _naviTab1Pressed() {
        this.setState({
            tabIndex: 1,
        });
        let formData = {};
        try {
            let response = await API._fetch(API.GET({
                url: '/profile/order/paid',
                formData
            }));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    data: responseJson.dtos
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <View style={styles.background}>
                {/*<ImageBackground source={require('../../../src/assets/images/background.jpg')} style={styles.background}>*/}
                <View style={styles.navRow}>
                    <TouchableHighlight underLayColor='#e8e8e8'
                                        onPress={this._naviTab0Pressed.bind(this)}
                                        style={this.state.tabIndex === 0 ? styles.selectedButton : styles.button}>
                        <Text style={this.state.tabIndex === 0 ? styles.selectedTabTextStyle : styles.tabTextStyle}>
                            待付款
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight underLayColor='#e8e8e8'
                                        onPress={this._naviTab1Pressed.bind(this)}
                                        style={this.state.tabIndex === 1 ? styles.selectedButton : styles.button}>
                        <Text style={this.state.tabIndex === 1 ? styles.selectedTabTextStyle : styles.tabTextStyle}>
                            已付款
                        </Text>
                    </TouchableHighlight>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.data}
                    //使用 ref 可以获取到相应的组件
                    // ref={(flatList) => this._flatList = flatList}
                    //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                    ListEmptyComponent={this.createEmptyView()}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                {/*</ImageBackground>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        width: API.width,
        height: API.height - API.reset(68),
        backgroundColor: '#f0f0f0'
    },
    itemCard: { // card style
        padding: 2,
        flex: 1,
        backgroundColor: '#fff',
        marginLeft: API.reset(15),
        marginRight: API.reset(15),
        marginTop: API.reset(15),
        paddingVertical: API.reset(10),
        borderRadius: 10,
    },
    lineItem: { // every line of the card
        flexDirection: 'row',
        flex: 1
    },
    itemTitle: { // title of each line in card
        fontSize: 13,
        marginVertical: API.reset(4.5),
        marginRight: API.reset(10),
        marginLeft: API.reset(20),
        flex: 0.28,
        // textAlign: 'center',
        color: '#565656'
    },
    item: {  // common text of each line in card
        fontSize: 13,
        marginVertical: API.reset(4.5),
        marginHorizontal: API.reset(20),
        textAlign: 'right',
        flex: 0.72,
        color: '#272727'
    },
    itemButton: {  // button style of the card
        marginRight: API.reset(20),
        marginTop: API.reset(10),
        marginBottom: API.reset(4),
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#909090',
        color: '#909090',
        borderRadius: 15,
        padding: API.reset(8),
        paddingHorizontal: API.reset(15),
        textAlign: 'center'
    },

    // tab navigator
    navRow: {
        flexDirection: 'row',
        margin: 0
    },
    button: {
        width: API.width / 2, //导航栏每个标签宽度为屏幕1/3
        justifyContent: 'center',
        borderWidth: API.reset(2),
        borderColor: '#e8e8e8',
        borderBottomColor: '#e8e8e8',
        margin: 0,
    },
    selectedButton: {
        width: API.width / 2, //导航栏每个标签宽度为屏幕1/3
        justifyContent: 'center',
        borderWidth: API.reset(2),
        borderColor: '#e8e8e8',
        borderBottomColor: '#2052e0',
        margin: 0,
    },
    tabTextStyle: {
        fontSize: 13,
        textAlign: 'center',
        width: API.width / 2,
        paddingVertical: API.reset(8),
        marginHorizontal: 0,
        backgroundColor: '#e8e8e8',
        color: '#363636',
        borderWidth: 0,
    },
    selectedTabTextStyle: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        width: API.width / 2,
        paddingVertical: API.reset(8),
        marginHorizontal: 0,
        backgroundColor: '#e8e8e8',
        color: '#2052e0',
        borderWidth: 0
    }
});
export default connect(state => state.reducer)(Order);

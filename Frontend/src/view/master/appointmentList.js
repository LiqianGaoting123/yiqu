import {
    FlatList,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Button,
    ImageBackground,
    Alert
} from "react-native";
import React, {Component} from "react";
import PopupDialog from "react-native-popup-dialog/src/PopupDialog";
import DialogTitle from "react-native-popup-dialog/src/components/DialogTitle";
import {connect} from "react-redux";
import API from "../../static/methods";

class AppointmentList extends Component {
    componentDidMount() {
        this.fetchList();
    }

    async fetchList() {
        let formData = {};
        try {
            let response = this.props.navigation.state.params.type === 'master' ? await API._fetch(API.GET({
                url: '/master/schedule',
                formData
            })) : await API._fetch(API.GET({url: '/user/all/schedule', formData}));
            let responseJson = await response.json();
            console.log(responseJson);
            if (response.status === 200) {
                this.props.navigation.state.params.type === 'master' ?
                    this.setState({
                        data: responseJson.masterDateItemDtos
                    }) :
                    this.setState({
                        data: responseJson.userDateItemDtos
                    });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async refuse() {
        let formData = {'scheduleId': this.state.chosenSchedule.id};
        try {
            let response = await API._fetch(API.GET({
                url: '/master/schedule/' + this.state.chosenSchedule.id,
                formData
            }));

            if (response.status !== 200) {
                API.toastLong('操作失败')
            }
            else
                this.fetchList()
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async answer() {
        let formData = {'scheduleId': this.state.chosenSchedule.id};
        try {
            let response = await API._fetch(API.POST({
                url: '/master/schedule/' + this.state.chosenSchedule.id,
                formData
            }));

            if (response.status !== 200) {
                API.toastLong('操作失败')
            }
            else
                this.fetchList();
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            data: this._sourceData,
            show: false,
            chosenSchedule: {
                id: 1,
                username: '小二',
                day: '9月10日',
                location: '南京大学鼓楼校区',
                startHour: 5,
                endHour: 9,
                dateState: 1,
            },
            type: this.props.navigation.state.params.type,
        };
    }

    _footer = () => (
        <Text
            style={{
                fontSize: 12,
                lineHeight: 18,
                color: '#666',
                fontWeight: 'bold',
                alignSelf: 'center',
                margin: API.reset(10)
            }}>没有更多内容</Text>
    );

    createEmptyView() {
        return (
            <Text style={{fontSize: 40, alignSelf: 'center'}}>目前尚无预约</Text>
        );
    }

    userAlert(dateState) {
        if (dateState === 0)
            Alert.alert('温馨提示', "您已提交请求，等待艺术家同意");
        else if (dateState === 1)
            Alert.alert('温馨提示', "艺术家已同意该预约，请准时到达目的地");
        else if (dateState === 2)
            Alert.alert('温馨提示', "艺术家拒绝了您的请求，请改日再约");
        else
            Alert.alert('温馨提示', "您尚未付款，请前往 个人中心->我的订单 付款后查看预约进展");
    }

    masterAlert(dateState) {
        if (dateState === 0)
            this.popupDialog.show();
        else if (dateState === 1)
            Alert.alert('温馨提示', "您已同意该预约，请准时到达目的地");
        else
            Alert.alert('温馨提示', "您已拒绝了该请求");
    }

    getMasterDateState(dateState){
        if (dateState === 0)
            return '待同意';
        else if (dateState === 1)
            return '已同意';
        else
            return '已拒绝';
    }

    getUserDateState(dateState){
        if (dateState === 0)
            return '等待同意';
        else if (dateState === 1)
            return '已同意';
        else if (dateState === 2)
            return '已拒绝';
        else
            return '等待付款';
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
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    this.setState({
                        chosenSchedule: item
                    });
                    // 普通用户的预约点击之后的处理
                    this.state.type === 'master' ? this.masterAlert(item.dateState) : this.userAlert(item.dateState);
                }}>
                    <View style={styles.lineItem}>
                        <Image source={require('../../assets/icon/name.png')} style={styles.itemPicture}/>
                        <Text style={styles.itemTitle}>预约人</Text>
                        <Text style={styles.item}>{item.username}</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Image source={require('../../assets/icon/date.png')} style={styles.itemPicture}/>
                        <Text style={styles.itemTitle}>预约日期</Text>
                        <Text style={styles.item}>{this.state.type === 'master' ? item.day : item.date}</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Image source={require('../../assets/icon/time.png')} style={styles.itemPicture}/>
                        <Text style={styles.itemTitle}>预约时间</Text>
                        <Text style={styles.item}>{item.startHour} : 00 - {item.endHour} : 00</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Image source={require('../../assets/icon/place.png')} style={styles.itemPicture}/>
                        <Text style={styles.itemTitle}>预约地点</Text>
                        <Text style={styles.item}>{item.location}</Text>
                    </View>
                    <View style={styles.lineItem}>
                        <Image source={require('../../assets/icon/place.png')} style={styles.itemPicture}/>
                        <Text style={styles.itemTitle}>预约状态</Text>
                        <Text style={styles.item}>{this.state.type === 'master' ? this.getMasterDateState(item.dateState) : this.getUserDateState(item.dateState)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        return (
            //{/*<View style={styles.container}>*/}
            <ImageBackground source={require('../../../src/assets/images/background.jpg')} style={styles.background}>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.data}
                    //使用 ref 可以获取到相应的组件
                    // ref={(flatList) => this._flatList = flatList}
                    // ListHeaderComponent={this._header}//header头部组件
                    ListFooterComponent={this._footer}//footer尾部组件
                    //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                    ListEmptyComponent={this.createEmptyView()}
                    keyExtractor={this._keyExtractor}
                    //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                    //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                    //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                    getItemLayout={(data, index) => ({length: 44, offset: (44 + 1) * index, index})}
                    renderItem={this._renderItem}
                />
                <PopupDialog
                    dialogTitle={<DialogTitle title="回复"/>}
                    ref={popupDialog => {
                        this.popupDialog = popupDialog;
                    }}
                    width={280}
                    height={300}
                >
                    <View>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 22,
                            margin: 20,
                            height: 170,
                        }}>您好，请问您要在{this.state.chosenSchedule.date} {this.state.chosenSchedule.startHour} : 00
                            - {this.state.chosenSchedule.endHour} : 00
                            前往{this.state.chosenSchedule.location}赴约吗？</Text>
                        <View style={{
                            flexDirection: 'row',
                            height: 30,
                            marginBottom: 1
                        }}>
                            <View style={styles.button1}>
                                <Button title={'残忍拒绝'} color={'red'} onPress={() => {
                                    this.popupDialog.dismiss();
                                    this.refuse();
                                }}/>
                            </View>
                            <View style={styles.button2}>
                                <Button title={'同意'} onPress={() => {
                                    this.popupDialog.dismiss();
                                    this.answer();
                                }}/>
                            </View>
                        </View>
                    </View>
                </PopupDialog>
            </ImageBackground>
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: API.width,
        height: API.height - 60
    },
    background: {
        width: API.width,
        height: API.height,
    },
    lineItem: {
        flexDirection: 'row',
        flex: 1
    },
    itemPicture: {
        width: API.reset(19),
        height: API.reset(19),
        marginLeft: API.reset(15),
        marginTop: API.reset(2),
        // margin: 3
        // flex: 0.1
    },
    itemTitle: {
        fontSize: 15,
        marginVertical: API.reset(4),
        marginRight: API.reset(10),
        marginLeft: API.reset(5),
        flex: 0.28,
        // textAlign: 'center',
        color: '#c5c5c5'
    },
    item: {
        fontSize: 15,
        marginVertical: API.reset(4),
        marginHorizontal: API.reset(16),
        textAlign: 'right',
        flex: 0.72,
        color: '#ffffff'
    },
    itemMoney: {
        fontSize: 16,
        margin: API.reset(5),
        color: 'red',
        fontWeight: 'bold'
    },
    itemCard: {
        padding: 2,
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginLeft: API.reset(10),
        marginRight: API.reset(10),
        marginVertical: API.reset(10),
        paddingVertical: API.reset(10),
        borderWidth: 1,
        borderColor: '#0d4cb3',
        borderRadius: 10,
    },
    actionButtonIcon: {
        fontSize: 8,
        color: 'white',
        height: API.reset(10),
        width: API.reset(10),
    },
    button1: {
        flex: 0.5,
    },
    button2: {
        flex: 0.5,
    }
});
export default connect(state => state.reducer)(AppointmentList);

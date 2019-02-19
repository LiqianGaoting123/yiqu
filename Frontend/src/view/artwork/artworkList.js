import {
    FlatList,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    Alert
} from "react-native";
import React, {Component} from "react";
import {connect} from "react-redux";
import API from "../../static/methods";

class ArtworkList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this._sourceData,
            refreshing: false, //初始化不刷新
            page: 1,
            isEnd: false,
            searchText: '',
            type: this.props.navigation.state.params.type,
        };
    }

    componentDidMount() {
        if (this.props.navigation.state.params.searchContent)
            this.search(this.props.navigation.state.params.searchContent);
        else
            this.fetchList();

        // 添加监听者
        this.listener = DeviceEventEmitter.addListener('searchArtworkInList', (text) => {
            this.search(text);
        });
    }

    // 第一次搜索
    async search(text) {
        let formData = {keyword: text, pageIndex: 1};
        try {
            let response = await API._fetch(API.POST({url: '/user/artwork', formData}));
            console.log(response);

            if (response.status === 200) {
                let responseJson = await response.json();
                this.setState({data: responseJson.artworkItemDtos, searchText: text, page: 1})
            } else {
                this.setState({data: [], searchText: text, page: 1})
            }
        } catch (error) {
            API.toastLong('网络故障')
        }
    }

    // 更新列表，分页
    async fetchArtwork() {
        let formData = {keyword: this.state.searchText, pageIndex: this.state.page + 1};

        try {
            let response = await API._fetch(API.POST({url: '/user/artwork', formData}));
            let responseJson = await response.json();

            if (response.status === 200) {
                let newData = responseJson.artworkItemDtos;
                newData.length < 20 ? this.setState({
                    data: this.state.data.concat(newData),
                    isEnd: true
                }) : this.setState({data: this.state.data.concat(newData), page: this.state.page + 1});
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async fetchList() {
        // 有多重类型的list
        // type：'mystar' 我关注的, 'self' 艺术家我的艺术品, 'all' 所有艺术品
        if (this.state.type === 'mystar') { //用户关注的艺术品
            try {
                let formData = {};
                let response = await API._fetch(API.GET({url: '/user/artwork/self', formData}));
                console.log(response);
                if (response.status === 200) {
                    let responseJson = await response.json();
                    let artworkItemDtos = responseJson.artworkItemDtos;
                    this.setState({
                        data: artworkItemDtos,
                    })
                }
                else
                    this.setState({data: []})
            } catch (error) {
                API.toastLong('操作失败');
            }
        }
        else if (this.state.type === 'self') { // 艺术家我的艺术品
            try {
                let formData = {};
                let response = await API._fetch(API.GET({url: '/master/artwork', formData}));
                if (response.status === 200) {
                    let responseJson = await response.json();
                    let artworkItemDtos = responseJson.artworkItemDtos;
                    this.setState({
                        data: artworkItemDtos,
                    })
                }
                else
                    this.setState({data: []})
            } catch (error) {
                API.toastLong('操作失败');
            }
        }
        else if (this.state.type === 'all') {
            this.search('');
        }
    }

    _footer = () => (
        <Text
            style={{
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 12,
                lineHeight: 18,
                color: '#666',
                margin: API.reset(10)
            }}>没有更多内容</Text>
    );

    createEmptyView() {
        return (
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                alignSelf: 'center',
                color: '#9b9b9b',
                marginVertical: API.reset(300),
                flex: 1,
                // marginTop: API.reset(200),
            }}>目前尚无艺术品</Text>
        );
    }

    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;

    // itemClick(item, index) {
    //     alert('点击了第' + index + '项，电影名称为：' + item.name);
    // }

    async onStar(id, index) {
        let formData = {token: token};
        try {
            let response = await API._fetch(API.GET({url: '/star/artwork/' + id, formData}));
            if (response.status === 200) {
                let temp = this.state.data;
                temp[index].isStar = !temp[index].isStar;
                this.setState({data: temp});
            }
            else
                API.toastLong('操作失败');
        }
        catch (error) {
            API.toastLong('操作失败');
        }
    }

    // 此函数展示一个卡片的内容
    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity style={styles.itemCard}
                              activeOpacity={0.9}
                // onPress={this.itemClick.bind(this, item, index)}>
                              onPress={() => this.props.navigation.navigate('ArtworkDetail', {id: item.id})}>

                <Image source={{uri: item.coverUrl}}
                       style={styles.leftImageStyle}/>

                <View style={styles.rightViewStyle}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.item}>艺术家: {item.master}</Text>
                    <View style={{flexDirection: 'row', marginTop: API.reset(8), flex: 1, height: 40}}>
                        <Text style={styles.itemMoney}>￥{item.price}</Text>
                        {/*<Image source={require('../../../src/images/add.png')} style={styles.followImg}/>*/}
                        {/*<Text style={styles.span}*/}
                        {/*onPress={() => this.onStar(item.id, index)}>{this.state.data[index].isStar ? '已关注' : '关注'}</Text>*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    _sourceData = [];

    _newData = [];

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.data}
                    //使用 ref 可以获取到相应的组件
                    ref={(flatList) => this._flatList = flatList}
                    ListFooterComponent={this._footer}//footer尾部组件
                    //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                    ListEmptyComponent={this.createEmptyView()}
                    keyExtractor={this._keyExtractor}
                    //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                    //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                    //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                    // getItemLayout={(data, index) => ({length: 44, offset: (44 + 1) * index, index})}
                    //决定当距离内容最底部还有多远时触发onEndReached回调。
                    //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                    onEndReachedThreshold={0.1}
                    //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
                    onEndReached={({distanceFromEnd}) => (
                        !this.state.isEnd && this.state.type === 'all' ? '' : this.fetchArtwork()
                        // setTimeout(() => {
                        //     this.state.isEnd ? '' : this.fetchArtwork();
                        // }, 3000)
                    )}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({refreshing: true});//开始刷新
                        //这里模拟请求网络，拿到数据，3s后停止刷新
                        setTimeout(() => {
                            Alert.alert('提示','没有可刷新的内容！');
                            this.setState({refreshing: false});
                        }, 3000);
                    }}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            width: API.width,
            height: API.height - API.reset(68),
            marginTop: API.reset(5)
            // backgroundColor: '#34226e'
        },
        itemTitle: {
            fontSize: 20,
            margin: API.reset(10),
            fontWeight: 'bold',
            color: '#593dce',
        },
        item: {
            fontSize: 15,
            margin: API.reset(10),
        },
        itemCard: {
            padding: API.reset(2),
            flex: 1,
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
        },
        leftImageStyle: {
            width: API.reset(140),
            height: API.reset(140),
            marginVertical: API.reset(8),
            marginLeft: API.reset(10),
            borderRadius: 5,
        },
        rightViewStyle: {
            height: API.reset(146),
            marginLeft: API.reset(160),
            marginTop: API.reset(-146),
        },
        itemMoney: {
            fontSize: 23,
            margin: API.reset(5),
            color: 'red',
            flex: 1,
            marginTop: API.reset(12),
        },
        span: {
            // marginLeft: 3,
            // marginTop: 0,
            // fontWeight: 'bold',
            // color: '#898989',
            // fontSize: 13,
            textAlign: 'center',
            // marginRight: 10,
            marginVertical: API.reset(10),
            marginLeft: API.reset(10),
            paddingTop: 5,
            flex: 0.3,
            height: 27,
            width: 115,
            color: '#e16531',
            // color: '#593dce',
            fontWeight: 'bold',
            borderRadius: 13.5,
            borderWidth: 1,
            // borderColor: '#593dce'
            borderColor: '#e16531'

        },

    });
export default connect(state => state.reducer)(ArtworkList);

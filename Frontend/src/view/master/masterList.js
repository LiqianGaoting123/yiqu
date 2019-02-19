import {
    FlatList,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity, DeviceEventEmitter,
} from "react-native";
import React, {Component} from "react";
import {connect} from "react-redux";
import API from "../../static/methods";

class MasterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this._sourceData,
            type: 'all',
            page: 1,
            searchText: '',
            isEnd: false,
        }
    }

    componentDidMount() {
        if (this.props.navigation.state.params.searchContent)
            this.search(this.props.navigation.state.params.searchContent);
        else
            this.fetchList();

        this.listener = DeviceEventEmitter.addListener('searchMasterInList', (text) => {
            this.search(text);
        })
    }

    async search(text) {
        this.setState({type: 'all', searchText: text, page: 1});
        // 搜索
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/master/search/' + text, formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({data: responseJson.masterItemDtos})
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    // 更新列表，分页
    async fetchMaster() {
        // TODO 等测试
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
        // 有多重类型的list,目前只有一个
        // type：'mystar' 我关注的
        let type = this.props.navigation.state.params.type;
        let formData = {};
        console.log(this.props.navigation.state.params.type);
        if (type === 'mystar') {
            try {
                // 加载我关注的艺术家
                let response = await API._fetch(API.GET({url: '/user/master/self', formData}));
                if (response.status === 200) {
                    let responseJson = await response.json();
                    let masterItemDtos = responseJson.masterItemDtos;
                    this.setState({
                        data: masterItemDtos,
                    })
                }
                else
                    API.toastLong('操作失败');
            } catch (error) {
                API.toastLong('操作失败');
            }
        }
    }

    _footer = () => (
        <Text
            style={{
                fontSize: 12,
                lineHeight: 18,
                color: '#666', fontWeight: 'bold', alignSelf: 'center', margin: 10
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
            }}>目前尚无艺术家</Text>
        );
    }

    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;

    // itemClick(item, index) {
    //     alert('点击了第' + index + '项，电影名称为：' + item.name);
    // }

    // 此函数展示一个卡片的内容
    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                style={{
                    marginLeft: index % 2 === 0 ? 20 : API.width / 2 + 10,
                    marginTop: index % 2 === 0 ? 15 : -API.width / 2,
                    width: API.width / 2 - 30,
                    height: API.width / 2,
                    backgroundColor: '#fff',
                }}
                activeOpacity={0.9}
                onPress={() => {
                    this.props.navigation.navigate('MasterDetail', {masterId: item.phoneNumber});
                }}
            >
                {/*// onPress={this.itemClick.bind(this, item, index)}>*/}
                <Image source={{uri: item.avatarUrl}}
                       style={{
                           width: API.width / 2 - 50,
                           height: API.width / 2 - 50,
                           margin: 10,
                       }}/>

                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                }}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    _sourceData = [];

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    //使用 ref 可以获取到相应的组件
                    ref={(flatList) => this._flatList = flatList}
                    // ListHeaderComponent={this._header}//header头部组件
                    ListFooterComponent={this._footer}//footer尾部组件
                    //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                    ListEmptyComponent={this.createEmptyView()}
                    keyExtractor={this._keyExtractor}
                    //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                    //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                    //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                    getItemLayout={(data, index) => ({length: 44, offset: (44 + 1) * index, index})}
                    //决定当距离内容最底部还有多远时触发onEndReached回调。
                    //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                    onEndReachedThreshold={0.1}
                    onEndReached={() => (
                        !this.state.isEnd && this.state.type === 'all' ? '' : this.fetchMaster()
                        // setTimeout(() => {
                        //     this.state.isEnd ? '' : this.fetchArtwork();
                        // }, 3000)
                    )}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: API.width,
        backgroundColor: '#f0f0f0'
    },
});
export default connect(state => state.reducer)(MasterList);

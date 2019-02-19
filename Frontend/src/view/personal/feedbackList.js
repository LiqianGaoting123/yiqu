import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, FlatList, StyleSheet } from 'react-native';
import API from '../../static/methods'
class FeedbackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }
    componentDidMount() {
        this.fetchData()
    }
    async fetchData() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({ url: '/profile/feedback/self', formData }));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({ list: responseJson.dtos})
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }
    renderItem(item) {
        return (<TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('FeedbackDetail', item)}>
            <Image defaultSource={require('../../assets/icon/default_icon.png')} source={{ uri: item.url }} style={styles.img} />
            <View style={styles.text}>
                <Text style={styles.brief} numberOfLines={3}>
                    {item.content}
                </Text>
                <Text style={styles.date}>
                    {item.type}
                </Text>
            </View>
        </TouchableOpacity>)
    }
    renderEmptyComponent() {
        return <Text style={styles.emptyComponent}>暂无数据</Text>
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.list}
                    renderItem={({ item }) => this.renderItem(item)}
                    ListEmptyComponent={() => this.renderEmptyComponent()}
                />
            </View>
        );
    }
}

export default FeedbackList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: API.reset(10),
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1
    },
    img: {
        width: API.reset(90),
        height: API.reset(80),
        marginRight: API.reset(10),
    },
    text: {
        flex: 1
    },
    brief: {
        height: API.reset(45),
        marginBottom: API.reset(10),
        lineHeight: API.reset(15),
    },
    date: {
        color: '#9b9b9b'
    },
    emptyComponent: {
        alignSelf: 'center',
        paddingVertical: 10,
    }
});
import React, {Component} from 'react';
import {View, WebView, ActivityIndicator, Text, Alert, ScrollView} from 'react-native';
import API from '../../static/methods';

class Protacol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            component: () => {
                return (<ActivityIndicator/>)
            }
        };
    }

    componentDidMount() {
        this.fetchArticle();
        // this.props.navigation.addListener('didFocus', res => {
        //
        //
        //     this.setState({
        //         component: () => {
        //             return (<Text style={{textAlign: 'center', marginHorizontal: 20}}></Text>)
        //         }
        //     })
        // })
    }

    async fetchArticle() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/account/contract', formData}));
            console.log(response);
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({
                    content: responseJson.content,
                    component: () => {
                        return (
                            <Text style={{textAlign: 'center', margin: 20, fontSize: 20}}>{responseJson.content}</Text>)
                    }
                })
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            Alert.alert('操作失败', error);
            API.toastLong('操作失败')
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <ScrollView style={{
                height: API.height,
                width: API.width
            }}>
                <View>
                    <Text style={{margin: 16, fontSize: 16}}>{this.state.content}</Text>
                </View>
            </ScrollView>
        );
    }
}

export default Protacol;

import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {connect} from 'react-redux'

class Article extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        // 新闻界面
        return (
            <View>
                <Text style={{fontWeight: 'bold', textAlign: 'center', margin: 10, fontSize: 18}}>
                    {this.props.navigation.state.params.id}
                </Text>
                {/*<Text style={{marginVertical: 10, marginLeft: 5}}>*/}
                    {/*操作步骤:*/}
                {/*</Text>*/}
                <Text style={styles.text}>
                    {this.props.navigation.state.params.content}
                </Text>
                {/*<Text style={styles.text}>*/}
                    {/*2.点击右下角"我的"，然后点击"绑定手机号"，请绑定注册"数字星球"APP的手机号*/}
                {/*</Text>*/}
                {/*<Text style={styles.text}>*/}
                    {/*3.完成绑定，点击我的粒子您就可以看到目前自己的粒子个数啦，粒子可以抵扣各种费用哦！还等什么，赶快来数字星球学院体验吧！*/}
                {/*</Text>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 20,
        marginVertical: 10,
    }
});

export default connect((state) => state.reducer)(Article)
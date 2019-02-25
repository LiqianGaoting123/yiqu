import React from 'react';
import {
    Text, View, StyleSheet,
    Image,
} from 'react-native';

export default class Teaching extends React.Component {
    render() {
        return (
            <View>
                <View style={styles.box}>
                    <View style={styles.name}>
                        <Text style={styles.title}>涂来涂去吴江中心</Text>
                    </View>
                    <View style={styles.borderbox}>
                        <View style={styles.container}>
                            <Text style={styles.figure}>28</Text>
                            <Text style={styles.figure}>请假处理</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.figure}>17</Text>
                            <Text style={styles.figure}>续费提醒</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.figure}>0</Text>
                            <Text style={styles.figure}>欠费待补交</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.course}>
                    <View style={styles.case} >
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children} onPress={() => this.props.navigation.navigate('Exchange')}> 老师 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 学员 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 班级 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 课程/收费 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 课表 </Text>
                    </View><View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 上课记录 </Text>
                    </View><View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 作业/评价 </Text>
                    </View><View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 请假/申请 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 通知中心 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 学员档案 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 小麦秀 </Text>
                    </View>
                    <View style={styles.case}>
                        <Image style={styles.icon} source={require('../../assets/home.jpg')} />
                        <Text style={styles.children}> 更多 </Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    box: {
        backgroundColor: 'orange',
        height: 150,
    },
    name: {
        height: 30,
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
    },
    borderbox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    container: {
        fontSize: 20,
        height: 60,
        width: 90,
        textAlign: 'center',
        textAlignVertical: 'center',
        margin: 10,
    },
    figure: {
        textAlign: 'center',
        color: 'white',
        lineHeight: 30,
        fontSize: 18,
    },
    course: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    case: {
        fontSize: 20,
        height: 60,
        width: 70,
        marginTop: 20,
        marginLeft: 15,
        // borderWidth:1
    },
    children: {
        marginTop: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    icon: {
        height: 50,
        width: 60,
        alignItems: 'center'
    },

})
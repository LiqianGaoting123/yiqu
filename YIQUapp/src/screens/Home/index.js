import React from 'react';
import {
  Button, Text, View, StyleSheet,
  Image,
} from 'react-native';
import ChattingDetail from "../ChattingDetail";
import Teaching from  "../Teaching/index"
export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.parent}>
          <Text style={styles.childfirst}> 交流 </Text>
          <Text style={styles.childsecond} onPress={() => this.props.navigation.navigate('Resources')}> 资源 </Text>
          <Text style={styles.childthird} onPress={() => this.props.navigation.navigate('Teaching')}> 助教 </Text>
        </View>
        <View style={styles.imgs}>
          <Image source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550732049198&di=184426a6209d06f8c1f86db50bb837bc&imgtype=0&src=http%3A%2F%2Fwww.pig66.com%2Fuploadfile%2F2017%2F1230%2F20171230032029905.png' }}
            style={{ width: 360, height: 150, }} />
        </View>
        <View style={styles.course}>
          <Text style={styles.children}> 艺考专业课程 </Text>
          <Text style={styles.children}> 名师课堂 </Text>
          <Text style={styles.children}> 最新直播 </Text>
          <Text style={styles.children}> 少儿美术 </Text>
          <Text style={styles.children}> 美术培训机构 </Text>
          <Text style={styles.children}> 热推课程 </Text>
        </View>
        <View style={styles.information}>
          <Text style={styles.admission}> 招生信息: </Text>
          <Text style={styles.admission}> 1、艺术专业考试报名时间</Text>
          <Text style={styles.admission}> 2、艺术考试报名地点 </Text>
          <Text style={styles.apply}> 3、报名须知</Text>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  parent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  childfirst: {
    backgroundColor: 'red',
    width: 80,
    height: 35,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  childsecond: {
    backgroundColor: 'green',
    width: 70,
    height: 35,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5
  },
  childthird: {
    backgroundColor: 'red',
    width: 80,
    height: 35,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  imgs: {
    marginTop: 50,
  },

  course: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  children: {
    backgroundColor: 'red',
    fontSize: 20,
    height: 80,
    width: 100,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5
  },
  information: {
    marginTop: 190,
    width: 320,
    height: 100,
    margin: 20,
  }

});


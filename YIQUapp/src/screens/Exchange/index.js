import React from 'react';
import { Text, View, StyleSheet,
    Image,TextInput} from 'react-native';

export default class Exchange extends React.Component {
  render() {
    return (
      <View>
      
                    <View style={styles.name}>
                        <Text style={styles.title}>全部老师</Text>
                    </View>
                    <View>
                    <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} />
                    </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    box: {
        backgroundColor: 'orange',
        height: 30,
    },
    name: {
        height: 30,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    },
})
import React from 'react';
import {Button, Text, View} from 'react-native';

export default class Chatting extends React.Component {

  render() {
    return (
      <View>
        <Text>趣信</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('ChattingDetail')}
        />
      </View>
    );
  }
}

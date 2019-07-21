import React from 'react'
import { View as NativeView, Text, Image, Button, TextInput, TouchableOpacity, TouchableWithoutFeedback, SectionList } from 'react-native'
import Slider from 'react-native-slider'

import { withLayoutProps } from '../../core/utils/layout'
import { Spacer, Divider, Toolbar } from '../../core/components'

const View = withLayoutProps(NativeView)

const PanelHeader = ({ heading }) => {
  return (
  <View style={{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'hsla(0, 0%, 0%, 0.05)'}}>
    <Text style={{fontWeight: '700', color: 'hsl(0, 0%, 25%)'}}>{heading}</Text>
  </View>
  )
}

const AppPropertiesPanel = ({ theme, selectedShapes, setOpacity }) => {
  const handleOpacityValueChange = opacity => {
    setOpacity(selectedShapes[0].id, opacity)
  }

  return (
    <View width={256} style={{backgroundColor: theme.backgroundColor,
      borderLeftWidth: 0.5,
      borderLeftColor: theme.borderColor,
    }}>
      <PanelHeader heading="Properties" />
      <View horizontal style={{ paddingVertical: 5, paddingHorizontal: 10}}>
        <Slider
          minimumTrackTintColor="rgb(33, 150, 243)"
          thumbTintColor="white"
          style={{flex: 1}}
          disabled={!selectedShapes[0]}
          thumbStyle={{
            boxShadow: [
              '0 0 3px rgba(0, 0, 0, 0.1)', // Soft shadow
              // '0 2px 1px rgba(0, 0, 0, 0.1)',  // Drop shadow
              '0 0 1px rgba(0, 0, 0, 0.5)',    // Sharp shadow
            ].join(', '),
          }}
          value={selectedShapes[0] && selectedShapes[0].opacity}
          onValueChange={handleOpacityValueChange}
        />
        <Spacer />
        <TextInput
          value={selectedShapes[0] ? selectedShapes[0].opacity.toFixed(2) : '0.00'}
          // onChangeText={text => setOpacity(text)}
          // onKeyPress={handleOpacityKeyPress}
          style={{width: 35}}
        />
      </View>
      
      <SectionList
        renderSectionHeader={({section: {title}}) => (
          <View style={{paddingVertical: 5, paddingHorizontal: 10, marginTop: 10}}>
            <Text style={{fontWeight: '700'}}>{title}</Text>
          </View>
        )}
        renderItem={({item, index, section}) => (
          <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'white'}}>
            <Text key={index}>{item}</Text>
          </View>
        )}
        sections={[
          {title: 'Title1', data: ['item1', 'item2']},
          {title: 'Title2', data: ['item3', 'item4']},
          {title: 'Title3', data: ['item5', 'item6']},
        ]}
      />
    </View>
  )
}

export default AppPropertiesPanel

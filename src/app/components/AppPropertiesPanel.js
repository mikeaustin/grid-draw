import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, Image, Button, TextInput, SectionList } from 'react-native'
import Slider from 'react-native-slider'

import { View, Spacer, Divider, Toolbar } from 'core/components'
import PanelHeader from './PanelHeader'

const styles = StyleSheet.create({
  numericInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'hsla(0, 0%, 0%, 0.1)',
  },
  textInput: {
    width: 50,
    padding: 5,
    paddingRight: 20,
    textAlign: 'right',
  },
  unitText: {
    position: 'absolute',
    right: 5,
  }
})

const valueOrBlank = (value, callback) => (
  value !== undefined
    ? (callback ? callback() : value)
    : '––'
)

const NumericInput = ({ value, disabled, onSubmit }) => {
  const [text, setText] = useState('––')

  useEffect(() => {
    setText(valueOrBlank(value, () => value.toFixed(0)))
  }, [value])

  const handleChangeText = useCallback(text => {
    setText(valueOrBlank(text))
  })

  const handleBlur = useCallback(event => {
    onSubmit(Math.max(0, Math.min(100, Number(text))))
  })

  return (
    <View horizontal align="center" style={styles.numericInput}>
      <TextInput
        value={text}
        maxLength={3}
        disabled={disabled}
        selectTextOnFocus
        style={styles.textInput}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
      />
      <Text style={styles.unitText}>%</Text>
    </View>
  )
}

const AppPropertiesPanel = ({ theme, selectedShapes, setOpacity }) => {
  const handleOpacityValueChange = opacity => {
    setOpacity(selectedShapes[0].id, opacity)
  }

  const handleOpacityInputSubmit = opacity => {
    setOpacity(selectedShapes[0].id, opacity / 100)
  }

  return (
    <View width={256} style={{backgroundColor: theme.backgroundColor,
      borderLeftWidth: 0.5,
      borderLeftColor: theme.borderColor,
    }}>
      <PanelHeader heading="Properties" />
      <View horizontal align="center" style={{ paddingVertical: 5, paddingHorizontal: 10}}>
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
        <NumericInput
          value={selectedShapes[0] && selectedShapes[0].opacity * 100}
          disabled={!selectedShapes[0]}
          onSubmit={handleOpacityInputSubmit}
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

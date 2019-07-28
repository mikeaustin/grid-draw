import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, Text, Image, Button, TextInput, SectionList } from 'react-native'
import Slider from 'react-native-slider'

import { View, Spacer, Divider, Toolbar } from 'core/components'
import PanelHeader from './PanelHeader'
import { ActionTypes } from 'app/actions/common'

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

const refocus = textInput => {
  textInput.current.blur()
  setTimeout(() => textInput.current.focus(), 0)
}

/**
 * NumericInput
 * @param {} param0 
 */
const NumericInput = ({ value, maxLength, width, units, disabled, onSubmit }) => {
  const [text, setText] = useState('––')
  const textInput = useRef()
  const [unitsWidth, setUnitsWidth] = useState(0)

  useEffect(() => {
    console.log('useEffect')
    setText(valueOrBlank(value, () => value.toFixed(0)))
  }, [value])

  const handleSubmit = useCallback(value => {
    // const clippedValue = Math.max(0, Math.min(100, value))
    const clippedValue = value

    console.log('handleSubmit')
    onSubmit(clippedValue)
  })

  const handleChangeText = useCallback(text => {
    setText(valueOrBlank(text))
  })

  const handleKeyPress = event => {
    const increment = event.nativeEvent.shiftKey ? 10 : 1

    if (event.nativeEvent.key === 'ArrowUp') {
      refocus(textInput)
      handleSubmit(Number(text) + increment)
    } else if (event.nativeEvent.key === 'ArrowDown') {
      refocus(textInput)
      handleSubmit(Number(text) - increment)
    }
  }

  const handleBlur = useCallback(event => {
    handleSubmit(Number(text))
  })

  const handleLayout = useCallback(event => {
    setUnitsWidth(event.nativeEvent.layout.width)
  })

  return (
    <View horizontal align="center" style={styles.numericInput}>
      <TextInput
        ref={textInput}
        value={text}
        maxLength={maxLength}
        disabled={disabled}
        selectTextOnFocus
        style={[styles.textInput, {width, paddingRight: unitsWidth + 7}]}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        onBlur={handleBlur}
      />
      <Text style={styles.unitText} onLayout={handleLayout}>{units}</Text>
    </View>
  )
}

const AppPropertiesPanel = ({ theme, selectedShapes, setOpacity, transformShape }) => {
  const handleOpacityValueChange = opacity => {
    setOpacity(selectedShapes[0].id, opacity)
  }

  const handleOpacitySubmit = opacity => {
    setOpacity(selectedShapes[0].id, opacity / 100)
  }

  const handlePositionXSubmit = positionX => {
    transformShape(selectedShapes[0].id, ActionTypes.MOVE_SHAPE, {
      x: positionX - selectedShapes[0].position.x, y: 0
    })
  }

  const handlePositionYSubmit = positionY => {
    transformShape(selectedShapes[0].id, ActionTypes.MOVE_SHAPE, {
      x: 0, y: positionY - selectedShapes[0].position.y
    })
  }

  const selectedShape = selectedShapes[0] || { position: {}, opacity: null }

  return (
    <View
      width={256}
      style={{marginTop: 1, backgroundColor: theme.backgroundColor}}
      borderStyle={{borderLeftWidth: 1, left: -1, borderColor: 'hsla(0, 0%, 0%, 0.1)'}}
    >
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
          width={50} maxLength={3} units="%" value={selectedShape.opacity * 100} disabled={!selectedShapes[0]} onSubmit={handleOpacitySubmit}
        />
      </View>
      <View horizontal align="center" style={{ paddingVertical: 5, paddingHorizontal: 10}}>
        <Text>X</Text>
        <Spacer size="xsmall" />
        <NumericInput width={65} maxLength={4} units="px" value={selectedShape.position.x} disabled={!selectedShapes[0]} onSubmit={handlePositionXSubmit} />
        <Spacer />
        <Text>Y</Text>
        <Spacer size="xsmall" />
        <NumericInput width={65} maxLength={4} units="px" value={selectedShape.position.y} disabled={!selectedShapes[0]} onSubmit={handlePositionYSubmit}
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

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { View, Text, Spacer, Divider } from 'core/components'

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
    outlineWidth: 1,
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
    setText(valueOrBlank(value, () => value.toFixed(0)))
  }, [setText, value])

  const handleSubmit = useCallback(value => {
    // const clippedValue = Math.max(0, Math.min(100, value))
    const clippedValue = value

    onSubmit(clippedValue)
  }, [onSubmit])

  const handleChangeText = useCallback(text => {
    setText(valueOrBlank(text))
  }, [setText])

  const handleKeyPress = useCallback(event => {
    const increment = event.nativeEvent.shiftKey ? 10 : 1

    if (event.nativeEvent.key === 'ArrowUp') {
      refocus(textInput)
      handleSubmit(Number(text) + increment)
    } else if (event.nativeEvent.key === 'ArrowDown') {
      refocus(textInput)
      handleSubmit(Number(text) - increment)
    }
  }, [handleSubmit, text])

  const handleBlur = useCallback(event => {
    handleSubmit(Number(text))
  }, [handleSubmit, text])

  const handleLayout = useCallback(event => {
    setUnitsWidth(event.nativeEvent.layout.width)
  }, [setUnitsWidth])

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
      <Text pointerEvents="none" style={styles.unitText} onLayout={handleLayout}>{units}</Text>
    </View>
  )
}

const NumericField = ({ label, ...props }) => {
  return (
    <View horizontal align="center">
      <Text>{label}</Text>
      <Spacer size="xsmall" />
      <NumericInput {...props} />
    </View>
  )
}

export {
  NumericInput,
  NumericField,
}

import React from 'react'
import { StyleSheet } from 'react-native'
import { default as NativeSlider } from 'react-native-slider'

const styles = StyleSheet.create({
  slider: {
    flex: 1
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 1000,
    boxShadow: [
      '0 0 3px rgba(0, 0, 0, 0.1)', // Soft shadow
      // '0 2px 1px rgba(0, 0, 0, 0.1)',  // Drop shadow
      '0 0 1px rgba(0, 0, 0, 0.5)',    // Sharp shadow
    ].join(', '),
  }
})

const Slider = ({ value, disabled, onValueChange }) => {
  return (
    <NativeSlider
      minimumTrackTintColor="rgb(33, 150, 243)"
      thumbTintColor="white"
      style={styles.slider}
      disabled={disabled}
      thumbStyle={styles.thumb}
      value={value}
      onValueChange={onValueChange}
    />
  )
}

export default Slider

import React from 'react'
import { StyleSheet } from 'react-native'

import { View, Spacer } from '.'

const styles = StyleSheet.create({
  divider: {
    minWidth: 1,
    alignSelf: 'stretch',
    backgroundImage: `linear-gradient(
      hsla(0, 0%, 0%, 0.0) 0%,
      hsla(0, 0%, 0%, 0.1) 10%,
      hsla(0, 0%, 0%, 0.1) 90%,
      hsla(0, 0%, 0%, 0.0) 100%
    )`
  }
})

const Divider = ({ size }) => {
  if (size === 'none') {
    return null
  }
  
  return (
    <>
      <Spacer size={size} />
      <View style={styles.divider} />
      <Spacer size={size} />
    </>
  )
}

export default Divider

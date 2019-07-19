import React from 'react'
import { View } from 'react-native'

const sizes = {
  'xsmall': 5,
  'small': 10,
  'large': 20,
}

const Spacer = ({ size }) => {
  if (size === 'none') {
    return null
  }
  
  const style = {
    minWidth: sizes[size] || sizes.small,
    minHeight: sizes[size] || sizes.small,
    alignSelf: 'stretch',
  }

  return <View style={style} />
}

export default Spacer

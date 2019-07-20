import React from 'react'
import { View } from 'react-native'
import { Spacer } from '.'

const Divider = ({ size }) => {
  if (size === 'none') {
    return null
  }
  
  const style = {
    minWidth: 1,
    backgroundColor: 'hsla(0, 0%, 0%, 0.05)',
    alignSelf: 'stretch',
  }

  return (
    <>
      <Spacer size={size} />
      <View style={style} />
      <Spacer size={size} />
    </>
  )
}

export default Divider

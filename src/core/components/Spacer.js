import React from 'react'
import { View } from 'react-native'

const Spacer = ({}) => {
  const style = {
    minWidth: 10,
    minHeight: 10,
    alignSelf: 'stretch',
  }

  return <View style={style} />
}

export default Spacer

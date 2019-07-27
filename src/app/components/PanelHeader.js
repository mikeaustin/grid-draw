import React from 'react'
import { View, Text } from 'react-native'

const PanelHeader = ({ heading }) => {
  return (
  <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'hsla(0, 0%, 0%, 0.05)'}}>
    <Text style={{fontWeight: '700', color: 'hsl(0, 0%, 25%)'}}>{heading}</Text>
  </View>
  )
}

export default PanelHeader

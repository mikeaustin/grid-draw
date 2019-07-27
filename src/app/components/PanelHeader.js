import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'core/components'

const styles = StyleSheet.create({
  panelHeader: {
    minHeight: '30px',
    paddingHorizontal: 10,
    backgroundColor: 'hsla(0, 0%, 0%, 0.05)',
  }
})
const PanelHeader = ({ heading }) => {
  return (
  <View justify="center" style={styles.panelHeader}>
    <Text style={{fontWeight: '700', color: 'hsl(0, 0%, 25%)'}}>{heading}</Text>
  </View>
  )
}

export default PanelHeader

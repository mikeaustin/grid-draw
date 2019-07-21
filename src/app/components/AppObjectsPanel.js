import React from 'react'

import { View as NativeView, Text, TouchableWithoutFeedback } from 'react-native'
import { withLayoutProps } from '../../core/utils/layout'

const View = withLayoutProps(NativeView)

const PanelHeader = ({ heading }) => {
  return (
  <View style={{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'hsla(0, 0%, 0%, 0.05)'}}>
    <Text style={{fontWeight: '700', color: 'hsl(0, 0%, 25%)'}}>{heading}</Text>
  </View>
  )
}

const AppObjectsPanel = ({ theme, layerShapes, selectedShapes, selectShape }) => {
  const handleSelect = id => {
    selectShape(id)
  }
  
  return (
    <View width={256} style={{
      backgroundColor: theme.backgroundColor,
      borderRightWidth: 0.5,
      borderRightColor: 'hsla(0, 0%, 0%, 0.29)',
    }}>
      <PanelHeader heading="Objects" />
      <View style={{paddingVertical: 5}}>
        {layerShapes.map(shape => {
          const selected = selectedShapes.some(selectedShape => selectedShape.id === shape.id)

          return (
            <TouchableWithoutFeedback key={shape.id} onPressIn={() => handleSelect(shape.id)}>
              <View
                style={[
                  {paddingVertical: 5, paddingHorizontal: 10},
                  selected && {backgroundColor: theme.highlightColor}
                ]}
              >
                <Text style={[{marginTop: -1, fontWeight: '500', color: 'hsl(0, 0%, 25%)'}, selected && {color: 'white'}]}>
                  {shape.type}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    </View>
  )
}

export default AppObjectsPanel

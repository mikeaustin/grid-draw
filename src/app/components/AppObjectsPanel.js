import React from 'react'

import { Text, TouchableWithoutFeedback } from 'react-native'
import { View } from 'core/components'
import PanelHeader from './PanelHeader'

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

import React from 'react'

import { Text, TouchableWithoutFeedback } from 'react-native'
import { View } from 'core/components'
import PanelHeader from './PanelHeader'

const Shape = ({ depth = 0, theme, allShapes, selectedShapes, layerShape, selected, onSelect }) => {
  return (
    <View>
      <TouchableWithoutFeedback key={layerShape.id} onPressIn={() => onSelect(layerShape.id)}>
        <View
          style={[
            {paddingVertical: 5, paddingHorizontal: 10},
            selected && {backgroundColor: theme.highlightColor}
          ]}
        >
          <Text
            style={[
              {marginTop: -1, paddingLeft: depth * 15, fontWeight: '500', color: 'hsl(0, 0%, 25%)'},
              selected && {color: 'white'}
            ]}
          >
            {allShapes[layerShape.id].type}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {layerShape.childIds.map(layerShape => {
          const selected = selectedShapes.some(selectedShape => selectedShape.id === layerShape.id)

          return (
          <Shape depth={depth + 1} key={layerShape.id} theme={theme} allShapes={allShapes} layerShape={layerShape} selected={selected} onSelect={onSelect} />
        )
      })}
    </View>
  )
}

const AppObjectsPanel = ({ theme, allShapes, layerShapeIds, selectedShapes, selectShape }) => {
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
        {layerShapeIds.map(layerShape => {
          const shape = allShapes[layerShape.id]
          const selected = selectedShapes.some(selectedShape => selectedShape.id === shape.id)

          return <Shape key={layerShape.id} theme={theme} allShapes={allShapes} selectedShapes={selectedShapes} layerShape={layerShape} selected={selected} onSelect={handleSelect} />
        })}
      </View>
    </View>
  )
}

export default AppObjectsPanel

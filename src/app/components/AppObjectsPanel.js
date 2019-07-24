import React from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native'

import { View } from 'core/components'
import PanelHeader from './PanelHeader'
import { connect } from 'react-redux'
import { ActionTypes, selectTool, selectShape, transformShape, setOpacity } from 'app/actions/common'

const Shape = ({ depth = 0, theme, allShapes, selectedShapeIds, layerShape, selected, onSelect }) => {
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
            {allShapes.value[layerShape.id].type}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {layerShape.childIds.map(layerShape => {
          const selected = selectedShapeIds.some(selectedShapeId => selectedShapeId === layerShape.id)

          return (
          <Shape
            depth={depth + 1}
            key={layerShape.id}
            theme={theme}
            allShapes={allShapes}
            layerShape={layerShape}
            selected={selected}
            onSelect={onSelect}
          />
        )
      })}
    </View>
  )
}

const AppObjectsPanel = ({ theme, allShapes, layerShapeIds, selectedShapeIds, selectShape }) => {
  console.log('AppObjectsPanel.render()')
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
          const shape = allShapes.value[layerShape.id]
          const selected = selectedShapeIds.some(selectedShapeId => selectedShapeId === shape.id)

          return <Shape
            key={layerShape.id}
            theme={theme}
            allShapes={allShapes}
            selectedShapeIds={selectedShapeIds}
            layerShape={layerShape}
            selected={selected}
            onSelect={handleSelect}
          />
        })}
      </View>
    </View>
  )
}

let allShapes = {}

const mapStateToProps = state => {
  console.log('AppObjectsPanel.mapStateToProps()')
  allShapes.value = state.allShapes
  return {
    allShapes: allShapes,
    layerShapeIds: state.layerShapeIds,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  console.log('AppObjectsPanel.mapDispatchToProps()')
  return {
    dispatch,
    selectShape: id => dispatch(selectShape(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppObjectsPanel)

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
import Slider from "react-native-slider"
import { Svg, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'

import './App.css'
import { View } from 'core/components'
import Shape from 'app/components/Shape'
import AppMainToolbar from 'app/components/AppMainToolbar'
import AppObjectsPanel from 'app/components/AppObjectsPanel'
import AppPropertiesPanel from 'app/components/AppPropertiesPanel'
import { ActionTypes, selectTool, selectShape, transformShape, setOpacity } from 'app/actions/common'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    layerShapeIds: state.layerShapeIds,
    layerShapes: state.layerShapeIds.map(shape => state.allShapes[shape.id]),
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id]),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    selectShape: id => dispatch(selectShape(id)),
    setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity))
  }
}

const App = ({
  allShapes,
  layerShapeIds,
  layerShapes,
  selectedShapes,
  selectShape,
  transformShape,
  setOpacity,
  dispatch
}) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  const handleSelect = id => {
    selectShape(id)
  }

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  return (
    <View fill>
      <AppMainToolbar
        toolActionType={toolActionType}
        setToolActionType={setToolActionType}
      />
      <View horizontal fill>
        <AppObjectsPanel
          theme={theme}
          allShapes={allShapes}
          layerShapeIds={layerShapeIds}
          layerShapes={layerShapes}
          selectedShapes={selectedShapes}
          selectShape={selectShape}
        />
        <Svg
          onStartShouldSetResponder={event => true}
          onResponderGrant={event => selectShape()}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
        >
          {layerShapeIds.map((shapeData) => {
            const shape = allShapes[shapeData.id]

            return (
              <Shape
                allShapes={allShapes}
                selectedShapes={selectedShapes}
                key={shape.id}
                id={shape.id}
                type={shape.type}
                opacity={shape.opacity}
                selected={selectedShapes.some(selectedShape => selectedShape.id === shape.id)}
                position={shape.position}
                size={shape.size}
                childIds={shapeData.childIds}
                onSelect={handleSelect}
                onDrag={handleDrag}
              />
            )
          })}
        </Svg>
        <AppPropertiesPanel
          theme={theme}
          selectedShapes={selectedShapes}
          setOpacity={setOpacity}
        />
      </View>
    </View>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

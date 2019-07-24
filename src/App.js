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
    allShapes2: state.allShapes2,
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
  allShapes2,
  selectedShapes,
  selectShape,
  transformShape,
  setOpacity,
  dispatch
}) => {
  console.log('App.render()')

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
        />
        <Svg
          onStartShouldSetResponder={event => true}
          onResponderGrant={event => selectShape()}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
        >
          {allShapes2[0].childIds.map((childId) => {
            const shape = allShapes2[childId]

            return (
              <Shape
                allShapes2={allShapes2}
                selectedShapes={selectedShapes}
                key={shape.id}
                id={shape.id}
                type={shape.type}
                opacity={shape.opacity}
                selected={selectedShapes.some(selectedShape => selectedShape.id === shape.id)}
                position={shape.position}
                size={shape.size}
                childIds={allShapes2[childId].childIds}
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

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
// import Slider from "react-native-slider"
import { Svg, Line, Text, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'

import { View } from 'core/components'
import Shape from 'app/components/Shape'
import { AppMainToolbar, AppObjectsPanel, AppPropertiesPanel, AppCanvasShape } from 'app/components'
import Ruler from 'core/components/Ruler'
import { ActionTypes, selectTool, selectShape, transformShape, setOpacity, arrangeShape } from 'app/actions/common'
import './App.css'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes2,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes2[id]),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    selectShape: id => dispatch(selectShape(id)),
    setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    arrangeShape: () => dispatch(arrangeShape()),
  }
}

const App = ({
  allShapes,
  selectedShapes,
  selectShape,
  transformShape,
  setOpacity,
  arrangeShape,
  dispatch
}) => {
  // console.log('App.render()')

  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)
  const shapeListProps = useMemo(() => ({ allShapes, selectedShapes }), [allShapes, selectedShapes])

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
        arrangeShape={arrangeShape}
      />
      <View horizontal fill>
        <AppObjectsPanel
          theme={theme}
        />
        <Svg
          // onStartShouldSetResponder={event => true}
          // onResponderGrant={event => selectShape()}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
        >
          {Array.from({length: 100}, (_, index) => (
            <Line
              x1={10}
              y1={index * 10 + 10.5}
              x2={'100%'}
              y2={index * 10 + 10.5}
              stroke="hsla(0, 0%, 0%, 0.2)"
              strokeDasharray="1 9"
            />
          ))}
          <Ruler />
          {allShapes[0].childIds.map((childId) => {
            const { type, opacity, position, size } = allShapes[childId]

            return (
              <AppCanvasShape
                key={childId}
                id={childId}
                type={type}
                opacity={opacity}
                selected={selectedShapes.some(shape => shape.id === childId)}
                position={position}
                size={size}
                childIds={allShapes[childId].childIds}
                shapeListProps={shapeListProps}
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

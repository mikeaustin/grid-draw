import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
import Slider from "react-native-slider"
import { Svg, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'
import * as $ from 'seamless-immutable'

import './App.css'
import { View } from 'core/components'
import { Point } from 'core/utils/geometry'
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

const initialState = $({
  allShapes: {
    0: { id: 0, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 0.25 },
    1: { id: 1, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 0.75 },
  },
  layerShapeIds: [0, 1],
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
})

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const merge = updater => value => value.merge(updater(value))

const shapeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_TOOL: {
      return state.merge({ selectedTool: action.payload.actionType })
    }
    case ActionTypes.SELECT_SHAPE: {
      return state.merge({
        selectedShapeIds: action.payload.id !== undefined ? [action.payload.id] : [],
      })
    }
    case ActionTypes.MOVE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes: allShapes.update(id, merge(({ position }) => ({ position: add(position, delta) })))
      })
    }
    case ActionTypes.SCALE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes: allShapes.update(id, merge(({ size }) => ({ size: add(size, delta) })))
      })
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return state.merge({
        allShapes: state.allShapes.update(id, merge(() => ({ opacity: opacity })))
      })
    }
  }

  return state
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    layerShapes: state.layerShapeIds.map(id => state.allShapes[id]),
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

const store = createStore(shapeReducer)

const _Shapes = ({ selectedShapes, allShapes, layerShapes, selectShape, setOpacity, transformShape, dispatch, ...props }) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  const handleSelect = id => {
    selectShape(id)
  }

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  // const handleOpacityKeyPress = event => {
  //   if (event.nativeEvent.key === 'Enter') {
  //     console.log('set opacity', opacityText)
  //     setOpacity(selection[0], Number(opacityText))
  //   }
  // }

  return (
    <View fill>
      <AppMainToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />

      <View horizontal fill>
        <AppObjectsPanel
          theme={theme}
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
          {Object.entries(allShapes).map(([id, shape]) => (
            <Shape
              key={id}
              id={id}
              type={shape.type}
              opacity={shape.opacity}
              selected={selectedShapes.some(shape => shape.id == id)}
              position={shape.position}
              size={shape.size}
              onSelect={handleSelect}
              onDrag={handleDrag}
            />
          ))}
        </Svg>

        <AppPropertiesPanel theme={theme} selectedShapes={selectedShapes} setOpacity={setOpacity} />

      </View>
    </View>
  )
}

const Shapes = connect(mapStateToProps, mapDispatchToProps)(_Shapes)

function App() {
  return (
    <Provider store={store}>
      <View fill>
        <Shapes />
      </View>
    </Provider>
  )
}

export default App

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
// import Slider from "react-native-slider"
import JsxParser from 'react-jsx-parser'

import { View } from 'core/components'
import { AppMainToolbar, AppCanvas, AppObjectsPanel, AppPropertiesPanel } from 'app/components'
import { ActionTypes, transformShape } from 'app/actions/common'
import { Point, add } from 'core/utils/geometry'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

const App = ({ allShapes, selectedShapeIds, onTransformShape }) => {
  console.log('App()')

  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)
  const [selectedShapes, setSelectedShapes] = useState([])
  const activeModifiers = useRef(new Set())

  useEffect(() => {
    setSelectedShapes(selectedShapeIds.map(id => allShapes[id]))
  }, [setSelectedShapes, allShapes, selectedShapeIds])

  const handleDragShape = useCallback((id, delta) => {
    // setSelectedShapes(selectedShapes.map(shape => ({
    //   ...shape,
    //   position: add(shape.position, delta)
    // })))
  }, [setSelectedShapes, selectedShapeIds, selectedShapes])

  const handleCommitDragShape = useCallback((id, delta) => {
    onTransformShape(id, ActionTypes.MOVE_SHAPE, delta)
  }, [onTransformShape])

  useEffect(() => {
    document.addEventListener('keydown', event => {
      activeModifiers.current.add(event.key)
    })

    document.addEventListener('keyup', event => {
      activeModifiers.current.delete(event.key)
    })
  })

  return (
    <View fill>
      <AppMainToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />
      <View horizontal fill>
        <AppObjectsPanel theme={theme} />
        <AppCanvas
          activeModifiers={activeModifiers.current}
          toolActionType={toolActionType}
          // selectedShapes={selectedShapes}
          // onDragShape={handleDragShape}
          onCommitDragShape={handleCommitDragShape}
        />
        <AppPropertiesPanel theme={theme} selectedShapes={selectedShapes} />
      </View>
    </View>
  )
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapesSelection$,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    onTransformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    // onSelectShape: id => dispatch(selectShape(id)),
    // setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    // onArrangeShape: (id, actionType) => dispatch(arrangeShape(id, actionType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

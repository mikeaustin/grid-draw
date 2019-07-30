import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
// import Slider from "react-native-slider"
import { Svg } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'

import { View } from 'core/components'
import { AppMainToolbar, AppObjectsPanel, AppPropertiesPanel, AppCanvasShape } from 'app/components'
import Ruler from 'core/components/Ruler'
import Grid from 'core/components/Grid'
import { ActionTypes, selectTool, selectShape, transformShape, setOpacity, arrangeShape } from 'app/actions/common'
import { AppCanvas } from 'app/components'
import './App.css'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id]),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    selectShape: id => dispatch(selectShape(id)),
    setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    arrangeShape: (id, actionType) => dispatch(arrangeShape(id, actionType)),
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

  const handleSelect = id => {
    selectShape(id)
  }

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  return (
    <View fill>
      <AppMainToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />
      <View horizontal fill>
        <AppObjectsPanel theme={theme} />
        <AppCanvas onSelectShape={handleSelect} onDragShape={handleDrag} />
        <AppPropertiesPanel theme={theme} />
      </View>
    </View>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

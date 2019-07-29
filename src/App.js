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
        <View fill>
          <View pointerEvents="none" style={{ position: 'absolute', top: 31, right: 0, bottom: 0, left: 0, boxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.2)'}} />
          <Svg
            onStartShouldSetResponder={event => true}
            onResponderGrant={event => selectShape()}
            // onResponderMove={event => console.log(event.nativeEvent.locationX)}
            style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
          >
            <Grid />
            <Ruler />
            {allShapes[0].childIds.asMutable().reverse().map((childId) => {
              const { type, opacity, position, size } = allShapes[childId]

              return (
                <AppCanvasShape
                  key={childId}
                  id={childId}
                  shape={allShapes[childId]}
                  // type={type}
                  opacity={opacity}
                  selected={selectedShapes.some(shape => shape.id === childId)}
                  // position={position}
                  // size={size}
                  childIds={allShapes[childId].childIds}
                  shapeListProps={shapeListProps}
                  onSelect={handleSelect}
                  onDrag={handleDrag}
                />
              )
            })}
          </Svg>
        </View>
        <AppPropertiesPanel
          theme={theme}
          selectedShapes={selectedShapes}
          setOpacity={setOpacity}
          transformShape={transformShape}
          dispatch={dispatch}
        />
      </View>
    </View>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

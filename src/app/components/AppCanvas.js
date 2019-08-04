import React, { useCallback, useState, useMemo } from 'react'
import { connect } from 'react-redux'

import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/svg/Ruler'
import Grid from 'core/components/svg/Grid'
import BoundingBox from 'core/components/svg/BoundingBox'

import { CanvasShape, ShapeList, SelectedShapesContext } from 'app/components'
import { selectShape, addSelection, transformShape } from 'app/actions/common'

const SvgMemo = React.memo(Svg)

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    top: 31,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.2)',
  }
})

const AppCanvas = ({
  toolActionType,
  activeModifiers,
  allShapes,
  selectedShapes,
  onAddSelection,
  onSelectShape,
  onTransformShape,
  onDragShape,
  onCommitDragShape,
}) => {
  console.log('AppCanvas()')

  const shapeListProps = useMemo(() => ({ allShapes, selectedShapes }), [allShapes, selectedShapes])
  const [selectedShapes2, setSelectedShapes2] = useState([])

  const handleResponderGrant = useCallback(event => {
    event.preventDefault()
    
    onSelectShape(null)
  }, [onSelectShape])
  
  const handleSelectShape = useCallback(id => {
    if (activeModifiers.has('Shift')) {
      onAddSelection(id)
    } else {
      onSelectShape(id)
    }
  }, [activeModifiers, onAddSelection, onSelectShape])

  const handleDragShape = useCallback((id, delta) => {
    // onTransformShape(id, toolActionType, delta)
    // onDragShape(id, delta)
    setSelectedShapes2([])
  }, [onDragShape, onTransformShape, toolActionType])

  const handleShouldSetResponder = useCallback(event => true, [])
  const memoStyle = useMemo(() => ({ flex: 1 }))

  return (
    <SelectedShapesContext.Provider value={selectedShapes2}>
      <View fill>
        <View pointerEvents="none" style={styles.shadow} />
        <SvgMemo
          onStartShouldSetResponder={handleShouldSetResponder}
          onResponderGrant={handleResponderGrant}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={memoStyle}
        >
          <Grid />
          <Ruler />
          <ShapeList
            childIds={allShapes[0].childIds}
            shapeListProps={shapeListProps}
            onSelectShape={onSelectShape}
            onDragShape={onDragShape}
            onCommitDragShape={onCommitDragShape}
          />
          {/* {allShapes[0].childIds.asMutable().map(childId => {
            console.log('AppCanvas : map')

            return (
              <CanvasShape
                key={childId}
                shape={allShapes[childId]}
                selected={selectedShapes.some(shape => shape.id === childId)}
                childIds={allShapes[childId].childIds}
                shapeListProps={shapeListProps}
                onSelectShape={handleSelectShape}
                onDragShape={handleDragShape}
                onCommitDragShape={onCommitDragShape}
              />
            )
          })} */}
          <BoundingBox position={selectedShapes[0] && selectedShapes[0].position} />
        </SvgMemo>
      </View>
    </SelectedShapesContext.Provider>
  )
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    rootChildIds: state.allShapes[0].childIds,
    selectedShapeIds: state.selectedShapeIds,
    // selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id]),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    onAddSelection: id => dispatch(addSelection(id)),
    onSelectShape: (id, activeModifiers) => dispatch(selectShape(id, activeModifiers)),
    onTransformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppCanvas)

import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'

import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/svg/Ruler'
import Grid from 'core/components/svg/Grid'

import { CanvasShape } from 'app/components'
import { selectShape, addSelection, transformShape } from 'app/actions/common'

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
  toolActionType, activeModifiers, allShapes, selectedShapes, onAddSelection, onSelectShape, onTransformShape
}) => {
  const shapeListProps = useMemo(() => ({ allShapes, selectedShapes }), [selectedShapes])

  const handleResponderGrant = useCallback(event => {
    event.preventDefault()
    
    onSelectShape(null)
  }, [onSelectShape])
  
  const handleSelectShape = id => {
    if (activeModifiers.has('Shift')) {
      onAddSelection(id)
    } else {
      onSelectShape(id)
    }
  }

  const handleDragShape = useCallback((id, delta) => {
    onTransformShape(id, toolActionType, delta)
  }, [onTransformShape, toolActionType])

  return (
    <View fill>
      <View pointerEvents="none" style={styles.shadow} />
      <Svg
        onStartShouldSetResponder={event => true}
        onResponderGrant={handleResponderGrant}
        // onResponderMove={event => console.log(event.nativeEvent.locationX)}
        style={{ flex: 1 }}
      >
        <Grid />
        <Ruler />
        {allShapes[0].childIds.asMutable().map((childId) => {
          const { type, opacity, position, size } = allShapes[childId]

          return (
            <CanvasShape
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
              onSelectShape={handleSelectShape}
              onDrag={handleDragShape}
            />
          )
        })}
      </Svg>
    </View>
  )
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    rootChildIds: state.allShapes[0].childIds,
    selectedShapeIds: state.selectedShapeIds,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id]),
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

import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/Ruler'
import Grid from 'core/components/Grid'

import { AppCanvasShape } from 'app/components'

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

const AppCanvas = ({ allShapes, selectedShapes, onSelectShape, onDragShape }) => {
  const shapeListProps = useMemo(() => ({ allShapes, selectedShapes }), [allShapes, selectedShapes])

  return (
    <View fill>
      <View pointerEvents="none" style={styles.shadow} />
      <Svg
        onStartShouldSetResponder={event => true}
        onResponderGrant={event => onSelectShape()}
        // onResponderMove={event => console.log(event.nativeEvent.locationX)}
        style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
      >
        <Grid />
        <Ruler />
        {allShapes[0].childIds.asMutable().map((childId) => {
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
              onSelect={onSelectShape}
              onDrag={onDragShape}
            />
          )
        })}
      </Svg>
    </View>
  )
}

export default AppCanvas

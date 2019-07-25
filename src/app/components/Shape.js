import React from 'react'
import { Svg, G, Ellipse, Rect } from 'react-native-svg'

import { Point } from 'core/utils/geometry'

const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: ({ allShapes2, selectedShapes, selected, position, size, childIds, ...props }) => {
      return (
        <Ellipse
          cx={position.x + size.x / 2}
          cy={position.y + size.y / 2}
          rx={size.x / 2}
          ry={size.y / 2}
          strokeWidth={3}
          stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
  'GridDraw.Rectangle': {
    render: ({ allShapes2, selectedShapes, selected, position, size, childIds, ...props }) => {
      return (
        <Rect
          x={position.x}
          y={position.y}
          width={size.x}
          height={size.y}
          strokeWidth={3}
          stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
  'GridDraw.Group': {
    render: ({ allShapes2, selectedShapes, selected, position, size, childIds, ...props }) => {
      return (
        <G
          x={position.x}
          y={position.y}
          width={size.x}
          height={size.y}
          strokeWidth={3}
          stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
          fill="#f0f0f0"
          {...props}
        >
          {childIds.map(childId => {
            const { type, opacity, position, size } = allShapes2[childId]
            const selected = selectedShapes.some(shape => shape.id === childId)

            return (
              <Shape
                allShapes2={allShapes2}
                selectedShapes={selectedShapes}
                selected={selected}
                key={childId}
                id={childId}
                type={type}
                opacity={opacity}
                position={position}
                size={size}
                childIds={childIds}
              />
            )
          })}
        </G>
      )
    }
  },
}

class Shape extends React.PureComponent {
  handleTouchStart = event => {
    const { id, onSelect } = this.props

    event.preventDefault()

    onSelect(id)
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleTouchMove = event => {
    const { id, onDrag } = this.props

    event.preventDefault()

    onDrag(id, Point(event.nativeEvent.pageX - this.touchStart[0], event.nativeEvent.pageY - this.touchStart[1]))
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleShouldSetResponder = event => true

  render() {
    const { allShapes2, selectedShapes, type, opacity, selected, position, size, childIds } = this.props

    return (
      React.createElement(shapeRegistration[type].render, {
        allShapes2,
        selectedShapes,
        opacity,
        selected,
        position,
        size,
        childIds,
        onStartShouldSetResponder: this.handleShouldSetResponder,
        onStartShouldSetResponderCapture: this.handleShouldSetResponder,
        onMoveShouldSetResponderCapture: this.handleShouldSetResponder,
        onResponderGrant: this.handleTouchStart,
        onResponderMove: this.handleTouchMove,
      })
    )
  }
}

export default Shape

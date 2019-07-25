import React from 'react'
import { G, Ellipse, Rect } from 'react-native-svg'

import { Point } from 'core/utils/geometry'

const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: ({ selected, position, size, ...props }) => {
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
    render: ({ selected, position, size, ...props }) => {
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
    render: ({ selected, position, size, ...props }) => {
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
        />
      )
    }
  },
}

const ShapeList = ({ 
  childIds, groupProps, onSelect, onDrag
}) => {
  return (
    childIds.map(childId => {
      const { type, opacity, position, size } = groupProps.allShapes[childId]
      const selected = groupProps.selectedShapes.some(shape => shape.id === childId)

      return (
        <Shape
          key={childId}
          type={type}
          opacity={opacity}
          position={position}
          size={size}
          selected={selected}
          childIds={groupProps.allShapes[childId].childIds}
          groupProps={groupProps}
          onSelect={onSelect}
          onDrag={onDrag}
        />
      )
    })
  )
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

    onDrag(id, Point(
      event.nativeEvent.pageX - this.touchStart[0],
      event.nativeEvent.pageY - this.touchStart[1])
    )
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleShouldSetResponder = event => true

  render() {
    const {
      type, opacity, selected, position, size, childIds, groupProps, onSelect, onDrag
    } = this.props

    return (
      React.createElement(shapeRegistration[type].render, {
        opacity, selected, position, size,
        onStartShouldSetResponder: this.handleShouldSetResponder,
        onStartShouldSetResponderCapture: this.handleShouldSetResponder,
        onMoveShouldSetResponderCapture: this.handleShouldSetResponder,
        onResponderGrant: this.handleTouchStart,
        onResponderMove: this.handleTouchMove,
      }, (
        <ShapeList 
          childIds={childIds}
          groupProps={groupProps}
          onSelect={onSelect}
          onDrag={onDrag}
        />
      ))
    )
  }
}

export default Shape

import React from 'react'
import { G, Ellipse, Rect, Path } from 'react-native-svg'

import { Point } from 'core/utils/geometry'
import { View, Spacer, Slider, NumericInput } from 'core/components'

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
  'GridDraw.RoundRect': {
    design: ({ shape: { id, cornerRadius, opacity }, setOpacity }) => {
      return (
        <View horizontal align="center">
          <Slider value={opacity} onValueChange={newOpacity => setOpacity(id, newOpacity)} />
          <Spacer />
          <NumericInput width={50} value={cornerRadius} units="px" />
        </View>
      )
    },
    render: ({ selected, position, size, radius = 10, ...props }) => {
      return (
        <Path d={`
            M ${position.x + radius}, ${position.y}
            l ${size.x - radius * 2}, 0
            a ${radius}, ${radius} 0 0 1 ${radius}, ${radius}
            l 0, ${100 - radius * 2}
            a ${radius}, ${radius} 0 0 1 ${-radius}, ${radius}
            l ${-100 + radius * 2}, 0
            a ${radius}, ${radius} 0 0 1 ${-radius}, ${-radius}
            l 0, ${-100 + radius * 2}
            a ${radius}, ${radius} 0 0 1 ${radius}, ${-radius}
            z
          `}
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
  childIds, shapeListProps, onSelect, onDrag
}) => {
  return (
    childIds.asMutable().reverse().map(childId => {
      const { type, opacity, position, size } = shapeListProps.allShapes[childId]
      const selected = shapeListProps.selectedShapes.some(shape => shape.id === childId)

      return (
        <Shape
          key={childId}
          type={type}
          opacity={opacity}
          position={position}
          size={size}
          selected={selected}
          childIds={shapeListProps.allShapes[childId].childIds}
          shapeListProps={shapeListProps}
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
      type, opacity, selected, position, size, childIds, shapeListProps, onSelect, onDrag
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
          shapeListProps={shapeListProps}
          onSelect={onSelect}
          onDrag={onDrag}
        />
      ))
    )
  }
}

export default Shape
export {
  shapeRegistration
}

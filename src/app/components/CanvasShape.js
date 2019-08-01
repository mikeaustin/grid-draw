import React from 'react'
import { G, Ellipse, Rect, Path } from 'react-native-svg'

import { Point } from 'core/utils/geometry'
import { View, Spacer, Slider, NumericInput } from 'core/components'

const setCornerRadius = (id, cornerRadius) => {
  return {
    type: 'shape/SET_CORNER_RADIUS',
    payload: {
      id, cornerRadius
    }
  }
}

const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: ({ position, size, selected, ...props }) => {
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
    render: ({ position, size, selected, ...props }) => {
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
    design: ({id, shape: { cornerRadius }, dispatch}) => {
      const handleValueChange = newCornerRadius => dispatch(setCornerRadius(id, newCornerRadius * 50))
      const handleSubmit = newCornerRadius => dispatch(setCornerRadius(id, newCornerRadius))

      return (
        <View horizontal align="center">
          <Slider value={cornerRadius / 50} onValueChange={handleValueChange} />
          <Spacer />
          <NumericInput width={50} value={cornerRadius} units="px" onSubmit={handleSubmit} />
        </View>
      )
    },
    render: ({ position, size, selected, shape: { cornerRadius }, ...props }) => {
      return (
        <Path d={`
            M ${position.x + cornerRadius}, ${position.y}
            l ${size.x - cornerRadius * 2}, 0
            a ${cornerRadius}, ${cornerRadius} 0 0 1 ${cornerRadius}, ${cornerRadius}
            l 0, ${100 - cornerRadius * 2}
            a ${cornerRadius}, ${cornerRadius} 0 0 1 ${-cornerRadius}, ${cornerRadius}
            l ${-100 + cornerRadius * 2}, 0
            a ${cornerRadius}, ${cornerRadius} 0 0 1 ${-cornerRadius}, ${-cornerRadius}
            l 0, ${-100 + cornerRadius * 2}
            a ${cornerRadius}, ${cornerRadius} 0 0 1 ${cornerRadius}, ${-cornerRadius}
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
    render: ({ position, selected, ...props }) => {
      return (
        <G
          x={position.x}
          y={position.y}
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
  childIds, shapeListProps, onSelectShape, onDrag
}) => {
  return (
    childIds.asMutable().map(childId => {
      const shape = shapeListProps.allShapes[childId]
      const selected = shapeListProps.selectedShapes.some(selectedShape => selectedShape.id === childId)

      return (
        <Shape
          key={childId}
          shape={shape}
          selected={selected}
          childIds={shape.childIds}
          shapeListProps={shapeListProps}
          onSelectShape={onSelectShape}
          onDrag={onDrag}
        />
      )
    })
  )
}

class Shape extends React.PureComponent {
  handleTouchStart = event => {
    const { shape: { id }, onSelectShape } = this.props

    event.preventDefault()

    onSelectShape(id)
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleTouchMove = event => {
    const { shape: { id }, onDrag } = this.props

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
      shape, selected, childIds, shapeListProps, onSelectShape, onDrag
    } = this.props

    return (
      React.createElement(shapeRegistration[shape.type].render, {
        shape,
        selected,
        id: shape.id,
        position: shape.position,
        size: shape.size,
        opacity: shape.opacity,
        onStartShouldSetResponder: this.handleShouldSetResponder,
        onStartShouldSetResponderCapture: this.handleShouldSetResponder,
        onMoveShouldSetResponderCapture: this.handleShouldSetResponder,
        onResponderGrant: this.handleTouchStart,
        onResponderMove: this.handleTouchMove,
      }, (
        <ShapeList 
          childIds={childIds}
          shapeListProps={shapeListProps}
          onSelectShape={onSelectShape}
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

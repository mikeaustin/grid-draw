import React from 'react'
import { G, Ellipse, Rect, Path } from 'react-native-svg'

import { View, Spacer, Slider, NumericInput } from 'core/components'
import { Point } from 'core/utils/geometry'

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
    size: ({ size }) => size,
    render: ({ position, size, selected, ...props }) => {
      return (
        <Ellipse
          cx={position.x + size.x / 2 + 0.5}
          cy={position.y + size.y / 2 + 0.5}
          rx={size.x / 2}
          ry={size.y / 2}
          strokeWidth={3}
          stroke={'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
  'GridDraw.Rectangle': {
    size: ({ size }) => size,
    render: ({ position, size, selected, ...props }) => {
      return (
        <Rect
          x={position.x + 0.5}
          y={position.y + 0.5}
          width={size.x}
          height={size.y}
          strokeWidth={3}
          stroke={'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
  'GridDraw.RoundRect': {
    size: ({ size }) => size,
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
        <Path
          d={`
            M ${position.x + cornerRadius + 0.5}, ${position.y + 0.5}
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
          stroke={'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
  'GridDraw.Group': {
    size: ({ size }) => size,
    render: ({ position, selected, ...props }) => {
      return (
        <G
          x={position.x}
          y={position.y}
          strokeWidth={3}
          stroke={'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  },
}

const ShapeList = React.memo(({ 
  childIds, allShapes, selectedShapeIds, onSelectShape, onDragShape, onCommitDragShape
}) => {
  console.log('ShapeList()')

  return (
    childIds.map(childId => {
      const shape = allShapes[childId]
      const selected = selectedShapeIds.some(shapeId => shapeId === childId)

      return (
        <CanvasShapeMemo
          key={childId}
          shape={shape}
          selected={selected}
          capture={true}
          childIds={shape.childIds}
          allShapes={allShapes}
          selectedShapeIds={selectedShapeIds}
          onSelectShape={onSelectShape}
          onDragShape={onDragShape}
          onCommitDragShape={onCommitDragShape}
        />
      )
    })
  )
})

const SelectedShapesContext = React.createContext()
const NullContext = React.createContext([{
  position: { x: 0, y: 0 },
  opacity: 1.0,
}])

class CanvasShape extends React.PureComponent {
  handleTouchStart = event => {
    const { shape: { id }, selectedShapeIds, onSelectShape } = this.props

    event.preventDefault()

    if (!selectedShapeIds.includes(id)) {
      onSelectShape(id)
    }

    this.touchStart = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)
  }

  handleTouchMove = event => {
    const { shape: { id }, onDragShape } = this.props

    event.preventDefault()

    // const touch = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)

    onDragShape(id, Point(
      event.nativeEvent.pageX - this.touchStart.x,
      event.nativeEvent.pageY - this.touchStart.y
    ))
  }

  handleTouchEnd = event => {
    const { shape: { id }, onCommitDragShape } = this.props

    onCommitDragShape(id, Point(
      event.nativeEvent.pageX - this.touchStart.x,
      event.nativeEvent.pageY - this.touchStart.y
    ))
  }

  handleStartShouldSetResponder = event => true

  handleStartShouldSetResponderCapture = event => this.props.capture

  render() {
    console.log('CanvasShape()')

    const {
      shape, selected, capture, childIds, allShapes, selectedShapeIds, onSelectShape, onDragShape, onCommitDragShape,
    } = this.props

    const Context = selected ? SelectedShapesContext : NullContext

    return (
      <Context.Consumer>
        {selectedShapes => {
          const selectedShapeIndex = selectedShapes.findIndex(selectedShape => selectedShape.id === shape.id)
          console.log('translate', selected, selectedShapeIndex)
          const { position } = selectedShapeIndex >= 0 ? selectedShapes[selectedShapeIndex] : shape

          return (
            React.createElement(shapeRegistration[shape.type].render, {
              shape,
              selected,
              capture,
              id: shape.id,
              position: position,
              size: shape.size,
              opacity: shape.opacity,
              onStartShouldSetResponder: this.handleStartShouldSetResponder,
              onStartShouldSetResponderCapture: this.handleStartShouldSetResponderCapture,
              onMoveShouldSetResponderCapture: this.handleStartShouldSetResponderCapture,
              onResponderGrant: this.handleTouchStart,
              onResponderMove: this.handleTouchMove,
              onResponderRelease: this.handleTouchEnd,
            }, (
              <ShapeList
                childIds={childIds}
                allShapes={allShapes}
                selectedShapeIds={selectedShapeIds}
                onSelectShape={onSelectShape}
                onDragShape={onDragShape}
                onCommitDragShape={onCommitDragShape}
              />
            )
          ))
        }}
      </Context.Consumer>
    )
  }
}

const CanvasShapeMemo = React.memo(CanvasShape)

export default CanvasShape
export {
  ShapeList,
  shapeRegistration,
  SelectedShapesContext,
}

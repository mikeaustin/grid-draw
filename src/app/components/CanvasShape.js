import React, { memo, useRef } from 'react'
import { G, Ellipse, Rect, Path } from 'react-native-svg'

import { View, Spacer, Slider, NumericInput } from 'core/components'
import { Point, add, sub } from 'core/utils/geometry'

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
    render: ({ nativeRef, position, size, selected, ...props }) => {
      return (
        <Ellipse
          // ref={nativeRef}
          cx={position.x + size.x / 2}
          cy={position.y + size.y / 2}
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
          stroke={'black'}
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
          stroke={'black'}
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
  state = {
    translate: Point(0, 0)
  }

  handleTouchStart = event => {
    const { shape: { id }, onSelectShape } = this.props

    event.preventDefault()

    onSelectShape(id)

    this.touchStart = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)
    this.touchStart2 = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)
  }

  handleTouchMove = event => {
    const { shape: { id }, onDragShape } = this.props

    event.preventDefault()

    const touch = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)

    this.setState({
      translate: sub(touch, this.touchStart)
    })

    onDragShape(id, Point(
      event.nativeEvent.pageX - this.touchStart2.x,
      event.nativeEvent.pageY - this.touchStart2.y
    ))

    this.touchStart2 = Point(event.nativeEvent.pageX, event.nativeEvent.pageY)
  }

  handleTouchEnd = event => {
    const { shape: { id }, onCommitDragShape } = this.props

    onCommitDragShape(id, Point(
      event.nativeEvent.pageX - this.touchStart.x,
      event.nativeEvent.pageY - this.touchStart.y
    ))

    this.setState({
      translate: Point(0, 0)
    })
  }

  handleShouldSetResponder = event => true

  nativeRef = ref => this.ref = ref

  render() {
    console.log('CanvasShape()')

    const {
      shape, selected, childIds, shapeListProps, onSelectShape, onDrag
    } = this.props

    //console.log(this.ref)
    // this.ref && this.ref.setNativeProps({})

    return (
      React.createElement(shapeRegistration[shape.type].render, {
        // nativeRef: this.nativeRef,
        shape,
        selected,
        id: shape.id,
        position: add(this.state.translate, shape.position),
        size: shape.size,
        opacity: shape.opacity,
        onStartShouldSetResponder: this.handleShouldSetResponder,
        onStartShouldSetResponderCapture: this.handleShouldSetResponder,
        onMoveShouldSetResponderCapture: this.handleShouldSetResponder,
        onResponderGrant: this.handleTouchStart,
        onResponderMove: this.handleTouchMove,
        onResponderRelease: this.handleTouchEnd,
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

export default memo(Shape)
export {
  shapeRegistration
}

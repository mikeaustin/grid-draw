import React from 'react'
import { UIManager } from 'react-native'

import { Point } from 'core/utils/geometry'
import shapeRegistration from './shapeRegistration'

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
  componentDidMount() {
    // console.log('>>>', UIManager.measure)
    // UIManager.measure(this.element, a => console.log('>>>', a))
  }

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
          if (process.env.NODE_ENV === 'development') console.log('translate', selected, selectedShapeIndex)
          const { position } = selectedShapeIndex >= 0 ? selectedShapes[selectedShapeIndex] : shape

          return (
            React.createElement(shapeRegistration[shape.type].render, {
              // elementRef: ref => this.element = ref,
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
  SelectedShapesContext,
}

import React, { useState, useCallback } from 'react'
import { G, Line, Circle, Ellipse, Rect, Path } from 'react-native-svg'
import { Point } from 'core/utils/geometry'
import JsxParser from 'react-jsx-parser'
import { chunk, concat } from 'lodash/fp'
import _ from 'lodash'

import { View, Spacer, Slider, NumericInput } from 'core/components'

const setCornerRadius = (id, cornerRadius) => {
  return {
    type: 'shape/SET_CORNER_RADIUS',
    payload: {
      id, cornerRadius
    }
  }
}

const CurveNode = ({ index, position, node, onDrag }) => {
  const [touchStart, setTouchStart] = useState()
  const [translate, setTranslate] = useState(Point(0, 0))

  const handleStartShouldSetResponder = useCallback(event => true, [])

  const handleResponderGrant = useCallback(event => {
    event.preventDefault()

    setTouchStart(Point(event.nativeEvent.pageX, event.nativeEvent.pageY))
  }, [setTouchStart])

  const handleResponderMove = useCallback(event => {
    setTranslate(Point(event.nativeEvent.pageX - touchStart.x, event.nativeEvent.pageY - touchStart.y))

    onDrag(
      index,
      Point(event.nativeEvent.pageX - touchStart.x, event.nativeEvent.pageY - touchStart.y),
    )
  }, [touchStart, setTranslate, onDrag])

  return (
    <Circle
      transform={`translate(${position.x}, ${position.y})`}
      cx={node.x + translate.x}
      cy={node.y + translate.y}
      r={5}
      strokeWidth={2}
      fill="white"
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
    />
  )
}

const ControlLine = ({ position, nodes, offset }) => {
  return (
    <Line
      transform={`translate(${position.x}, ${position.y})`}
      x1={nodes[offset + 0].x}
      y1={nodes[offset + 0].y}
      x2={nodes[offset + 1].x}
      y2={nodes[offset + 1].y}
      strokeWidth={2}
      stroke="rgb(33, 150, 243)"
    />
  )
}

class PathObject extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      bezierNodeOffsets: Array.from({ length: props.shape.bezierNodes.length }, () => Point(0, 0)),
    }
  }

  handleDrag = (nodeIndex, newOffset) => {
    console.log(nodeIndex, newOffset)
    this.setState(state => ({
      bezierNodeOffsets: state.bezierNodeOffsets.map((offset, index) => (
        index === nodeIndex
          ? Point(
            this.props.shape.bezierNodes[index].x + newOffset.x,
            this.props.shape.bezierNodes[index].y + newOffset.y
          )
          : offset
      ))
    }))
  }

  render() {
    const { position, selected, shape, ...props } = this.props
    console.log(shape.bezierNodes2)

    const d = shape.bezierNodes.map((node, index) => {
      const offset = this.state.bezierNodeOffsets[index]

      return (
        `${index === 0 ? 'M ' : index === 1 ? 'C ' : ''}${node.x + offset.x},${node.y + offset.y}`
      )
    }).join(' ')

    const bezierNodes = _(null).concat(shape.bezierNodes).concat(null).chunk(3)

    const lines = bezierNodes.map((nodes, index) => (
      <React.Fragment key={index}>
        {nodes[0] && <ControlLine position={position} nodes={nodes} offset={0} />}
        {nodes[2] && <ControlLine position={position} nodes={nodes} offset={1} />}
      </React.Fragment>
    )).value()

    const handles = bezierNodes.map((nodes, index) => (
      <CurveNode key={index} index={index} position={position} node={nodes[1]} onDrag={this.handleDrag} />
    )).value()

    return (
      <React.Fragment>
        <Path
          transform={`translate(${position.x}, ${position.y})`}
          d={d}
          strokeWidth={3}
          stroke={'black'}
          fill="none"
          {...props}
        />
        {lines}
        {handles}
      </React.Fragment>
    )
  }
}

const shapeRegistration = {
  'GridDraw.Ellipse': {
    size: ({ size }) => size,
    render: ({ position, size, selected, ...props }) => {
      console.log('JsxParser props', props)

      return (
        <JsxParser
          bindings={{ position, size, ...props }}
          components={{ Ellipse }}
          renderInWrapper={false}
          showWarnings={true}
          jsx={`
            <Ellipse
              cx={position.x + size.x / 2 + 0.5}
              cy={position.y + size.y / 2 + 0.5}
              rx={size.x / 2}
              ry={size.y / 2}
              strokeWidth={3}
              stroke={'black'}
              fill="#f0f0f0"
              onStartShouldSetResponder={onStartShouldSetResponder}
              onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
              onMoveShouldSetResponderCapture={onMoveShouldSetResponderCapture}
              onResponderGrant={onResponderGrant}
              onResponderMove={onResponderMove}
              onResponderRelease={onResponderRelease}
            />
          `}
        />
      )
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
    design: ({ id, shape: { cornerRadius }, dispatch }) => {
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
  'GridDraw.Path': {
    size: ({ size }) => size,
    render: PathObject,
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

export default shapeRegistration

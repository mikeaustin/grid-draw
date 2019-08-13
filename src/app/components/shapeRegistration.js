import React from 'react'
import { G, Line, Circle, Ellipse, Rect, Path } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'

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
  'GridDraw.Path': {
    size: ({ size }) => size,
    render: ({ position, selected, shape, ...props }) => {
      const d = shape.bezierNodes.map((node, index) => (
        `${index === 0 ? 'M ' : index === 1 ? 'C ' : ''}${node.x},${node.y}`
      ))
      console.log(d.join(' '))

      const handles = shape.bezierNodes.map((node, index) => (
        `${index === 0 ? 'M ' : index === 1 ? 'C ' : ''}${node.x},${node.y}`
      ))

      // const tail = shape.bezierNodes2.subarray(2)

      return (
        <React.Fragment>
          <Path
            transform={`translate(${position.x}, ${position.y})`}
            d={d}
            // xd={`
            //   M ${position.x}, ${position.y}
            //   C ${position.x - 100}, ${position.y + 200}
            //     ${position.x + 400}, ${position.y + 200}
            //     ${position.x + 300}, ${position.y}
            // `}
            strokeWidth={3}
            stroke={'black'}
            fill="none"
            {...props}
          />
          <Line x1={position.x} y1={position.y} x2={position.x - 100} y2={position.y + 200} strokeWidth={2} stroke="rgb(33, 150, 243)" />
          <Circle cx={position.x} cy={position.y} r={5} strokeWidth={2} fill="white" />
          <Circle cx={position.x - 100} cy={position.y + 200} r={5} strokeWidth={2} fill="white" />

          <Line x1={position.x + 300} y1={position.y} x2={position.x + 400} y2={position.y + 200} strokeWidth={2} stroke="rgb(33, 150, 243)" />
          <Circle cx={position.x + 300} cy={position.y} r={5} strokeWidth={2} fill="white" />
          <Circle cx={position.x + 400} cy={position.y + 200} r={5} strokeWidth={2} fill="white" />
        </React.Fragment>
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

export default shapeRegistration

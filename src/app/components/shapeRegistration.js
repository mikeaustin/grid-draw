import React from 'react'
import { G, Line, Circle, Ellipse, Rect, Path } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'
import { chunk, concat } from 'lodash/fp'

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

      const handles = shape.bezierNodes.map((node, index) => (
        <Circle key={index} transform={`translate(${position.x}, ${position.y})`} cx={node.x} cy={node.y} r={5} strokeWidth={2} fill="white" />
      ))

      const phantomLines = chunk(3, concat(null, shape.bezierNodes))
      const lines = phantomLines.map((nodes, index) => (
        <React.Fragment key={index}>
          {nodes[0] && (
            <Line
              transform={`translate(${position.x}, ${position.y})`}
              x1={nodes[0].x}
              y1={nodes[0].y}
              x2={nodes[1].x}
              y2={nodes[1].y}
              strokeWidth={2}
              stroke="rgb(33, 150, 243)"
            />
          )}
          {nodes[2] && (
            <Line
              transform={`translate(${position.x}, ${position.y})`}
              x1={nodes[1].x}
              y1={nodes[1].y}
              x2={nodes[2].x}
              y2={nodes[2].y}
              strokeWidth={2}
              stroke="rgb(33, 150, 243)" />
          )}
        </React.Fragment>
      ))

      // const tail = shape.bezierNodes2.subarray(2)

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

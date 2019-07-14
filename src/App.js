import React, { useState, useRef, useCallback } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { View, Text, Button } from 'react-native-web'
import { Svg, Ellipse, Rect } from 'react-native-svg'

import immutable, { List, Map } from 'immutable'
import './App.css'

console.log(new Map([[1, 2]]).toString())

const Spacer = ({}) => {
  const style = {
    minWidth: 10,
    minHeight: 10,
  }

  return <View style={style} />
}

const ActionTypes = {
  SHAPE_ELLIPSE: '/shapes/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: '/shapes/SHAPE_RECTANGLE',
  MOVE_SHAPE: 'touch/MOVE_SHAPE',
  SCALE_SHAPE: 'touch/SCALE_SHAPE',
}

const initialState = {
  shapes: [
    { id: 0, type: 'GridDraw.Ellipse', position: [100, 100], size: [100, 100] },
    { id: 1, type: 'GridDraw.Rectangle', position: [300, 100], size: [100, 100] },
  ],
}

const shapeReducer = (state = initialState, action) => {
  // console.log(action.type)

  switch (action.type) {
    case ActionTypes.MOVE_SHAPE: {
      return {
        ...state,
        shapes: state.shapes.map(shape => {
          if (shape.id === action.payload.id) {
            return { ...shape, position: [shape.position[0] + action.payload.delta[0], shape.position[1] + action.payload.delta[1]] }
          }

          return shape
        }),
      }
    }
    case ActionTypes.SCALE_SHAPE: {
      return {
        ...state,
        shapes: state.shapes.map(shape => {
          if (shape.id === action.payload.id) {
            return { ...shape, size: [shape.size[0] + action.payload.delta[0], shape.size[1] + action.payload.delta[1]] }
          }

          return shape
        }),
      }
    }
  }

  return state
}

const transformShape = (id, actionType, delta) => ({
  type: actionType,
  payload: {
    id,
    delta
  }
})

const mapStateToProps = state => {
  return {
    shapes: state.shapes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
  }
}

const store = createStore(shapeReducer)

const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: ({ position, size, ...props }) => {
      return (
        <Ellipse
          cx={position[0] + size[0] / 2}
          cy={position[1] + size[1] / 2}
          rx={size[0] / 2}
          ry={size[1] / 2}
          {...props}
        />
      )
    }
  },
  'GridDraw.Rectangle': {
    render: ({ position, size, ...props }) => {
      return (
        <Rect
          x={position[0]}
          y={position[1]}
          width={size[0]}
          height={size[1]}
          {...props}
        />
      )
    }
  }
}

class Shape extends React.PureComponent {
  handleTouchStart = event => {
    event.preventDefault()

    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleTouchMove = event => {
    const { id, onDrag } = this.props

    event.preventDefault()

    onDrag(id, [event.nativeEvent.pageX - this.touchStart[0], event.nativeEvent.pageY - this.touchStart[1]])
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleShouldSetResponder = event => true

  render() {
    const { id, type, position, size } = this.props
  
    return (
      React.createElement(shapeRegistration[type].render, {
        position,
        size,
        onStartShouldSetResponder: this.handleShouldSetResponder,
        onStartShouldSetResponderCapture: this.handleShouldSetResponder,
        onMoveShouldSetResponderCapture: this.handleShouldSetResponder,
        onResponderGrant: this.handleTouchStart,
        onResponderMove: this.handleTouchMove,
      })
    )
  }
}

// const Shape = ({ id, type, position, size, onDrag }) => {
//   console.log('Shape()')
//   const touchStart = useRef()

//   const handleTouchStart = useCallback(event => {
//     console.log('Shape.handleTouchStart', event.nativeEvent.pageX)
//     event.preventDefault()

//     touchStart.current = ([event.nativeEvent.pageX, event.nativeEvent.pageY])
//   }, [id])

//   const handleTouchMove = useCallback(event => {
//     event.preventDefault()
// console.log('handleTouchMove', event.nativeEvent.pageX, touchStart.current[0])
//     touchStart.current = ([event.nativeEvent.pageX, event.nativeEvent.pageY])
//     onDrag(id, [event.nativeEvent.pageX - touchStart.current[0], event.nativeEvent.pageY - touchStart.current[1]])
//   }, [id, touchStart])

//   return (
//     React.cloneElement(shapeRegistration[type].render(position, size), {
//       onStartShouldSetResponder: event => true,
//       onStartShouldSetResponderCapture: event => true,
//       onMoveShouldSetResponderCapture: event => true,
//       onResponderGrant: handleTouchStart,
//       onResponderMove: handleTouchMove,
//     })
//   )
// }

const _Shapes = ({ position, size, shapes, moveShape, scaleShape, transformShape }) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  return (
    <View>
      <Spacer />
      <View style={{flexDirection: 'row'}}>
        <Spacer />
        <Button title="Move" onPress={() => setToolActionType(ActionTypes.MOVE_SHAPE)} />
        <Spacer />
        <Button title="Scale" onPress={() => setToolActionType(ActionTypes.SCALE_SHAPE)} />
      </View>
      <Svg
        // onStartShouldSetResponder={event => true}
        // onResponderGrant={event => console.log(event.nativeEvent.locationX)}
        // onResponderMove={event => console.log(event.nativeEvent.locationX)}
        style={{height: 500}}
      >
        {shapes.map((shape, index) => (
          <Shape key={index} id={shape.id} type={shape.type} position={shape.position} size={shape.size} onDrag={handleDrag} />
        ))}
      </Svg>
    </View>
  )
}

const Shapes = connect(mapStateToProps, mapDispatchToProps)(_Shapes)

function App() {
  return (
    <Provider store={store}>
      <View>
        <Shapes />
      </View>
    </Provider>
  )
}

export default App

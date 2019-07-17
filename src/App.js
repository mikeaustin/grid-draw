import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { View, Text, Button, TextInput } from 'react-native-web'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
import Slider from "react-native-slider"
import { Svg, Ellipse, Rect } from 'react-native-svg'

import immutable, { Record, List, Map } from 'immutable'
import Immutable from 'seamless-immutable'
import './App.css'

const $ = Immutable

console.log(new Map([[1, 2]]).toString())

const Spacer = ({}) => {
  const style = {
    minWidth: 10,
    minHeight: 10,
  }

  return <View style={style} />
}

const ActionTypes = {
  SELECT_SHAPE: 'tool/SELECT_SHAPE',
  SHAPE_ELLIPSE: '/tool/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: 'tool/SHAPE_RECTANGLE',
  MOVE_SHAPE: 'shape/MOVE_SHAPE',
  SCALE_SHAPE: 'shape/SCALE_SHAPE',
  SET_OPACITY: 'shape/SET_OPACITY',
}

const initialState = {
  shapes2: $({
    0: { type: 'GridDraw.Ellipse', position: [100, 100], size: [100, 100] },
    1: { type: 'GridDraw.Rectangle', position: [300, 100], size: [100, 100] },
  }),
  shapes: [
    { id: 0, type: 'GridDraw.Ellipse', position: [100, 100], size: [100, 100], opacity: 1.0 },
    { id: 1, type: 'GridDraw.Rectangle', position: [300, 100], size: [100, 100], opacity: 0.75 },
  ],
  selection: []
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1]]

// const updateMerge = (object, key, updater) => $.update(object, key, value => value.merge(updater(value)))
const merge = updater => value => value.merge(updater(value))

console.log($({}))

const shapeReducer = (state = initialState, action) => {
  // console.log(action.type)

  switch (action.type) {
    case ActionTypes.SELECT_SHAPE: {
      return {
        ...state,
        selection: [action.payload.id]
      }
    }
    case ActionTypes.MOVE_SHAPE: {
      const payload = action.payload
      const { id, delta } = action.payload

      return {
        ...state,
        shapes: state.shapes.map(shape => (
          shape.id === payload.id
            ? { ...shape, position: add(shape.position, delta) }
            : shape
        )),
        // shapes2: shapes2.update(id, shape => shape.merge({ position: add(shape.position, payload.delta) })),
        // shapes2: updateMerge(shapes2, id, ({ position }) => ({ position: add(position, delta) })),
        shapes2: state.shapes2.update(id, merge(({ position }) => ({ position: add(position, delta) })))
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
    case ActionTypes.SET_OPACITY: {
      return {
        ...state,
        shapes: state.shapes.map(shape => {
          if (shape.id === state.selection[0]) {
            return { ...shape, opacity: action.payload.opacity }
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

const selectShape = id => ({
  type: ActionTypes.SELECT_SHAPE,
  payload: {
    id
  }
})

const setOpacity = (id, opacity) => ({
  type: ActionTypes.SET_OPACITY,
  payload: {
    opacity
  }
})

const mapStateToProps = state => {
  return {
    shapes: state.shapes,
    selection: state.selection,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    selectShape: id => dispatch(selectShape(id)),
    setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity))
  }
}

const store = createStore(shapeReducer)

const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: ({ selected, position, size, ...props }) => {
      return (
        <Ellipse
          cx={position[0] + size[0] / 2}
          cy={position[1] + size[1] / 2}
          rx={size[0] / 2}
          ry={size[1] / 2}
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
          x={position[0]}
          y={position[1]}
          width={size[0]}
          height={size[1]}
          strokeWidth={3}
          stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
          fill="#f0f0f0"
          {...props}
        />
      )
    }
  }
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

    onDrag(id, [event.nativeEvent.pageX - this.touchStart[0], event.nativeEvent.pageY - this.touchStart[1]])
    this.touchStart = [event.nativeEvent.pageX, event.nativeEvent.pageY]
  }

  handleShouldSetResponder = event => true

  render() {
    const { id, type, opacity, selected, position, size } = this.props

    return (
      React.createElement(shapeRegistration[type].render, {
        opacity,
        selected,
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

const _Shapes = ({ selection, position, size, shapes, moveShape, scaleShape, selectShape, setOpacity, transformShape }) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)
  const [sliderOpacity, setSliderOpacity] = useState(1.0)

  const handleSelect = id => {
    selectShape(id)
  }

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  // const handleOpacityKeyPress = event => {
  //   if (event.nativeEvent.key === 'Enter') {
  //     console.log('set opacity', opacityText)
  //     setOpacity(selection[0], Number(opacityText))
  //   }
  // }

  console.log(shapes[selection[0]])

  // useEffect(() => {
  //   if (shapes[selection[0]]) {
  //     setSliderOpacity(shapes[selection[0]].opacity)
  //   }
  // }, [selection])

  const handleOpacityValueChange = opacity => {
    // console.log()
    // setSliderOpacity(opacity)
    setOpacity(selection[0], opacity)
  }
console.log('>>>', selection[0])
  return (
    <View>
      <Spacer />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Spacer />
        <Button title="Move" onPress={() => setToolActionType(ActionTypes.MOVE_SHAPE)} />
        <Spacer />
        <Button title="Scale" onPress={() => setToolActionType(ActionTypes.SCALE_SHAPE)} />
        <Spacer />
        <Slider
          minimumTrackTintColor="rgb(33, 150, 243)"
          thumbTintColor="white"
          style={{width: 200}}
          thumbStyle={{
            // borderTopColor: 'rgb(236, 236, 236)',
            // borderLeftColor: 'transparent',
            // borderBottomColor: 'rgb(192, 192, 192)',
            // borderWidth: 0.5,
            width: 25,
            height: 25,
            borderRadius: 1000,
            boxShadow: [
              // '0 0 3px rgba(0, 0, 0, 0.1)', // Soft shadow
              '0 2px 1px rgba(0, 0, 0, 0.1)',  // Drop shadow
              '0 0 1px rgba(0, 0, 0, 0.3)',    // Sharp shadow
            ].join(', ')
          }}
          value={selection[0] && shapes[selection[0]].opacity}
          onValueChange={handleOpacityValueChange}
        />
        {/* <TextInput value={opacityText}
          onChangeText={text => setOpacityText(text)}
          onKeyPress={handleOpacityKeyPress}
        /> */}
      </View>
      <Svg
        onStartShouldSetResponder={event => true}
        onResponderGrant={event => selectShape()}
        // onResponderMove={event => console.log(event.nativeEvent.locationX)}
        style={{height: 500}}
      >
        {shapes.map((shape, index) => (
          <Shape
            key={index}
            id={shape.id}
            type={shape.type}
            opacity={shape.opacity}
            selected={selection.includes(shape.id)}
            position={shape.position}
            size={shape.size}
            onSelect={handleSelect}
            onDrag={handleDrag}
          />
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

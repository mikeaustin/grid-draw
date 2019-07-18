import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { View as NativeView, Text, Button, TextInput } from 'react-native-web'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
import Slider from "react-native-slider"
import { Svg, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'

import Immutable from 'seamless-immutable'
import './App.css'

const $ = Immutable

const withLayoutProps = Component => ({
  horizontal, fill, justify, align, width, height, style, ...props
}) => {
  const rootStyles = [
    horizontal && {flexDirection: 'row'},
    fill && {flexGrow: typeof fill === 'boolean' ? 1 : fill},
    justify && {justifyContent: justify},
    align && {alignItems: align},
    width && {width: width},
    height && {height: height},
  ]

  return (
    <Component style={[rootStyles, style]} {...props} />
  )
}

const View = withLayoutProps(NativeView)

const highlightColor = 'rgb(33, 150, 243)'
const backgroundColor = 'hsl(0, 0%, 95%)'

const Spacer = ({}) => {
  const style = {
    minWidth: 10,
    minHeight: 10,
    alignSelf: 'stretch',
  }

  return <View style={style} />
}

const Point = (x, y) => $({ x, y })

const ActionTypes = {
  SELECT_SHAPE: 'tool/SELECT_SHAPE',
  SHAPE_ELLIPSE: '/tool/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: 'tool/SHAPE_RECTANGLE',
  MOVE_SHAPE: 'shape/MOVE_SHAPE',
  SCALE_SHAPE: 'shape/SCALE_SHAPE',
  SET_OPACITY: 'shape/SET_OPACITY',
}

const initialState = {
  allShapes: $({
    0: { id: 0, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 0.25 },
    1: { id: 1, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 0.75 },
  }),
  selectedShapeIds: [],
}

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const merge = updater => value => value.merge(updater(value))

const shapeReducer = (state = initialState, action) => {
  // console.log(action.type)

  switch (action.type) {
    case ActionTypes.SELECT_SHAPE: {
      return {
        ...state,
        selectedShapeIds: action.payload.id !== undefined ? [action.payload.id] : [],
      }
    }
    case ActionTypes.MOVE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return {
        ...state,
        allShapes: allShapes.update(id, merge(({ position }) => ({ position: add(position, delta) })))
      }
    }
    case ActionTypes.SCALE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return {
        ...state,
        allShapes: allShapes.update(id, merge(({ size }) => ({ size: add(size, delta) })))
      }
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return {
        ...state,
        allShapes: state.allShapes.update(id, merge(() => ({ opacity: opacity })))
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
    id,
    opacity
  }
})

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id].merge({selected: false})),
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

    onDrag(id, Point(event.nativeEvent.pageX - this.touchStart[0], event.nativeEvent.pageY - this.touchStart[1]))
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

const _Shapes = ({ selectedShapes, allShapes, selectShape, setOpacity, transformShape }) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

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

  const handleOpacityValueChange = opacity => {
    // setSliderOpacity(opacity)
    setOpacity(selectedShapes[0].id, opacity)
  }

  const toolbarStyle = {
    // alignItems: 'center',
    backgroundColor: backgroundColor,
    paddingVertical: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: 'hsl(0, 0%, 85%)',
    boxShadow: [
      '0 1px 0 hsla(0, 0%, 0%, 0.1)',
      '0 0 10px hsla(0, 0%, 0%, 0.1)',
    ].join(', '),
  }

  return (
    <View fill>
      <View horizontal align="center" style={toolbarStyle}>
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
            ].join(', '),
          }}
          value={selectedShapes[0] && selectedShapes[0].opacity}
          onValueChange={handleOpacityValueChange}
        />
        {/* <TextInput value={opacityText}
          onChangeText={text => setOpacityText(text)}
          onKeyPress={handleOpacityKeyPress}
        /> */}
      </View>
      <View horizontal fill>
        <View width={200} style={{backgroundColor: backgroundColor, boxShadow: [
            '1px 1px 0 hsla(0, 0%, 0%, 0.1)',
            '0 0 10px hsla(0, 0%, 0%, 0.1)',
          ].join(', '),
          marginTop: 1,
          paddingVertical: 5,
        }}>
          {Object.entries(allShapes).map(([id, shape]) => (
            <View key={id} style={[{paddingVertical: 5, paddingHorizontal: 10, marginRight: -1}, selectedShapes.some(shape => shape.id == id) && {backgroundColor: highlightColor}]}>
              <Text style={[{fontWeight: '500', color: 'hsl(0, 0%, 25%)'}, selectedShapes.some(shape => shape.id == id) && {color: 'white'}]}>{shape.type}</Text>
            </View>
          ))}
        </View>
        <Svg
          onStartShouldSetResponder={event => true}
          onResponderGrant={event => selectShape()}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={{flex: 1}}
        >
          {Object.entries(allShapes).map(([id, shape]) => (
            <Shape
              key={id}
              id={id}
              type={shape.type}
              opacity={shape.opacity}
              selected={selectedShapes.some(shape => shape.id == id)}
              position={shape.position}
              size={shape.size}
              onSelect={handleSelect}
              onDrag={handleDrag}
            />
          ))}
        </Svg>
      </View>
    </View>
  )
}

const Shapes = connect(mapStateToProps, mapDispatchToProps)(_Shapes)

function App() {
  return (
    <Provider store={store}>
      <View fill>
        <Shapes />
      </View>
    </Provider>
  )
}

export default App

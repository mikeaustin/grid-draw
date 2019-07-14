import React, { useState } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { View, Text, Button } from 'react-native-web'
import { Svg, Ellipse, Rect } from 'react-native-svg'

import logo from './logo.svg'
import immutable, { Map } from 'immutable'
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
  ADD_TODO: 'todos/ADD_TODO',
  SHAPE_ELLIPSE: '/shapes/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: '/shapes/SHAPE_RECTANGLE',
  MOVE_SHAPE: 'touch/MOVE_SHAPE',
  SCALE_SHAPE: 'touch/SCALE_SHAPE',
}

const initialState = {
  todos: [],
  shapes: [
    {  }
  ],
  position: [100, 100],
  size: [50, 50],
}

const todoReducer = (state = initialState, action) => {
  // console.log(action.type)

  switch (action.type) {
    case ActionTypes.MOVE_SHAPE: {
      return {
        ...state,
        position: [state.position[0] + action.payload[0], state.position[1] + action.payload[1]]
      }
    }
    case ActionTypes.SCALE_SHAPE: {
      return {
        ...state,
        size: [state.size[0] + action.payload[0], state.size[1] + action.payload[1]]
      }
    }
  }

  return state
}

const addTodo = todo => ({ type: ActionTypes.ADD_TODO, payload: todo })
const moveShape = position => ({ type: ActionTypes.MOVE_SHAPE, payload: position })
const scaleShape = position => ({ type: ActionTypes.SCALE_SHAPE, payload: position })
const transformShape = (actionType, delta) => ({ type: actionType, payload: delta })

const mapStateToProps = state => {
  return {
    position: state.position,
    size: state.size,
    todos: state.todos
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTodo: todo => dispatch(addTodo(todo)),
    moveShape: position => dispatch(moveShape(position)),
    scaleShape: position => dispatch(scaleShape(position)),
    transformShape: (actionType, delta) => dispatch(transformShape(actionType, delta)),
  }
}

const store = createStore(todoReducer)

const Shape = () => {
  return (
    'x'
  )
}

const _Todos = ({ position, size, todos, moveShape, scaleShape, transformShape }) => {
  const [touchStart, setTouchStart] = useState()
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  const handleTouchStart = event => {
    event.preventDefault()

    setTouchStart([event.nativeEvent.pageX, event.nativeEvent.pageY])
  }

  const handleTouchMove = event => {
    event.preventDefault()

    setTouchStart([event.nativeEvent.pageX, event.nativeEvent.pageY])
    // moveShape([event.nativeEvent.pageX - touchStart[0], event.nativeEvent.pageY - touchStart[1]])
    transformShape(toolActionType, [event.nativeEvent.pageX - touchStart[0], event.nativeEvent.pageY - touchStart[1]])
  }

  return (
    <View>
      {todos.map((todo, index) => (
        <View key={index}>
          <Text>{todo}</Text>
        </View>
      ))}
      <Svg
        // onStartShouldSetResponder={event => true}
        // onResponderGrant={event => console.log(event.nativeEvent.locationX)}
        // onResponderMove={event => console.log(event.nativeEvent.locationX)}
        style={{height: 200}}
      >
        <Ellipse
          cx={position[0]}
          cy={position[1]}
          rx={size[0]}
          ry={size[1]}
          onStartShouldSetResponder={event => true}
          onStartShouldSetResponderCapture={event => true}
          onMoveShouldSetResponderCapture={event => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
        />
      </Svg>
      <View style={{flexDirection: 'row'}}>
        <Spacer />
        <Button title="Move" onPress={() => setToolActionType(ActionTypes.MOVE_SHAPE)} />
        <Spacer />
        <Button title="Scale" onPress={() => setToolActionType(ActionTypes.SCALE_SHAPE)} />
      </View>
    </View>
  )
}

const Todos = connect(mapStateToProps, mapDispatchToProps)(_Todos)

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Todos />
      </div>
    </Provider>
  )
}

export default App

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import Immutable from 'seamless-immutable'
import JsxParser from 'react-jsx-parser'

import './index.css';
import App from './App';
import { Point } from 'core/utils/geometry'
import { ActionTypes } from 'app/actions/common'

const initialState = Immutable({
  allShapes: {
    0: { id: 0, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 0.25 },
    1: { id: 1, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 0.75 },
  },
  layerShapeIds: [0, 1],
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
})

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const merge = updater => value => value.merge(updater(value))

const shapeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_TOOL: {
      return state.merge({ selectedTool: action.payload.actionType })
    }
    case ActionTypes.SELECT_SHAPE: {
      return state.merge({
        selectedShapeIds: action.payload.id !== undefined ? [action.payload.id] : [],
      })
    }
    case ActionTypes.MOVE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes: allShapes.update(id, merge(({ position }) => ({ position: add(position, delta) })))
      })
    }
    case ActionTypes.SCALE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes: allShapes.update(id, merge(({ size }) => ({ size: add(size, delta) })))
      })
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return state.merge({
        allShapes: state.allShapes.update(id, merge(() => ({ opacity: opacity })))
      })
    }
  }

  return state
}

const store = createStore(shapeReducer)

AppRegistry.registerComponent('App', () => props => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
))

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root')
})  

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
  actions: {
    [ActionTypes.SELECT_TOOL]: (state, { actionType }) => (
      state.merge({ selectedTool: actionType })
    ),
    [ActionTypes.SELECT_SHAPE]: (state, { id }) => (
      state.merge({
        selectedShapeIds: id !== undefined ? [id] : [],
      })
    ),
    allShapes: {
      [ActionTypes.MOVE_SHAPE]: (state, { id, delta }) => (
        state.merge({
          allShapes: state.allShapes.update(id, merge(({ position }) => ({
            position: add(position, delta)
          }))),
        })      
      )
    }
  },
  allShapes: {
    0: { id: 0, type: 'GridDraw.Group', position: Point(0, 0), size: Point(0, 0), opacity: 1.0, parent: 0, childIds: [1, 2, 3, 6] },
      1: { id: 1, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 0 },
      2: { id: 2, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 0 },
      3: { id: 3, type: 'GridDraw.Group', position: Point(200, 200), size: Point(100, 100), opacity: 1.0, childIds: [4, 5], parentId: 0 },
        4: { id: 4, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 3 },
        5: { id: 5, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 3 },
      6: { id: 6, type: 'GridDraw.RoundRect', position: Point(100, 300), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 0, cornerRadius: 10 },
    },
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
})

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const merge = updater => value => value.merge(updater(value))

// const reducer = (state, actions, action) => {
//   state = Object.entries(actions).reduce((actions, [actionType, callback]) => {
//     if (typeof callback === 'object') {
//       return reducer(state, state[actionType], action)
//     }

//     return actionType === action.type ? callback(state, action.payload) : state
//   }, state)
// }

const shapeReducer = (allShapes, action) => {
  // state = reducer(state, state.actions, action)

  switch (action.type) {
    case ActionTypes.MOVE_SHAPE: {
      const { id, delta } = action.payload

      return allShapes.update(id, merge(({ position }) => ({ position: add(position, delta) })))
    }
    case ActionTypes.SCALE_SHAPE: {
      const { id, delta } = action.payload

      return allShapes.update(id, merge(({ size }) => ({ size: add(size, delta) })))
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return allShapes.update(id, merge(() => ({ opacity: Math.round(opacity * 100) / 100 })))
    }
    case 'shape/SET_CORNER_RADIUS': {
      const { id, cornerRadius } = action.payload

      return allShapes.update(id, merge(() => ({ cornerRadius: cornerRadius })))
    }
    case ActionTypes.BRING_TO_FRONT: {
      const shape = allShapes[action.payload.id]

      return allShapes.update(shape.parentId, merge(({ childIds }) => ({
        childIds: [shape.id].concat(childIds.filter(id => id !== shape.id))
      })))
    }
    case ActionTypes.SEND_TO_BACK: {
      const shape = allShapes[action.payload.id]

      return allShapes.update(shape.parentId, merge(({ childIds }) => ({
          childIds: childIds.filter(id => id !== shape.id).concat(shape.id)
        })))
    }
    default: return allShapes
  }
}

const appReducer = (state = initialState, action) => {
  state = state.merge({ allShapes: shapeReducer(state.allShapes, action) })

  switch (action.type) {
    case ActionTypes.SELECT_TOOL: {
      return state.merge({ selectedTool: action.payload.actionType })
    }
    case ActionTypes.SELECT_SHAPE: {
      return state.merge({
        selectedShapeIds: action.payload.id !== undefined ? [action.payload.id] : [],
      })
    }
    default: return state
  }
}

const store = createStore(appReducer)

AppRegistry.registerComponent('App', () => props => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
))

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root')
})  

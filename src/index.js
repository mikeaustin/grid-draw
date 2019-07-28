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
  allShapes2: {
    0: { id: 0, type: 'GridDraw.Group', position: Point(0, 0), size: Point(0, 0), opacity: 1.0, parent: 0, childIds: [1, 2, 3] },
      1: { id: 1, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 0 },
      2: { id: 2, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 0 },
      3: { id: 3, type: 'GridDraw.Group', position: Point(200, 200), size: Point(100, 100), opacity: 1.0, childIds: [4, 5], parentId: 0 },
        4: { id: 4, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 3 },
        5: { id: 5, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 1.0, childIds: [], parentId: 3 },
  },
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
      const { allShapes2 } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes2: allShapes2.update(id, merge(({ position }) => ({ position: add(position, delta) }))),
      })
    }
    case ActionTypes.SCALE_SHAPE: {
      const { allShapes2 } = state
      const { id, delta } = action.payload

      return state.merge({
        allShapes2: allShapes2.update(id, merge(({ size }) => ({ size: add(size, delta) })))
      })
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return state.merge({
        allShapes2: state.allShapes2.update(id, merge(() => ({ opacity: Math.round(opacity * 100) / 100 })))
      })
    }
    case ActionTypes.BRING_TO_FRONT: {
      const { allShapes2, selectedShapeIds } = state
      const shape = allShapes2[selectedShapeIds[0]]

      return state.merge({
        allShapes2: allShapes2.update(shape.parentId, merge(({ childIds }) => ({
          childIds: childIds.filter(id => id !== shape.id).concat(shape.id)
        })))
      })
    }
    case ActionTypes.SEND_TO_BACK: {
      const { allShapes2, selectedShapeIds } = state
      const shape = allShapes2[selectedShapeIds[0]]

      return state.merge({
        allShapes2: allShapes2.update(shape.parentId, merge(({ childIds }) => ({
          childIds: [shape.id].concat(childIds.filter(id => id !== shape.id))
        })))
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

import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { pipe, take, drop, concat, mapValues, partition } from 'lodash/fp'
import Immutable from 'seamless-immutable'
import JsxParser from 'react-jsx-parser'

import './index.css';
import App from './App';
import { Point, add } from 'core/utils/geometry'
import { ActionTypes } from 'app/actions/common'
import initialState from './initialState'

// import test from './test.macro'

const merge = updater => value => value.merge(updater(value))
const splitAt = (index, it) => [it.slice(0, index), it.slice(index)]

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
        childIds: childIds.filter(id => id !== shape.id).concat(shape.id)
      })))
    }
    case ActionTypes.SEND_TO_BACK: {
      const shape = allShapes[action.payload.id]

      return allShapes.update(shape.parentId, merge(({ childIds }) => ({
        childIds: [shape.id].concat(childIds.filter(id => id !== shape.id))
      })))
    }
    case 'shape/GROUP_SHAPES': {
      const { selectedShapes } = action.payload

      const selectedShapeIds = selectedShapes.map(shape => shape.id)
      const firstShape = allShapes[selectedShapes[0].id]
      const parentChildIds = allShapes[firstShape.parentId].childIds
      const firstShapeIndex = parentChildIds.indexOf(firstShape.id)
      const groupId = allShapes.nextShapeId

      const group = {
        id: groupId,
        type: 'GridDraw.Group',
        position: Point(0, 0),
        size: Point(0, 0),
        opacity: 1.0,
        parentId: firstShape.parentId,
        childIds: selectedShapeIds
      }

      const removedSelectedIds = parentChildIds.filter(id => !selectedShapeIds.includes(id))

      const [init, tail] = splitAt(firstShapeIndex, removedSelectedIds)
      const addedGroupIds3 = pipe([concat(tail), concat([groupId]), concat(init)])([])

      const result = allShapes
        .set(groupId, group)
        .update(firstShape.parentId, merge(() => ({ childIds: addedGroupIds3 })))
        .update('nextShapeId', nextShapeId => nextShapeId + 1)

      return mapValues(shape => (
        selectedShapeIds.includes(shape.id) ? Immutable.merge(shape, { parentId: groupId }) : shape
      ), result)
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
    case ActionTypes.ADD_SELECTION: {
      if (state.selectedShapeIds.includes(action.payload.id)) {
        return state.merge({
          selectedShapeIds: state.selectedShapeIds.filter(id => id !== action.payload.id),
          allShapesSelection$: state.allShapes,
        })
      } else {
        return state.merge({
          selectedShapeIds: state.selectedShapeIds.concat([action.payload.id]),
          allShapesSelection$: state.allShapes,
        })
      }
    }
    case ActionTypes.SELECT_SHAPE: {
      return state.merge({
        selectedShapeIds: action.payload.id !== null ? [action.payload.id] : [],
        allShapesSelection$: state.allShapes,
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

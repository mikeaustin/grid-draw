import Immutable from 'seamless-immutable'
import { Point, add } from 'core/utils/geometry'
import { ActionTypes } from 'app/actions/common'

const merge = updater => value => value.merge(updater(value))

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
    nextShapeId: 7,
    0: {
      id: 0,
      type: 'GridDraw.Group',
      position: Point(0, 0),
      size: Point(0, 0),
      opacity: 1.0,
      childIds: [1, 2, 3, 6],
    },
    1: {
      id: 1,
      type: 'GridDraw.Ellipse',
      position: Point(100, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
    },
    2: {
      id: 2,
      type: 'GridDraw.Rectangle',
      position: Point(300, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
    },
    3: {
      id: 3,
      type: 'GridDraw.Group',
      position: Point(200, 200),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [4, 5],
      parentId: 0,
    },
    4: {
      id: 4,
      type: 'GridDraw.Ellipse',
      position: Point(100, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 3,
    },
    5: {
      id: 5,
      type: 'GridDraw.Rectangle',
      position: Point(300, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 3,
    },
    6: {
      id: 6,
      type: 'GridDraw.RoundRect',
      position: Point(100, 300),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
      cornerRadius: 10,
    },
  },
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
})

export default initialState

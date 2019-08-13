import Immutable from 'seamless-immutable'
import { Point } from 'core/utils/geometry'
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
            position: Point.add(position, delta)
          }))),
        })      
      )
    }
  },
  allShapes: {
    nextShapeId: 8,
    0: {
      id: 0,
      type: 'GridDraw.Group',
      position: Point(30, 30),
      size: Point(0, 0),
      opacity: 1.0,
      childIds: [1, 2, 3, 6, 7],
    },
    1: {
      id: 1,
      type: 'GridDraw.Ellipse',
      position: Point(200, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
    },
    2: {
      id: 2,
      type: 'GridDraw.Rectangle',
      position: Point(400, 100),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
    },
    3: {
      id: 3,
      type: 'GridDraw.Group',
      position: Point(300, 300),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [4, 5],
      parentId: 0,
    },
    4: {
      id: 4,
      type: 'GridDraw.Ellipse',
      position: Point(0, 0),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 3,
    },
    5: {
      id: 5,
      type: 'GridDraw.Rectangle',
      position: Point(200, 0),
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
    7: {
      id: 7,
      type: 'GridDraw.Path',
      position: Point(200, 500),
      size: Point(100, 100),
      opacity: 1.0,
      childIds: [],
      parentId: 0,
      bezierNodes: [
        Point(0, 0),
        Point(-100, 200), Point(400, 200),
        Point(300, 0),
        Point(350, -50), Point(-50, -50),
        Point(0, 0),
      ],
      bezierNodes2: new Uint16Array([0,0, -100,200, 400,200, 300,0]),
    },
  },
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
  options: {
    showGrid: true,
  }
})

export default initialState

const createActions = (actions) => {
  return Object.entries(actions).map(([name, value]) => (
    (...params) => 5
  ))
}

const transformShape = (id, actionType, delta) => ({
  type: actionType, payload: { id, delta }
})


const { moveShape, scaleShape } = createActions({
  Shape: {
    MOVE_SHAPE: delta => ({ delta }),
    SCALE_SHAPE: delta => ({ delta }),
  }
})

const reducer = createReducer(0, {
  [moveShape.type]: ({ position }, { delta }) => ({
    ...state, position: [position[0] + delta[0], position[1] + delta[1]]
  })
})

moveShape([10, 20]) // { type: 'Shape/MOVE_SHAPE', payload: { delta: [10, 20] }}

const ActionTypes = {
  ADD_ACTION: 'app/ADD_ACTION',

  SELECT_TOOL: 'tool/SELECT_TOOL',
  ADD_SELECTION: 'tool/ADD_SELECTION',
  SELECT_SHAPE: 'tool/SELECT_SHAPE',

  SHAPE_ELLIPSE: '/tool/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: 'tool/SHAPE_RECTANGLE',

  MOVE_SHAPE: 'shape/MOVE_SHAPE',
  SCALE_SHAPE: 'shape/SCALE_SHAPE',
  SET_OPACITY: 'shape/SET_OPACITY',
  BRING_TO_FRONT: 'shape/BRING_TO_FRONT',
  SEND_TO_BACK: 'shape/SEND_TO_BACK',
}

const selectTool = actionType => ({
  type: ActionTypes.SELECT_TOOL,
  payload: {
    actionType,
  }
})

const selectShape = id => ({
  type: ActionTypes.SELECT_SHAPE,
  payload: {
    id,
  }
})

const addSelection = id => ({
  type: ActionTypes.ADD_SELECTION,
  payload: {
    id,
  }
})

const transformShape = (id, actionType, delta) => ({
  type: actionType,
  payload: {
    id,
    delta,
  }
})

const setOpacity = (id, opacity) => ({
  type: ActionTypes.SET_OPACITY,
  payload: {
    id,
    opacity,
  }
})

const arrangeShape = (id, actionType) => ({
  type: actionType,
  payload: {
    id
  }
})

export {
  ActionTypes,
  selectTool,
  selectShape,
  addSelection,
  transformShape,
  setOpacity,
  arrangeShape,
}

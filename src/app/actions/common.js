const ActionTypes = {
  SELECT_TOOL: 'tool/SELECT_TOOL',
  SELECT_SHAPE: 'tool/SELECT_SHAPE',
  SHAPE_ELLIPSE: '/tool/SHAPE_ELLIPSE',
  SHAPE_RECTANGLE: 'tool/SHAPE_RECTANGLE',
  MOVE_SHAPE: 'shape/MOVE_SHAPE',
  SCALE_SHAPE: 'shape/SCALE_SHAPE',
  SET_OPACITY: 'shape/SET_OPACITY',
  BRING_TO_FRONT: 'shape/BRING_TO_FRONT',
}

const selectTool = actionType => ({
  type: ActionTypes.SELECT_TOOL,
  payload: {
    actionType,
  }
})

const transformShape = (id, actionType, delta) => ({
  type: actionType,
  payload: {
    id,
    delta,
  }
})

const selectShape = id => ({
  type: ActionTypes.SELECT_SHAPE,
  payload: {
    id,
  }
})

const setOpacity = (id, opacity) => ({
  type: ActionTypes.SET_OPACITY,
  payload: {
    id,
    opacity,
  }
})

const bringToFont = id => ({
  type: ActionTypes.BRING_TO_FRONT,
  payload: {
    id,
  }
})

export {
  ActionTypes,
  selectTool,
  selectShape,
  transformShape,
  setOpacity,
}
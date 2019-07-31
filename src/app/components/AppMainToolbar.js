import React, { useCallback } from 'react';
import { connect } from 'react-redux'
import { createSelector, defaultMemoize, createSelectorCreator } from 'reselect'
import { Spacer, Divider, Toolbar } from 'core/components'
import { ActionTypes, arrangeShape } from 'app/actions/common'

const createOptimizedSelector = createSelectorCreator(defaultMemoize, (state, prevState) => (
  state.selectedShapeIds === prevState.selectedShapeIds
))

const getAllShapes = state => state.allShapes
const getSelectedShapeIds = state => state.selectedShapeIds

const getAllShapesCached = createOptimizedSelector(
  [state => state, getAllShapes],
  (state, allShapes) => allShapes
)

const getSelectedShapes = createOptimizedSelector(
  [state => state, getAllShapesCached, getSelectedShapeIds],
  (state, allShapes, selectedShapeIds) => selectedShapeIds.map(id => allShapes[id])
)

// const xuseMemo = defaultMemoize(state => ({
//     allShapes: state.allShapes,
//     selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id])
//   }), (state, prevState) => (
//     state.selectedShapeIds === prevState.selectedShapeIds
//   )
// )

const mapStateToProps = state => {
  return {
    allShapes: getAllShapesCached(state),
    selectedShapes: getSelectedShapes(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    // selectShape: id => dispatch(selectShape(id)),
    // setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    onArrangeShape: (id, actionType) => dispatch(arrangeShape(id, actionType)),
  }
}

const AppMainToolbar = ({ toolActionType, setToolActionType, selectedShapes, onArrangeShape, dispatch }) => {
  const handleArrangeShape = useCallback(actionType => {
    onArrangeShape(selectedShapes[0].id, actionType)
  }, [onArrangeShape, selectedShapes])

  console.log('AppMainToolbar()', selectedShapes.length)

  return (
    <Toolbar horizontal>
      <Spacer />
      <Toolbar.Group title="Tools" value={toolActionType} setValue={setToolActionType}>
        <Toolbar.Button title="Move Shapes" value={ActionTypes.MOVE_SHAPE} icon="037-cursor" />
        <Toolbar.Button title="Resize Shapes" value={ActionTypes.SCALE_SHAPE} icon="008-resize" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Shapes" value={toolActionType} setValue={setToolActionType}>
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="009-rectangle" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="025-ellipse" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="001-star" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="007-pen-tool" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Arrange" value={toolActionType} setValue={handleArrangeShape}>
        <Toolbar.Button title="Bring to Front" value={ActionTypes.BRING_TO_FRONT} icon="018-alignment-1" />
        <Toolbar.Button title="Send to Back" value={ActionTypes.SEND_TO_BACK} icon="002-object-alignment" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Combine" value={toolActionType} setValue={setToolActionType}>
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="030-unite" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="014-minus-front" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="022-intersection" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="038-exclude" />
      </Toolbar.Group>
    </Toolbar>
  )
}



export default connect(mapStateToProps, mapDispatchToProps)(AppMainToolbar)

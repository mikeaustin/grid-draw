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

const AppMainToolbar = ({ toolActionType, setToolActionType, selectedShapes, options, onArrangeShape, dispatch }) => {
  const handleArrangeShape = useCallback(actionType => {
    onArrangeShape(selectedShapes[0].id, actionType)
  }, [onArrangeShape, selectedShapes])

  const handleGroupShapes = useCallback(actionType => {
    // onGroupShape(selectedShapes, actionType)
    dispatch({
      type: actionType,
      payload: {
        selectedShapes
      }
    })
  }, [dispatch, selectedShapes])

  const handleToggleOptions = useCallback(actionType => {
    dispatch({
      type: actionType
    })
  }, [dispatch])

  console.log('AppMainToolbar()')

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
        <Toolbar.Button title="Bring to Front" value={ActionTypes.BRING_TO_FRONT} icon="foreground" />
        <Toolbar.Button title="Send to Back" value={ActionTypes.SEND_TO_BACK} icon="background" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Group" value={toolActionType} setValue={handleGroupShapes}>
        <Toolbar.Button title="Group" value={'shape/GROUP_SHAPES'} icon="group" />
        <Toolbar.Button title="Ungroup" value={ActionTypes.SEND_TO_BACK} icon="ungroup" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Combine" value={toolActionType} setValue={setToolActionType}>
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="030-unite" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="014-minus-front" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="022-intersection" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="038-exclude" />
      </Toolbar.Group>
      <Divider xsize="xsmall" />
      <Toolbar.Group title="Guides" setValue={handleToggleOptions}>
        <Toolbar.Button title="Show Grid" value={'options/SHOW_GRID'} selected={options.showGrid} icon="square-20" />
        <Toolbar.Button title="Show Ruler" value={ActionTypes.SEND_TO_BACK} icon="ruler" />
      </Toolbar.Group>
    </Toolbar>
  )
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapesSelected,
    selectedShapes: getSelectedShapes(state),
    options: state.options,
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

export default connect(mapStateToProps, mapDispatchToProps)(AppMainToolbar)

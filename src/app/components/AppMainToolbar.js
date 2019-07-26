import React from 'react';
import { connect } from 'react-redux'
import { Spacer, Divider, Toolbar } from 'core/components'
import { ActionTypes } from 'app/actions/common'

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes2,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes2[id]),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    // selectShape: id => dispatch(selectShape(id)),
    // setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    // arrangeShape: () => dispatch(arrangeShape()),
  }
}

const AppMainToolbar = ({ toolActionType, setToolActionType, arrangeShape, dispatch }) => {
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
      <Toolbar.Group title="Arrange" value={toolActionType} setValue={arrangeShape}>
        <Toolbar.Button title="Bring to Front" value={ActionTypes.BRING_TO_FRONT} icon="018-alignment-1" />
        <Toolbar.Button title="Send to Back" value={ActionTypes.SET_OPACITY} icon="002-object-alignment" />
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

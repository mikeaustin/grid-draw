import React from 'react';
import { Spacer, Divider, Toolbar } from 'core/components'
import { ActionTypes } from 'app/actions/common'

const AppMainToolbar = ({ toolActionType, setToolActionType }) => {
  const borderColor = 'hsla(0, 0%, 0%, 0.29)'

  const toolbarStyle = {
    // alignItems: 'center',
    // backgroundColor: backgroundColor,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: borderColor,
  }

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
      <Toolbar.Group title="Combine" value={toolActionType} setValue={setToolActionType}>
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="030-unite" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="014-minus-front" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="022-intersection" />
        <Toolbar.Button value={ActionTypes.SET_OPACITY} icon="038-exclude" />
      </Toolbar.Group>
    </Toolbar>
  )
}

export default AppMainToolbar

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
// import Slider from "react-native-slider"
import JsxParser from 'react-jsx-parser'

import { Point, add } from 'core/utils/geometry'
import { View } from 'core/components'
import { ActionTypes, transformShape } from 'app/actions/common'
import { AppMainToolbar, AppCanvas, AppObjectsPanel, AppPropertiesPanel } from 'app/components'
import { ShapeList, SelectedShapesContext } from 'app/components'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

class App extends React.PureComponent {
  state = {
    toolActionType: ActionTypes.MOVE_SHAPE,
    selectedShapeIds: [],
    selectedShapes: [],
  }

  activeModifiers = new Set()

  static getDerivedStateFromProps(props, state) {
    const { allShapes } = props

    if (props.selectedShapeIds !== state.selectedShapeIds || props.allShapes !== state.allShapes) {
      return {
        allShapes: props.allShapes,
        selectedShapeIds: props.selectedShapeIds,
        selectedShapes: props.selectedShapeIds.map(id => allShapes[id])
      }
    }

    return null
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      this.activeModifiers.add(event.key)
    })

    document.addEventListener('keyup', event => {
      this.activeModifiers.delete(event.key)
    })
  }

  setToolActionType = toolActionType => {
    this.setState({
      toolActionType
    })
  }

  handleDragShape = (id, delta) => {
    const { allShapes, selectedShapeIds } = this.props
    const { selectedShapes } = this.state

    this.setState({
      selectedShapes: selectedShapes.map(shape => ({
        ...shape,
        position: add(allShapes[shape.id].position, delta)
      }))
    })
  }

  handleCommitDragShape = (id, delta) => {
    const { allShapes, selectedShapeIds, onTransformShape } = this.props

    selectedShapeIds.forEach(shapeId => {
      onTransformShape(shapeId, ActionTypes.MOVE_SHAPE, delta)
    })

    this.setState({
      selectedShapes: this.state.selectedShapeIds.map(id => ({
        ...allShapes[id],
        position: add(allShapes[id].position, delta)
      }))
    })
  }

  render() {
    const { toolActionType, selectedShapes } = this.state

    return (
      <SelectedShapesContext.Provider value={selectedShapes}>
        <View fill>
          <AppMainToolbar toolActionType={toolActionType} setToolActionType={this.setToolActionType} />
          <View horizontal fill>
            <AppObjectsPanel theme={theme} />
            <AppCanvas
              activeModifiers={this.activeModifiers}
              toolActionType={toolActionType}
              // selectedShapes={selectedShapes}
              onDragShape={this.handleDragShape}
              onCommitDragShape={this.handleCommitDragShape}
            />
            <AppPropertiesPanel theme={theme} />
          </View>
        </View>
      </SelectedShapesContext.Provider>
    )
  }
}

// const App = ({ allShapes, selectedShapeIds, onTransformShape }) => {
//   console.log('App()')

//   const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)
//   const [selectedShapes, setSelectedShapes] = useState([])
//   const activeModifiers = useRef(new Set())

//   useEffect(() => {
//     setSelectedShapes(selectedShapeIds.map(id => allShapes[id]))
//   }, [setSelectedShapes, allShapes, selectedShapeIds])

//   const handleDragShape = useCallback((id, delta) => {
//     setSelectedShapes(selectedShapes.map(shape => ({
//       ...shape,
//       position: add(allShapes[selectedShapeIds[0]].position, delta)
//     })))
//   }, [setSelectedShapes, selectedShapeIds, selectedShapes])

//   const handleCommitDragShape = useCallback((id, delta) => {
//     onTransformShape(id, ActionTypes.MOVE_SHAPE, delta)
//   }, [onTransformShape])

//   useEffect(() => {
//     document.addEventListener('keydown', event => {
//       activeModifiers.current.add(event.key)
//     })

//     document.addEventListener('keyup', event => {
//       activeModifiers.current.delete(event.key)
//     })
//   })

//   return (
//     <View fill>
//       <AppMainToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />
//       <View horizontal fill>
//         <AppObjectsPanel theme={theme} />
//         <AppCanvas
//           activeModifiers={activeModifiers.current}
//           toolActionType={toolActionType}
//           // selectedShapes={selectedShapes}
//           onDragShape={handleDragShape}
//           onCommitDragShape={handleCommitDragShape}
//         />
//         <AppPropertiesPanel theme={theme} selectedShapes={selectedShapes} />
//       </View>
//     </View>
//   )
// }

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    onTransformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    // onSelectShape: id => dispatch(selectShape(id)),
    // setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity)),
    // onArrangeShape: (id, actionType) => dispatch(arrangeShape(id, actionType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

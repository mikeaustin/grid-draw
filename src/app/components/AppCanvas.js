import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/svg/Ruler'
import Grid from 'core/components/svg/Grid'
import BoundingBox from 'core/components/svg/BoundingBox'
import { Point, add } from 'core/utils/geometry'

import { ShapeList, SelectedShapesContext } from 'app/components'
import { selectShape, addSelection, transformShape } from 'app/actions/common'

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    top: 31,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.2)',
  },
  svg: {
    flex: 1,
  }
})

class AppCanvas extends React.PureComponent {
  state = { x: 0, y: 0 }

  handleResponderGrant = event => {
    event.preventDefault()
    
    this.props.onSelectShape(null)
  }

  handleSelectShape = id => {
    if (this.props.activeModifiers.has('Shift')) {
      this.props.onAddSelection(id)
    } else {
      this.props.onSelectShape(id)
    }
  }

  handleDragShape = (id, delta) => {
    this.setState(delta)
  }

  handleCommitDragShape = (id, delta) => {
    this.props.onCommitDragShape(id, delta)

    this.setState({ x: 0, y: 0 })
  }

  handleShouldSetResponder = event => true

  render() {
    const { allShapes, selectedShapeIds } = this.props
    const position = selectedShapeIds[0] && add(allShapes[selectedShapeIds[0]].position, this.state)

    return (
      <SelectedShapesContext.Provider value={this.state}>
        <View fill>
          <View pointerEvents="none" style={styles.shadow} />
          <Svg
            onStartShouldSetResponder={this.handleShouldSetResponder}
            onResponderGrant={this.handleResponderGrant}
            style={styles.svg}
          >
            <Grid />
            <Ruler />
            <ShapeList
              childIds={this.props.allShapes[0].childIds}
              allShapes={this.props.allShapes}
              selectedShapeIds={this.props.selectedShapeIds}
              onSelectShape={this.handleSelectShape}
              onDragShape={this.handleDragShape}
              onCommitDragShape={this.handleCommitDragShape}
            />
            <BoundingBox position={position} />
          </Svg>
        </View>
      </SelectedShapesContext.Provider>
    )
  }
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    rootChildIds: state.allShapes[0].childIds,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    onAddSelection: id => dispatch(addSelection(id)),
    onSelectShape: (id, activeModifiers) => dispatch(selectShape(id, activeModifiers)),
    onTransformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppCanvas)

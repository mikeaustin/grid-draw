import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/svg/Ruler'
import Grid from 'core/components/svg/Grid'
import BoundingBox from 'core/components/svg/BoundingBox'

import { selectShape, addSelection, transformShape } from 'app/actions/common'
import { ShapeList, SelectedShapesContext } from 'app/components'

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
    this.props.onDragShape(id, delta)
  }

  handleCommitDragShape = (id, delta) => {
    this.props.onCommitDragShape(id, delta)
  }

  handleShouldSetResponder = event => true

  render() {
    return (
      <View fill>
        <View pointerEvents="none" style={styles.shadow} />
        <Svg
          onStartShouldSetResponder={this.handleShouldSetResponder}
          onResponderGrant={this.handleResponderGrant}
          style={styles.svg}
        >
          <Grid />
          <ShapeList
            allShapes={this.props.allShapes}
            selectedShapeIds={this.props.selectedShapeIds}
            childIds={this.props.allShapes[0].childIds}
            onSelectShape={this.handleSelectShape}
            onDragShape={this.handleDragShape}
            onCommitDragShape={this.handleCommitDragShape}
          />
          <SelectedShapesContext.Consumer>
            {selectedShapes => {
              const position = selectedShapes[0] && selectedShapes[0].position

              return <BoundingBox position={position} />
            }}
          </SelectedShapesContext.Consumer>
          <Ruler />
        </Svg>
      </View>
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

import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Svg } from 'react-native-svg'

import { View } from 'core/components'
import Ruler from 'core/components/svg/Ruler'
import Grid from 'core/components/svg/Grid'
import BoundingBox from 'core/components/svg/BoundingBox'
import { boundingBox } from 'core/utils/geometry'

import { selectShape, addSelection, transformShape } from 'app/actions/common'
import { shapeRegistration, CanvasShape, SelectedShapesContext } from 'app/components'

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
    touchAction: 'none',
  }
})

class AppCanvas extends React.PureComponent {
  handleStartShouldSetResponder = event => true

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

  render() {
    console.log('AppCanvas()')
    
    const { options } = this.props

    return (
      <View fill>
        <View pointerEvents="none" style={styles.shadow} />
        <Svg
          onStartShouldSetResponder={this.handleStartShouldSetResponder}
          onResponderGrant={this.handleResponderGrant}
          style={styles.svg}
        >
          {options.showGrid && <Grid />}
          <CanvasShape
            shape={this.props.allShapes[0]}
            selected={false}
            capture={false}
            allShapes={this.props.allShapes}
            childIds={this.props.allShapes[0].childIds}
            selectedShapeIds={this.props.selectedShapeIds}
            onSelectShape={this.handleSelectShape}
            onDragShape={this.handleDragShape}
            onCommitDragShape={this.handleCommitDragShape}
          />
          <SelectedShapesContext.Consumer>
            {selectedShapes => {
              return <BoundingBox shapes={selectedShapes} shapeRegistration={shapeRegistration} />
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
    options: state.options,
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

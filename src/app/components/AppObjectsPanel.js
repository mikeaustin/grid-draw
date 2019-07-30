import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'

import { View } from 'core/components'
import PanelHeader from './PanelHeader'
import { connect } from 'react-redux'
import { selectShape } from 'app/actions/common'

const ShapeItemList = ({
  depth, theme, allShapes, childIds, selectedShapeIds, onSelectShape
}) => {
  return (
    childIds.asMutable().reverse().map(childId => {
      const selected = selectedShapeIds.some(shapeId => shapeId === childId)

      return (
        <ShapeItem
          key={childId}
          id={childId}
          type={allShapes[childId].type}
          depth={depth}
          theme={theme}
          selected={selected}
          onSelectShape={onSelectShape}
          shapeListProps={{
            allShapes,
            selectedShapeIds,
            childIds: allShapes[childId].childIds
          }}
        />
      )
    })
  )
}

const ShapeItem = ({
  depth, theme, id, type, selected, onSelectShape, shapeListProps
}) => {
  return (
    <View>
      <TouchableWithoutFeedback key={id} onPressIn={() => onSelectShape(id)}>
        <View
          style={[
            {paddingVertical: 5, paddingHorizontal: 10, outlineWidth: 1},
            selected && {backgroundColor: theme.highlightColor}
          ]}
        >
          <Text
            style={[
              {marginTop: -1, paddingLeft: depth * 15, fontWeight: '500', color: 'hsl(0, 0%, 25%)'},
              selected && {color: 'white'}
            ]}
          >
            {type}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <ShapeItemList
        depth={depth + 1}
        theme={theme}
        onSelectShape={onSelectShape}
        {...shapeListProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  objectsPanel: {
    // backgroundColor: theme.backgroundColor,
    marginTop: 1,
  },
  border: {
    borderRightWidth: 1,
    right: -1,
    borderColor: 'hsla(0, 0%, 0%, 0.1)',
  },
})

const AppObjectsPanel = ({
  theme, allShapes, rootChildIds, selectedShapeIds, onSelectShape
}) => {
  // console.log('AppObjectsPanel.render()')

  const handleSelectShape = id => {
    onSelectShape(id)
  }
  
  return (
    <View width={256} style={styles.objectsPanel} borderStyle={styles.border}>
      <PanelHeader heading="Objects" />
      <View style={{paddingVertical: 5}}>
        <ShapeItemList
          depth={0}
          theme={theme}
          allShapes={allShapes}
          selectedShapeIds={selectedShapeIds}
          childIds={rootChildIds}
          onSelectShape={handleSelectShape}
        />
      </View>
    </View>
  )
}

const mapStateToProps = state => {
  // console.log('AppObjectsPanel.mapStateToProps()')

  return {
    allShapes: state.allShapes,
    rootChildIds: state.allShapes[0].childIds,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  // console.log('AppObjectsPanel.mapDispatchToProps()')

  return {
    dispatch,
    onSelectShape: id => dispatch(selectShape(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppObjectsPanel)

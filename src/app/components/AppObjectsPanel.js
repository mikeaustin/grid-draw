import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'

import { View } from 'core/components'
import PanelHeader from './PanelHeader'
import { connect } from 'react-redux'
import { selectShape } from 'app/actions/common'

const styles = StyleSheet.create({
  objectsPanel: {
    // backgroundColor: theme.backgroundColor,
    marginTop: 1,
  },
  panelBorder: {
    borderRightWidth: 1,
    right: -1,
    borderColor: 'hsla(0, 0%, 0%, 0.1)',
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    outlineWidth: 1,
  },
  itemText: {
    marginTop: -1,
    fontWeight: '500',
    color: 'hsl(0, 0%, 25%)',
  }
})

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
  const handlePressIn = useCallback(event => {
    event.preventDefault()

    onSelectShape(id)
  }, [onSelectShape, id])

  return (
    <View>
      <TouchableWithoutFeedback key={id} onPressIn={handlePressIn}>
        <View style={[styles.item, selected && {backgroundColor: theme.highlightColor} ]}>
          <Text style={[styles.itemText, { paddingLeft: depth * 15 }, selected && { color: 'white' }]}>
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

const AppObjectsPanel = ({
  theme, allShapes, rootChildIds, selectedShapeIds, onSelectShape
}) => {
  // console.log('AppObjectsPanel.render()')

  const handleSelectShape = id => {
    onSelectShape(id)
  }
  
  return (
    <View width={256} style={styles.objectsPanel} borderStyle={styles.panelBorder}>
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

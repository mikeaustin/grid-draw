import React from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native'

import { View } from 'core/components'
import PanelHeader from './PanelHeader'
import { connect } from 'react-redux'
import { selectShape } from 'app/actions/common'

const ShapeItemList = ({
  depth, theme, allShapes, childIds, selectedShapeIds, onSelect
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
          onSelect={onSelect}
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
  depth, theme, id, type, selected, onSelect, shapeListProps
}) => {
  return (
    <View>
      <TouchableWithoutFeedback key={id} onPressIn={() => onSelect(id)}>
        <View
          style={[
            {paddingVertical: 5, paddingHorizontal: 10},
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
        onSelect={onSelect}
        {...shapeListProps}
      />
    </View>
  )
}

const AppObjectsPanel = ({
  theme, allShapes, rootChildIds, selectedShapeIds, selectShape
}) => {
  // console.log('AppObjectsPanel.render()')

  const handleSelect = id => {
    selectShape(id)
  }
  
  return (
    <View width={256} style={{
      backgroundColor: theme.backgroundColor,
      borderRightWidth: 0.5,
      borderRightColor: 'hsla(0, 0%, 0%, 0.29)',
    }}>
      <PanelHeader heading="Objects" />
      <View style={{paddingVertical: 5}}>
        <ShapeItemList
          depth={0}
          theme={theme}
          allShapes={allShapes}
          selectedShapeIds={selectedShapeIds}
          childIds={rootChildIds}
          onSelect={handleSelect}
        />
      </View>
    </View>
  )
}

const mapStateToProps = state => {
  // console.log('AppObjectsPanel.mapStateToProps()')

  return {
    allShapes: state.allShapes2,
    rootChildIds: state.allShapes2[0].childIds,
    selectedShapeIds: state.selectedShapeIds,
  }
}

const mapDispatchToProps = dispatch => {
  console.log('AppObjectsPanel.mapDispatchToProps()')
  return {
    dispatch,
    selectShape: id => dispatch(selectShape(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppObjectsPanel)

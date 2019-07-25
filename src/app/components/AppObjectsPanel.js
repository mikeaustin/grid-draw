import React from 'react'
import { Text, TouchableWithoutFeedback } from 'react-native'

import { View } from 'core/components'
import PanelHeader from './PanelHeader'
import { connect } from 'react-redux'
import { selectShape } from 'app/actions/common'

const ShapeList = ({
  depth = 0, theme, allShapes2, childIds, selectedShapeIds, onSelect
}) => {
  return (
    childIds.map(childId => {
      const selected = selectedShapeIds.some(shapeId => shapeId === childId)

      return (
        <ShapeItem
          key={childId}
          id={childId}
          type={allShapes2[childId].type}
          depth={depth}
          theme={theme}
          allShapes2={allShapes2}
          childIds={allShapes2[childId].childIds}
          selectedShapeIds={selectedShapeIds}
          selected={selected}
          onSelect={onSelect}
        />
      )
    })
  )
}

const ShapeItem = ({
  allShapes2, childIds, selectedShapeIds,
  depth, theme, id, type, selected, onSelect
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
      <ShapeList
        depth={depth + 1}
        theme={theme}
        allShapes2={allShapes2}
        selectedShapeIds={selectedShapeIds}
        childIds={childIds}
        onSelect={onSelect}
      />
    </View>
  )
}

const AppObjectsPanel = ({ theme, allShapes2, rootChildIds, selectedShapeIds, selectShape }) => {
  console.log('AppObjectsPanel.render()')

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
        <ShapeList
          depth={0}
          theme={theme}
          allShapes2={allShapes2}
          selectedShapeIds={selectedShapeIds}
          childIds={rootChildIds}
          onSelect={handleSelect}
        />
        {/* {rootChildIds.map(childId => {
          const selected = selectedShapeIds.some(shapeId => shapeId === childId)

          return (
            <ShapeItem
              key={childId}
              theme={theme}
              allShapes2={allShapes2}
              childIds={allShapes2[childId].childIds}
              selectedShapeIds={selectedShapeIds}
              id={childId}
              selected={selected}
              onSelect={handleSelect}
            />
          )
        })} */}
      </View>
    </View>
  )
}

const mapStateToProps = state => {
  console.log('AppObjectsPanel.mapStateToProps()')
  return {
    allShapes2: state.allShapes2,
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

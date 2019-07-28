import React, { useState, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, SectionList } from 'react-native'
import Slider from 'react-native-slider'

import { View, Spacer, Text, Divider } from 'core/components'
import { NumericInput, NumericField } from 'core/components/NumericInput'
import PanelHeader from './PanelHeader'
import { ActionTypes } from 'app/actions/common'

const AppPropertiesPanel = ({ theme, selectedShapes, setOpacity, transformShape }) => {
  const handleOpacityValueChange = opacity => {
    setOpacity(selectedShapes[0].id, opacity)
  }

  const handleOpacitySubmit = opacity => {
    setOpacity(selectedShapes[0].id, opacity / 100)
  }

  const handlePositionXSubmit = positionX => {
    transformShape(selectedShapes[0].id, ActionTypes.MOVE_SHAPE, {
      x: positionX - selectedShapes[0].position.x, y: 0
    })
  }

  const handlePositionYSubmit = positionY => {
    transformShape(selectedShapes[0].id, ActionTypes.MOVE_SHAPE, {
      x: 0, y: positionY - selectedShapes[0].position.y
    })
  }

  const selectedShape = selectedShapes[0] || { position: {}, opacity: null }
  const opacityProps = { width: 50, maxLength: 3, units: '%', disabled: !selectedShapes[0] }
  const positionProps = { width: 65, maxLength: 4, units: 'px', disabled: !selectedShapes[0] }
  const { position, opacity } = selectedShape

  return (
    <View
      width={256}
      style={{marginTop: 1, backgroundColor: theme.backgroundColor}}
      borderStyle={{borderLeftWidth: 1, left: -1, borderColor: 'hsla(0, 0%, 0%, 0.1)'}}
    >
      <PanelHeader heading="Properties" />
      <View horizontal align="center" style={{ paddingVertical: 5, paddingHorizontal: 10}}>
        <Slider
          minimumTrackTintColor="rgb(33, 150, 243)"
          thumbTintColor="white"
          style={{flex: 1}}
          disabled={!selectedShapes[0]}
          thumbStyle={{
            boxShadow: [
              '0 0 3px rgba(0, 0, 0, 0.1)', // Soft shadow
              // '0 2px 1px rgba(0, 0, 0, 0.1)',  // Drop shadow
              '0 0 1px rgba(0, 0, 0, 0.5)',    // Sharp shadow
            ].join(', '),
          }}
          value={selectedShapes[0] && selectedShapes[0].opacity}
          onValueChange={handleOpacityValueChange}
        />
        <Spacer />
        <NumericInput {...opacityProps} value={opacity * 100} onSubmit={handleOpacitySubmit} />
      </View>
      <View horizontal align="center" style={{ paddingVertical: 5, paddingHorizontal: 10}}>
        <NumericField {...positionProps} label="X" value={position.x} onSubmit={handlePositionXSubmit} />
        <Spacer />
        <NumericField {...positionProps} label="Y" value={position.y} onSubmit={handlePositionYSubmit}
        />
      </View>
      <SectionList
        renderSectionHeader={({section: {title}}) => (
          <View style={{paddingVertical: 5, paddingHorizontal: 10, marginTop: 10}}>
            <Text style={{fontWeight: '700'}}>{title}</Text>
          </View>
        )}
        renderItem={({item, index, section}) => (
          <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'white'}}>
            <Text key={index}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => item}
        sections={[
          {title: 'Title1', data: ['item1', 'item2']},
          {title: 'Title2', data: ['item3', 'item4']},
          {title: 'Title3', data: ['item5', 'item6']},
        ]}
      />
    </View>
  )
}

export default AppPropertiesPanel

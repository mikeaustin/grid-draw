import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { View as NativeView, Text, Image, Button, TextInput, TouchableOpacity, TouchableWithoutFeedback, SectionList } from 'react-native'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
import Slider from "react-native-slider"
import { Svg, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'
import * as $ from 'seamless-immutable'

import './App.css'
import { Point } from './core/utils/geometry'
import { withLayoutProps } from './core/utils/layout'
import { Spacer, Divider, List, Toolbar } from './core/components'
import Shape from './app/components/Shape'
import AppToolbar from './app/components/AppToolbar'
import { ActionTypes, selectTool, selectShape, transformShape, setOpacity } from './app/actions/common'

const View = withLayoutProps(NativeView)

const highlightColor = 'rgb(33, 150, 243)'
// const backgroundColor = 'hsl(0, 0%, 97%)'
// const backgroundColor = 'hsla(0, 0%, 0%, 0.01)'
const backgroundColor = ''
const borderColor = 'hsla(0, 0%, 0%, 0.29)'
const titleColor = 'hsla(0, 0%, 0%, 0.11)'

const initialState = {
  allShapes: $({
    0: { id: 0, type: 'GridDraw.Ellipse', position: Point(100, 100), size: Point(100, 100), opacity: 0.25 },
    1: { id: 1, type: 'GridDraw.Rectangle', position: Point(300, 100), size: Point(100, 100), opacity: 0.75 },
  }),
  selectedShapeIds: [],
  selectedTool: ActionTypes.MOVE_SHAPE,
}

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const merge = updater => value => value.merge(updater(value))

const shapeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_TOOL: {
      return state.merge({ selectedTool: action.payload.actionType })
    }
    case ActionTypes.SELECT_SHAPE: {
      return {
        ...state,
        selectedShapeIds: action.payload.id !== undefined ? [action.payload.id] : [],
      }
    }
    case ActionTypes.MOVE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return {
        ...state,
        allShapes: allShapes.update(id, merge(({ position }) => ({ position: add(position, delta) })))
      }
    }
    case ActionTypes.SCALE_SHAPE: {
      const { allShapes } = state
      const { id, delta } = action.payload

      return {
        ...state,
        allShapes: allShapes.update(id, merge(({ size }) => ({ size: add(size, delta) })))
      }
    }
    case ActionTypes.SET_OPACITY: {
      const { id, opacity } = action.payload

      return {
        ...state,
        allShapes: state.allShapes.update(id, merge(() => ({ opacity: opacity })))
      }
    }
  }

  return state
}

const mapStateToProps = state => {
  return {
    allShapes: state.allShapes,
    selectedShapes: state.selectedShapeIds.map(id => state.allShapes[id].merge({selected: false})),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    transformShape: (id, actionType, delta) => dispatch(transformShape(id, actionType, delta)),
    selectShape: id => dispatch(selectShape(id)),
    setOpacity: (id, opacity) => dispatch(setOpacity(id, opacity))
  }
}

const store = createStore(shapeReducer)

const PanelHeader = ({ heading }) => {
  return (
  <View style={{paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'hsla(0, 0%, 0%, 0.05)'}}>
    <Text style={{fontWeight: '700', color: 'hsl(0, 0%, 25%)'}}>{heading}</Text>
  </View>
  )
}

const _Shapes = ({ selectedShapes, allShapes, selectShape, setOpacity, transformShape, dispatch, ...props }) => {
  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  const handleSelect = id => {
    selectShape(id)
  }

  const handleDrag = (id, delta) => {
    transformShape(id, toolActionType, delta)
  }

  // const handleOpacityKeyPress = event => {
  //   if (event.nativeEvent.key === 'Enter') {
  //     console.log('set opacity', opacityText)
  //     setOpacity(selection[0], Number(opacityText))
  //   }
  // }

  const handleOpacityValueChange = opacity => {
    // setSliderOpacity(opacity)
    setOpacity(selectedShapes[0].id, opacity)
  }

  return (
    <View fill>
      <AppToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />

      <View horizontal fill style={{perspective: 10000}}>
        <View width={256} style={{
          backgroundColor: backgroundColor,
          // background: 'linear-gradient(90deg, hsl(0, 0%, 85%), hsl(0, 0%, 95%))',
          // paddingVertical: 10,
          borderRightWidth: 0.5,
          borderRightColor: 'hsla(0, 0%, 0%, 0.29)',
        }}>
          <PanelHeader heading="Objects" />
          <View style={{paddingVertical: 5}}>
            {Object.entries(allShapes).map(([id, shape]) => {
              const selected = selectedShapes.some(shape => shape.id == id)

              return (
                <TouchableWithoutFeedback key={id} onPressIn={() => handleSelect(id)}>
                  <View
                    style={[
                      {paddingVertical: 5, paddingHorizontal: 10},
                      selected && {backgroundColor: highlightColor}
                    ]}
                  >
                    <Text style={[{marginTop: -1, fontWeight: '500', color: 'hsl(0, 0%, 25%)'}, selected && {color: 'white'}]}>
                      {shape.type}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            })}
          </View>
        </View>

        <Svg
          onStartShouldSetResponder={event => true}
          onResponderGrant={event => selectShape()}
          // onResponderMove={event => console.log(event.nativeEvent.locationX)}
          style={{flex: 1, xboxShadow: 'inset 0 0 5px hsla(0, 0%, 0%, 0.5)'}}
        >
          {Object.entries(allShapes).map(([id, shape]) => (
            <Shape
              key={id}
              id={id}
              type={shape.type}
              opacity={shape.opacity}
              selected={selectedShapes.some(shape => shape.id == id)}
              position={shape.position}
              size={shape.size}
              onSelect={handleSelect}
              onDrag={handleDrag}
            />
          ))}
        </Svg>

        <View width={256} style={{backgroundColor: backgroundColor,
          borderLeftWidth: 0.5,
          borderLeftColor: borderColor,
        }}>
          <PanelHeader heading="Properties" />
          <View horizontal style={{ paddingVertical: 5, paddingHorizontal: 10}}>
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
            <TextInput
              value={selectedShapes[0] ? selectedShapes[0].opacity.toFixed(2) : '0.00'}
              // onChangeText={text => setOpacity(text)}
              // onKeyPress={handleOpacityKeyPress}
              style={{width: 35}}
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
            sections={[
              {title: 'Title1', data: ['item1', 'item2']},
              {title: 'Title2', data: ['item3', 'item4']},
              {title: 'Title3', data: ['item5', 'item6']},
            ]}
          />
        </View>

      </View>
    </View>
  )
}

const Shapes = connect(mapStateToProps, mapDispatchToProps)(_Shapes)

function App() {
  return (
    <Provider store={store}>
      <View fill>
        <Shapes />
      </View>
    </Provider>
  )
}

export default App

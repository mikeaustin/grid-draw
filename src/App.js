import React, { useState } from 'react'
// import { Slider } from 'react-native-elements'
// import * as Slider from '@react-native-community/slider'
// import Slider from "react-native-slider"
import JsxParser from 'react-jsx-parser'

import { View } from 'core/components'
import { AppMainToolbar, AppObjectsPanel, AppPropertiesPanel } from 'app/components'
import { ActionTypes } from 'app/actions/common'
import { AppCanvas } from 'app/components'
import './App.css'

const theme = {
  backgroundColor: 'transparent',
  highlightColor: 'rgb(33, 150, 243)',
  borderColor: 'hsla(0, 0%, 0%, 0.29)',
  titleColor: 'hsla(0, 0%, 0%, 0.11)',
}

const App = () => {
  // console.log('App.render()')

  const [toolActionType, setToolActionType] = useState(ActionTypes.MOVE_SHAPE)

  return (
    <View fill>
      <AppMainToolbar toolActionType={toolActionType} setToolActionType={setToolActionType} />
      <View horizontal fill>
        <AppObjectsPanel theme={theme} />
        <AppCanvas toolActionType={toolActionType} />
        <AppPropertiesPanel theme={theme} />
      </View>
    </View>
  )
}

export default App

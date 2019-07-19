import React from 'react'
import { Provider, connect } from 'react-redux'
import { View, Image, TouchableWithoutFeedback } from 'react-native'

import { List } from '.'

const Toolbar = ({ children, dispatch, actionType, setActionType, ...props }) => {
  return (
    <List {...props}>
      {React.Children.map(children, (child, index) => (
        React.cloneElement(child, {
          selected: child.props.actionType === actionType,
          onPressIn: () => setActionType(child.props.actionType),
        })
      ))}
    </List>
  )
}

const Button = ({ actionType, icon, imageSource, selected, onPressIn }) => {
  const buttonStyle = [
    { padding: 5, borderRadius: 2 },
    selected && {backgroundColor: 'hsla(0, 0%, 0%, 0.15)'},
  ]

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn}>
      <View style={buttonStyle}>
        <Image
          source={imageSource || {uri: `/images/icons/${icon}.svg`}}
          style={{width: 25, height: 25}}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

Toolbar.Button = Button

export default connect()(Toolbar)
export {
  Button
}

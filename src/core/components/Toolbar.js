import React from 'react'
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native'

import { Spacer, List } from '.'

const Toolbar = ({ children, value, setValue, ...props }) => {
  return (
    <List {...props}>
      {React.Children.map(children, (child, index) => (
        React.cloneElement(child, {
          ...props,
          selected: child.props.value === value,
          onPressIn: () => setValue(child.props.value),
        })
      ))}
    </List>
  )
}

const Group = ({ children, title, value, setValue, ...props }) => {
  return (
    <View>
      <List spacerSize="xsmall" {...props}>
        {React.Children.map(children, (child, index) => (
          React.cloneElement(child, {
            selected: child.props.value === value,
            onPressIn: () => setValue(child.props.value),
          })
        ))}
      </List>
      <Spacer size="xsmall" />
      <Text style={{ fontSize: 12, color: 'hsl(0, 0%, 25%)', textAlign: 'center' }}>{title}</Text>
    </View>
  )
}

const Button = ({ value, icon, imageSource, selected, onPressIn }) => {
  const buttonStyle = [
    { padding: 5, borderRadius: 2, borderWidth: 0.5, borderColor: 'transparent' },
    selected && {backgroundColor: 'hsla(0, 0%, 0%, 0.11)', borderColor: 'hsla(0, 0%, 0%, 0.05)' },
  ]

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn}>
      <View style={buttonStyle}>
        <Image
          source={imageSource || {uri: `/images/icons/${icon}.svg`}}
          style={{width: 25, height: 25, opacity: 0.65}}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

Toolbar.Group = Group
Toolbar.Button = Button

export default Toolbar
export {
  Group,
  Button
}

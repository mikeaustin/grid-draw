import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native'

import { Spacer, List } from '.'

const toolbarStyle = {
  paddingVertical: 5,
  zIndex: 1,
}

const Toolbar = ({ children, style, value, setValue, ...props }) => {
  const handlePressIn = value => event => {
    event.preventDefault()

    setValue(value)
  }

  return (
    <List
      borderStyle={{borderBottomWidth: 1, bottom: -1, borderColor: 'hsla(0, 0%, 0%, 0.1)'}}
      style={[toolbarStyle, style]} {...props}
    >
      {React.Children.map(children, (child, index) => (
        React.cloneElement(child, {
          ...props,
          selected: child.props.value === value,
          onPressIn: handlePressIn(child.props.value),
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
            onPress: () => setValue(child.props.value),
          })
        ))}
      </List>
      <Spacer size="xsmall" />
      <Text style={{ fontSize: 12, color: 'hsl(0, 0%, 25%)', textAlign: 'center' }}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 2,
    outlineWidth: 1,
  },
  selectedButton: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.1)'
  },
  activeButton: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.2)'
  },
})

const Button = ({ title, icon, imageSource, selected, onPress }) => {
  const [active, setActive] = useState(false)
  
  const setNativeProps = ref => {
    ref && title && ref.setNativeProps({ title: title })
  }

  const handlePressIn = event => {
    setActive(true)
  }

  const handlePressOut = event => {
    setActive(false)
  }

  const handlePress = event => {
    onPress()
  }

  const buttonStyle = [
    styles.button,
    selected && styles.selectedButton,
    active && styles.activeButton,
  ]

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <View ref={setNativeProps} style={buttonStyle}>
        <Image
          source={imageSource || {uri: `images/icons/${icon}.svg`}}
          style={{width: 25, height: 25, opacity: 1.0}}
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

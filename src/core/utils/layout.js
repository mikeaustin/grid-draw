import React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  horizontal: { flexDirection: 'row' },
  fill: { flexGrow: 1 },
  ['justify-start']: { justifyContent: 'flex-start' },
  ['justify-center']: { justifyContent: 'center' },
  ['justify-end']: { justifyContent: 'flex-end' },
  ['align-start']: { alignItems: 'flex-start' },
  ['align-center']: { alignItems: 'center' },
  ['align-end']: { alignItems: 'flex-end' },
  ['align-stretch']: { alignItems: 'stretch' },
})

const withLayoutProps = Component => ({
  horizontal, fill, justify, align, width, height, style, ...props
}) => {
  const rootStyles = [
    horizontal && styles.horizontal,
    fill && typeof fill === 'boolean' ? styles.fill : { flexGrow: fill },
    justify && styles[`justify-${justify}`],
    align && styles[`align-${align}`],
    width && {width: width},
    height && {height: height},
  ]

  return (
    <Component style={[rootStyles, style]} {...props} />
  )
}

export {
  withLayoutProps
}

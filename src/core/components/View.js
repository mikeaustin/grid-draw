import React from 'react'
import { StyleSheet, View as NativeView } from 'react-native'

import { withLayoutProps } from 'core/utils/layout';

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  }
})

const View = ({ children, borderStyle, ...props }) => {
  return (
    <NativeView {...props}>
      <NativeView style={[styles.border, borderStyle]} />
      {children}
    </NativeView>
  )
}

export default withLayoutProps(View)

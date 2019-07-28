import React from 'react'
import { Text as NativeText } from 'react-native'

import { withLayoutProps } from 'core/utils/layout';

const Text = ({ children, ...props }) => {
  return (
    <NativeText {...props}>
      {children}
    </NativeText>
  )
}

export default withLayoutProps(Text)

import React from 'react'
import { View as NativeView } from 'react-native'

import { withLayoutProps } from 'core/utils/layout';

const View = ({ ...props }) => {
  return (
    <NativeView {...props} />
  )
}

export default withLayoutProps(View)

import React from 'react'
import { View } from 'react-native'

import { withLayoutProps } from '../utils/layout'
import { Spacer } from '.'

const List = ({ children, spacerSize = 'none', ...props }) => {
  return (
    <View {...props}>
      {React.Children.map(children, (child, index) => (
        <>
        {index > 0 && <Spacer size={spacerSize} />}
        {child}
        </>
      ))}
    </View>
  )
}

export default withLayoutProps(List)

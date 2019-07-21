import React from 'react'

import { View, Spacer } from '.'
import { withLayoutProps } from 'core/utils/layout'

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

export default List

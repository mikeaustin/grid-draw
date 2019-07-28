import React from 'react'

import { View, Spacer } from '.'

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

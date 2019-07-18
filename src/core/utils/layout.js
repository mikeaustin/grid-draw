import React from 'react'

const withLayoutProps = Component => ({
  horizontal, fill, justify, align, width, height, style, ...props
}) => {
  const rootStyles = [
    horizontal && {flexDirection: 'row'},
    fill && {flexGrow: typeof fill === 'boolean' ? 1 : fill},
    justify && {justifyContent: justify},
    align && {alignItems: align},
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

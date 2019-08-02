import React from 'react'
import { Path } from 'react-native-svg'

const BoundingBox = ({ position }) => {
  if (!position) {
    return null
  }

  return (
    <Path
      transform={`translate(${position.x}, ${position.y})`}
      strokeWidth={2}
      stroke="rgb(33, 150, 243)"
      fill="none"
      d={`
        M 0.5, 11.5
        L 0.5, 0.5
        L 11.5, 0.5
        M 89.5, 0.5
        L 100.5, 0.5
        L 100.5, 11.5
        M 100.5, 89.5
        L 100.5, 100.5
        L 89.5, 100.5
        M 11.5, 100.5
        L 0.5, 100.5
        L 0.5, 89.5
      `}
    />
  )
}

export default BoundingBox

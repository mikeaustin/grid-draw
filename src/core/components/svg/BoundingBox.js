import React from 'react'
import { Path } from 'react-native-svg'

const BoundingBox = ({ position, size }) => {
  if (!position) {
    return null
  }

  return (
    <React.Fragment>
      <Path
        transform={`translate(${position.x}, ${position.y})`}
        strokeWidth={3}
        stroke="rgb(33, 150, 243)"
        fill="none"
        d={`
          M -1.5, 10.5
          L -1.5, -1.5
          L 10.5, -1.5
          M ${size.x - 9.5}, -1.5
          L ${size.x + 2.5}, -1.5
          L ${size.x + 2.5}, 10.5
          M ${size.x + 2.5}, ${size.y - 9.5}
          L ${size.x + 2.5}, ${size.y + 2.5}
          L ${size.x - 9.5}, ${size.y + 2.5}
          M 10.5, ${size.y + 2.5}
          L -1.5, ${size.y + 2.5}
          L -1.5, ${size.y - 9.5}
        `}
      />
      <Path
        transform={`translate(${position.x}, ${position.y})`}
        strokeWidth={2}
        stroke="rgba(33, 150, 243, 1.0)"
        fill="none"
        d={`
          M 0.5, 0.5
          L ${size.x + 0.5}, 0.5
          L ${size.x + 0.5}, ${size.y + 0.5}
          L ${0.5}, ${size.y + 0.5}
          Z
        `}
      />
    </React.Fragment>
  )
}

export default React.memo(BoundingBox)

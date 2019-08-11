import React from 'react'
import { G, Line } from 'react-native-svg'

const Grid = ({ offset }) => {
  return (
    <G x={offset.x} y={offset.y}>
      {Array.from({length: 50}, (_, index) => (
        <React.Fragment key={index}>
          <Line
            x1={0}
            y1={index * 50 + 0.5}
            x2={'100%'}
            y2={index * 50 + 0.5}
            stroke="hsl(0, 0%, 50%)"
            strokeDasharray={'1 9'}
          />
          <Line
            x1={index * 50 + 0.5}
            y1={0}
            x2={index * 50 + 0.5}
            y2={'100%'}
            stroke="hsl(0, 0%, 50%)"
            strokeDasharray={'1 9'}
          />
        </React.Fragment>
      ))}
    </G>
  )
}

export default React.memo(Grid)

/*

const Grid = () => {
  return (
    <G>
      {/ * Crosshairs * /}
      {Array.from({length: 10}, (_, index) => (
        <Line
          key={index}
          x1={0}
          y1={index * 100 + 100.5}
          x2={'100%'}
          y2={index * 100 + 100.5}
          stroke="hsl(0, 0%, 80%)"
          strokeDasharray={'3 97'}
          strokeDashoffset="1"
        />
      ))}
      {Array.from({length: 10}, (_, index) => (
        <Line
          key={index}
          x1={index * 100 + 100.5}
          y1={0}
          x2={index * 100 + 100.5}
          y2={'100%'}
          stroke="hsl(0, 0%, 80%)"
          strokeDasharray={'3 97'}
          strokeDashoffset="1"
        />
      ))}
      {/ * Dot-Matrix * /}
      {Array.from({length: 100}, (_, index) => (
        <Line
          key={index}
          x1={0}
          y1={index * 10 + 0.5}
          x2={'100%'}
          y2={index * 10 + 0.5}
          stroke="hsl(0, 0%, 80%)"
          strokeDasharray={'1 9'}
        />
      ))}
    </G>
  )
}

*/

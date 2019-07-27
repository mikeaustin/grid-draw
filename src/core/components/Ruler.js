import React from 'react'
import { Text, G, Line } from 'react-native-svg'

const Ruler = ({ vertical }) => {
  return (
    <G>
      {Array.from({length: 100}, (_, index) => (
        <React.Fragment>
          <Line
            x1={index * 10 + 30.5}
            y1={index % 5 === 0 ? (index % 10 === 0 ? 0 : 10) : 20}
            x2={index * 10 + 30.5}
            y2={30}
            stroke="hsla(0, 0%, 0%, 0.2)"
          />
          {index % 10 === 0 && (
            <Text x={index * 10 + 35} y={14} style={{fontSize: 12}}>{index * 10}</Text>
          )}
        </React.Fragment>
      ))}
      <Line
        x1={30}
        y1={30.5}
        x2={1000}
        y2={30.5}
        stroke="hsla(0, 0%, 0%, 0.2)"
      />
    </G>
  )
}

export default Ruler

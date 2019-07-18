import React from 'react'
import ReactDOM from 'react-dom'
import { AppRegistry } from 'react-native'
import { Svg, Ellipse, Rect } from 'react-native-svg'
import JsxParser from 'react-jsx-parser'
// import { html } from 'htm/react'

// console.log(html`<div></div>`)
// html.bind(React.createElement)
// ReactDOM.render(html`<a href="/">Hello!</a>`, document.body);

import './index.css';
import App from './App';

AppRegistry.registerComponent('App', () => App)

const Foo = ({ foo }) => <div data-foo={foo} />

async function main() {
  const shapes = await import(/* webpackIgnore: true */ '/shapes.js')
  console.log(shapes)

  const shape = (
    <Svg>
      <JsxParser
        components={{Foo, Ellipse, Rect}}
        jsx={shapes.default['GridDraw.Ellipse'].render}
        bindings={{
          position: { x: 2, y: 3 },
          // position: [0, 0],
          size: {width: 100, height: 100},
          selected: false,
        }}
        renderInWrapper={false}
      />
      </Svg>
  )

  // const div = document.createElement('div')
  // ReactDOM.render(foo, div)
  // console.log(div)

  AppRegistry.runApplication('App', {
    initialProps: {},
    rootTag: document.getElementById('root')
  })  
}

main()

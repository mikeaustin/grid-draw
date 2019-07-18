const shapeRegistration = {
  'GridDraw.Ellipse': {
    render: `
      <Ellipse
        cx={position.x + size.width / 2}
        cy={position.x + size.height / 2}
        rx={size.width / 2}
        ry={size.height / 2}
        strokeWidth={3}
        stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
        fill="#f0f0f0"
        {...props}
      />
    `
  },
  'GridDraw.Test': {
    render: React => ({ x }) => {
      const xr = React.createRef()

      return React.memo(`
        <div id="x" ref={${xr}}></div>
      `)
    }
  },
  'GridDraw.Rectangle': {
    render: ({ selected, position, size, ...props }) => {
      return `
        <Rect
          x={position[0]}
          y={position[1]}
          width={size[0]}
          height={size[1]}
          strokeWidth={3}
          stroke={selected ? 'rgb(33, 150, 243)' : 'black'}
          fill="#f0f0f0"
          {...props}
        />
      `
    }
  }
}

export default shapeRegistration

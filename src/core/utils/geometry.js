const Point = (x, y) => ({ x, y })

Point.add = (a, b) => Point(a.x + b.x, a.y + b.y)
Point.sub = (a, b) => Point(a.x - b.x, a.y - b.y)

const boundingBox = (shapes, shapeRegistration) => {
  const box = shapes.reduce(({ min, max }, shape) => {
    const meta = shapeRegistration[shape.type]

    return {
      min: Point(
        Math.min(min.x, shape.position.x),
        Math.min(min.y, shape.position.y)
      ),
      max: Point(
        Math.max(max.x, shape.position.x + meta.size(shape).x),
        Math.max(max.y, shape.position.y + shape.size.y)
      ),
    }
  }, {
      min: Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
      max: Point(0, 0)
    }
  )

  return [box.min, Point.sub(box.max, box.min)]
}

export {
  Point,
  boundingBox,
}

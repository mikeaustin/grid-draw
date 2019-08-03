const Point = (x, y) => ({ x, y })

const add = (a, b) => Point(a.x + b.x, a.y + b.y)
const sub = (a, b) => Point(a.x - b.x, a.y - b.y)

export {
  Point,
  add,
  sub,
}

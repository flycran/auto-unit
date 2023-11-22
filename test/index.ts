import AutoUnit from '../src/index'

const au = new AutoUnit([ 'b', 'kb', 'md' ], {
  decimal: 1024,
  exponential: 1000,
})

console.log(au.toString(1024 * 1024 * 1000))
export default {
  $schema: {
    type: String,
    default: 'https://vega.github.io/schema/vega-lite/v2.json'
  },
  description: {
    type: String
  },
  data: [Object, Array],
  mark: {
    type: String
  },
  encoding: {
    type: Object
  }
}


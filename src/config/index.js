import multiconfig from '@nukr/multiconfig'

export default multiconfig({
  rethinkdb: {
    host: 'rethinkdb',
    port: 28015
  },
  interval: 120 * 1000
})

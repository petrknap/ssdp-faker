const script = process.argv[1]
const processArgs = process.argv.slice(2)
const ssdp = require('node-ssdp')
const action = processArgs[0]
const location = processArgs[1]
const usns = processArgs.slice(2)

switch (action) {
  case 'scan-network':
    scanNetwork()
    break
  case 'run-server':
    runServer(location, usns)
    break
  default: // eslint-disable-line default-case-last
    console.log('Unsupported action %o', action)
    console.log('')
  case '-h': // eslint-disable-line no-fallthrough
  case '--help':
  case 'help':
    console.log('Usage: node %s scan-network', script)
    console.log('       node %s run-server location [USN1 ...]', script)
    console.log('')
    console.log('Visit https://github.com/petrknap/ssdp-faker for more information.')
    break
}

function scanNetwork () {
  const client = new ssdp.Client()
  const serviceType = 'ssdp:all'

  client.on('response', function (headers) {
    console.log(headers)
  })

  console.log('Scanning network for %o', serviceType)
  client.search(serviceType)

  setTimeout(function () {
    console.log('Scan complete')
  }, 5000)
}

function runServer (location, usns) {
  const server = new ssdp.Server({ location })
  console.log('Location set to %o', location)

  server.addUSN('upnp:rootdevice')
  usns.forEach(function (usn) {
    server.addUSN(usn)
    console.log('USN %o added', usn)
  })

  server.start()
  console.log('Server started')

  process.on('exit', function () {
    server.stop()
    console.log('Server stopped')
  })
}

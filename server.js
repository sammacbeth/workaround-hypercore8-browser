const websocket = require('websocket-stream')
const http = require('http')
const pump = require('pump')
const ram = require('random-access-memory')
const hypercore = require('@geut/hypercore-promise')

async function testHypercore () {
  const server = http.createServer();
  websocket.createServer({ server }, (stream, req) => {
    const key = req.url.substring(1)
    console.log('load core', key);
    const reader = hypercore(ram, Buffer.from(key, 'hex'))
    reader.on('append', async () => {
      console.log((await reader.head(0)).toString())
    })
    const r2 = reader.replicate(false, { live: true, encrypt: true })
    pump(stream, r2, stream, err => console.log(err))
  });
  server.listen(8000);
}

testHypercore();
const websocket = require('websocket-stream')
const pump = require('pump')
const ram = require('random-access-memory')
const hypercore = require('@geut/hypercore-promise')

async function testHypercore () {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  const writer = hypercore(ram)
  await writer.ready()
  const ws = websocket(`ws://localhost:8000/${writer.key.toString('hex')}`)
  const r1 = writer.replicate(true, { live: true, encrypt: true })
  pump(ws, r1, ws, err => console.log(err))

  let i = 0
  while (true) {
    await delay(1000)
    await writer.append(Buffer.from(`hello ${i++}`))
  }
}

testHypercore();
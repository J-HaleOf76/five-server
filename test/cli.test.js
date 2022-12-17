const assert = require('assert')
const path = require('path')

// run exec in github actions
// https://github.com/actions/toolkit/tree/main/packages/exec
const exec = require('@actions/exec').exec

const cmd = path.join(__dirname, '../lib', 'bin.js')

let stdout = ''
let stderr = ''

const options = {
  timeout: 2000,
  maxBuffer: 1024,
  listeners: {
    stdout: data => {
      stdout += data.toString()
    },
    stderr: data => {
      stderr += data.toString()
    }
  }
}

beforeEach(() => {
  stdout = ''
  stderr = ''
})

const exec_test = async args => {
  return await exec('node', [cmd].concat(args), options)
}

describe('command line usage', () => {
  it('--version', async () => {
    const error = await exec_test(['--version'])
    assert(!error, error)
    assert(stdout.indexOf('five-server') === 0, 'version not found')
  })
  it('--help', async () => {
    const error = await exec_test(['--help'])
    assert(!error, error)
    assert(stdout.indexOf('Usage: five-server') === 0, 'usage not found')
  })
  it('--quiet', async () => {
    const error = await exec_test(['--quiet', '--no-browser', '--test'])
    assert(!error, error)
    assert(stdout === '', 'stdout not empty')
  })
  it('--port', async () => {
    const error = await exec_test(['--port=16123', '--no-browser', '--test'])
    assert(!error, error)
    assert(stdout.indexOf('running at') >= 0, '"running at" string not found')
    assert(stdout.indexOf('16123') != -1, '"port" string not found')
  })
  it('--host', async () => {
    const error = await exec_test(['--host=0.0.0.0', '--no-browser', '--test'])
    assert(!error, error)
    assert(stdout.indexOf('running at') >= 0, '"running at" string not found')
    assert(stdout.indexOf('localhost:') != -1, 'host string not found')
  })
  // TODO: hppasswd does not work yet
  xit('--htpasswd', async () => {
    const error = await exec_test([
      '--htpasswd=' + path.join(__dirname, 'data/htpasswd-test'),
      '--no-browser',
      '--test'
    ])

    assert(!error, error)
    assert(stdout.indexOf('running at') >= 0, '"running at" string not found')
  })
})

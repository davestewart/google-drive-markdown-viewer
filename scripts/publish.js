import Fs from 'fs'
import Path from 'path'
import zip from 'bestzip'

function readJson (path) {
  const url = new URL(path, import.meta.url)
  const json = Fs.readFileSync(url, { encoding: 'utf-8'})
  return JSON.parse(json)
}

function makeZip () {
  // variables
  const pkg = readJson('../package.json')
  const path = `../${pkg.name}.zip`
  const destination = Path.resolve(path)

  // delete destination if it exists
  if (Fs.existsSync(destination)) {
    Fs.rmSync(destination)
  }

  // debug
  console.log(`Zipping source files:`)
  console.log(' - trg:', destination)

  // create
  return zip({
    cwd: 'src',
    source: '*',
    destination,
  }).then(function () {
    console.log(' - done!\n')
  }).catch(function (err) {
    console.error(err.stack)
    process.exit(1)
  })
}

makeZip()


import gcloud from 'gcloud'
import moment from 'moment'
import config from './config'
import fs from 'fs'
import { spawn } from 'child_process'

const FILE_PATH = `/tmp/rethinkdb_backup-${moment().utc().format('YYYY-MM-DD_HH-mm-ss')}.tar.gz`

let cp
setInterval(() => {
  cp = spawn(
    'rethinkdb-dump',
    ['-c', config.rethinkdb.host, '-f', FILE_PATH],
    { stdio: 'inherit' }
  )
}, config.interval)

cp.on('exit', (code) => {
  console.log(`rethinkdb-dump exited with code ${code}`)
  const gcs = gcloud.storage({
    projectId: 'instant-matter-785',
    keyFilename: '/credentials/credential.json'
  })

  const bucket = gcs.bucket('rethinkdb_backup.meepshop.tw')

  bucket.upload(process.argv[2], (err, file) => {
    if (err) {
      console.error(err)
    }
    console.log(file)
    fs.unlink(FILE_PATH, (err) => {
      if (err) throw new Error('delete file fail', err)
      console.log('delete file', FILE_PATH)
    })
  })
})


import gcloud from 'gcloud'
import moment from 'moment'
import config from './config'
import fs from 'fs'
import { spawn } from 'child_process'

backup()
setInterval(() => {
  backup()
}, config.interval)

function backup () {
  console.log('starting backup')
  const FILE_PATH = `/tmp/rethinkdb_backup-${moment().utc().format('YYYY-MM-DD_HH-mm-ss')}.tar.gz`
  console.log(`FILE_PATH is ${FILE_PATH}`)
  const cp = spawn(
    'rethinkdb-dump',
    ['-c', config.rethinkdb.host, '-f', FILE_PATH],
    { stdio: 'inherit' }
  )
  cp.on('error', (err) => {
    console.error(err)
  })
  cp.on('exit', (code) => {
    console.log(`rethinkdb-dump exited with code ${code}`)
    const gcs = gcloud.storage({
      projectId: 'instant-matter-785',
      keyFilename: '/credentials/credential.json'
    })

    const bucket = gcs.bucket('rethinkdb_backup.meepshop.tw')

    bucket.upload(FILE_PATH, (err, file) => {
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
}

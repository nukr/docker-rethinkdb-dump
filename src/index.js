import gcloud from 'gcloud'

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
})

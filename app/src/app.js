import express from 'express'
import bodyParser from 'body-parser'

import router from './routes'
const multer = require('multer')
const upload = multer()
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.any())

app.get('/', (req, res, next) => {
  return res.redirect('/alunos')
})

app.use('/alunos', router)

app.use((req, res, next) => {
  res.status(404).send({
    erro: {
      mensagem: 'Endpoint não encontrado'
    }
  })
})

app.use((error, req, res, next) => {
  res.status([error.status] || 500)
  return res.send({
    erro: {
      mensagem: error.message
    }
  })
})

export default app

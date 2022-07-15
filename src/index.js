//index.js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/transcript/:conversationId/generate', (req, res) => {
  res.send('Generate chat transcript for Conversation ID ' + req.params.conversationId )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
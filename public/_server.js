const express = require('express')
const app = express()
app.get('/hello',
  (req, res) => res.json({message: 'hello'}))
app.listen(4000)

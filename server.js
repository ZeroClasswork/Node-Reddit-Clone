const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

app.engine('handlebars', exphbs({ defaultLayout: 'layout', handlebars: allowInsecurePrototypeAccess(Handlebars) }))

app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
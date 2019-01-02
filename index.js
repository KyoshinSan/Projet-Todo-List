const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const db = require('sqlite')
const moment = require('moment')
const methodOverride = require('method-override')

let strDate = moment().format('DD[/]MM[/]YYYY')

app.set('views', './views')
app.set('view engine', 'pug')

db.open('todolist.db').then(() => {
  console.log('Database Ready')
  Promise.all([
    db.run('CREATE TABLE IF NOT EXISTS todos (message, completion, createdAt, updatedAt, userId)'),
    db.run('CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)')
  ])
}).then(() => {
  console.log('Tables Ready')
}).catch(() => {
  console.log('Error')
})

app.listen(PORT, () => {
  console.log('Serveur sur port : ', PORT)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use('/todos', require('./routes/todos'))

app.use('/users', require('./routes/users'))

app.use((req, res) => {
  res.format({
    'text/html': function() {
      res.status(404)
      res.send('Error 404 Not Found')
    },
    'application/json': function(){
      res.send({status: '404 not found'})
    }
  })
})
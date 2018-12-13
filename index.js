const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const db = require('sqlite')
const moment = require('moment')
const bcrypt = require('bcrypt')
const saltRounds = 10
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
app.use(express.urlencoded({
 extended: true
}))
app.use(methodOverride('_method'))

app.use('/todos', require('./routes/todos'))


app.get('/ressources/add', (req, res) => {
  console.log('-> GET /ressources')
  console.log('Database Open')
})

app.get('/ressources/:id/edit', (req, res) => {
  console.log('-> GET /ressources')
  console.log('Database Open')
})

app.get('/users/:id/todos', (req, res) => {
  console.log('-> GET /ressources')
  console.log('Database Open')
})


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

/* route GET /todos => res.json() (SELECT tous les todoslist dans la base de données)
db.all(une requete SQL) => SELECT *
db.get(une requete SQL) => 1 truc
db.run(une requete SQL) => pour changer les info dans la base

date.now() pour la date

route POST /todos => insert d'une todos liste */
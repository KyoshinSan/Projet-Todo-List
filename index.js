const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const db = require('sqlite')
const moment = require('moment')
const bcrypt = require('bcrypt')
const saltRounds = 10

let strDate = moment().format('l')

app.set('views', './views')
app.set('view engine', 'pug')

db.open('todolist.db').then(() => {
  console.log('Database Ready')
  return db.run('CREATE TABLE IF NOT EXISTS todos (message, completion, createdAt, updatedAt, userId)')
  return db.run('CREATE TABLE IF NOT EXISTS users (firstname, lastname, username, password, email, createdAt, updatedAt)')
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

app.get('/', (req, res) => {
  console.log('-> ALL /')
  res.redirect('/ressources')
})

app.get('/ressources', (req, res) => {
  console.log('-> GET /ressources')
  console.log('Database Open')
  res.format({
    'text/html': function() {
      res.render('main', {
        title: 'Projet Todo List',
        name: 'Todo  :',
        content: 'oui'
      })
    },
    'application/json': function(){
      return db.all('SELECT * FROM todos')
      .then(response => {
        res.send(response)
      }).catch(err => console.log(err))
    }
  })
})

app.get('/ressources/:id', (req, res) => {
  console.log('-> GET /ressources/:id (id : ' + req.params.id +')')
  console.log('Database Open')
  return db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id)
  .then(response => {
    if(!(response === undefined || response === null)) {
      res.json(response)
    } else {
      res.end('Aucune ligne trouvé !')
    }
  }).catch(err => console.log(err))
})

app.post('/ressources', (req, res) => {
  console.log('-> POST /ressources')
  console.log('Database Open')
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null) {
    res.end('Envoie echouer')
  } else {
    return db.run(`INSERT into todos VALUES ('${req.body.message}', '${req.body.completion}', '${strDate}', '${strDate}', '${req.body.userId}')`)
    .then(() => res.end('Donnée écrite'))
    .catch(err => console.log(err))
  }
})

app.delete('/ressources/:id', (req, res) => {
  console.log('-> DELETE /ressources/:id (id : ' + req.params.id +')')
  console.log('Database open')
  return db.run('DELETE FROM todos WHERE rowid = ' + req.params.id)
  .then(() => res.end('Donnée effacer'))
  .catch(err => console.log(err))
})

app.put('/ressources/:id', (req, res) => {
  console.log('-> PUT /ressources/:id (id : ' + req.params.id +')')
  console.log('Database open')
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null) {
    res.end('Modification echouer')
  } else {
    return db.run(`UPDATE todos SET message = '${req.body.message}', completion = '${req.body.completion}', updatedAt = '${strDate}' WHERE rowid = ${req.params.todoId}`)
    .then(() => res.end('Donnée modifier'))
    .catch(err => console.log(err))
  }
})

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
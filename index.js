const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const db = require('sqlite')

let date = new Date()
let dd = date.getDate()
let mm = date.getMonth() + 1
let yyyy = date.getFullYear()
let strDate = `${dd}-${mm}-${yyyy}`

app.set('views', './views')
app.set('view engine', 'pug')

db.open('todolist.db').then(() => {
  console.log('Database Ready')
  return db.run('CREATE TABLE IF NOT EXISTS todos (message, completion, createdAt, updatedAt)')
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
  res.redirect('/todos')
})

app.get('/todos', (req, res) => {
  console.log('-> GET /todos')
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

app.get('/todos/:todoId', (req, res) => {
  console.log('-> GET /todos/:todoId (todoId : ' + req.params.todoId +')')
  console.log('Database Open')
  return db.get('SELECT * FROM todos WHERE rowid = ' + req.params.todoId)
  .then(response => {
    if(!(response === undefined || response === null)) {
      res.json(response)
    } else {
      res.end('Aucune ligne trouvé !')
    }
  }).catch(err => console.log(err))
})

app.post('/todos', (req, res) => {
  console.log('-> POST /todos')
  console.log('Database Open')
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null) {
    res.end('Envoie echouer')
  } else {
    return db.run(`INSERT into todos VALUES ('${req.body.message}', '${req.body.completion}', '${strDate}', '${strDate}')`)
    .then(() => res.end('Donnée écrite'))
    .catch(err => console.log(err))
  }
})

app.delete('/todos/:todoId', (req, res) => {
  console.log('-> DELETE /todos/:todoId (todoId : ' + req.params.todoId +')')
  console.log('Database open')
  return db.run('DELETE FROM todos WHERE rowid = ' + req.params.todoId)
  .then(() => res.end('Donnée effacer'))
  .catch(err => console.log(err))
})

app.put('/todos/:todoId', (req, res) => {
  console.log('-> PUT /todos/:todoId (todoId : ' + req.params.todoId +')')
  console.log('Database open')
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null) {
    res.end('Modification echouer')
  } else {
    return db.run(`UPDATE todos SET message = '${req.body.message}', completion = '${req.body.completion}', updatedAt = '${strDate}' WHERE rowid = ${req.params.todoId}`)
    .then(() => res.end('Donnée modifier'))
    .catch(err => console.log(err))
  }
})

app.use((req, res) => {
 res.status(404)
 res.end('Not Found')
})

/* route GET /todos => res.json() (SELECT tous les todoslist dans la base de données)
db.all(une requete SQL) => SELECT *
db.get(une requete SQL) => 1 truc
db.run(une requete SQL) => pour changer les info dans la base

date.now() pour la date

route POST /todos => insert d'une todos liste */
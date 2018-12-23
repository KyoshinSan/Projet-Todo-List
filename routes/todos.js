const router = require('express').Router()
const db = require('sqlite')
const moment = require('moment')
let strDate = moment().format('DD[/]MM[/]YYYY')

router.get('/', (req, res) => {
  console.log('-> GET /todos')
  console.log('Database Open')
  let json = []
  return db.all('SELECT * FROM todos')
  .then(response => {
    json = response
  })
  .then(() => {
    let array_todos = []
    let array_tmp = []
    let i = 0

    json.forEach(function(element) {
      for (let key in element) {
        array_tmp.push(element[key])
      }
      array_todos.push(array_tmp)
      array_tmp = []
    })
    console.log(array_todos)
    res.format({
    'text/html': function() {
      res.render('./todos/index', {
        content: array_todos
      })
    },
    'application/json': function(){
      res.send(json)
    }
  })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

router.get('/add', (req, res) => {
  console.log('-> GET /todos/add')
  console.log('Database Open')
  res.render('./todos/add')
})

router.get('/:id/edit', (req, res) => {
  console.log('-> GET /todos/add')
  console.log('Database Open')
  res.render('./todos/edit', {id: req.params.id})
})

router.get('/:id', (req, res, next) => {
  console.log('-> GET /todos/:id (id : ' + req.params.id +')')
  console.log('Database Open')
  let json = []
  return db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id)
  .then(response => {
    if(!(response === undefined || response === null)) {
      json = response
    } else {
      next()
    }
  })
  .then(() => {
    res.format({
      'text/html': function() {
        res.render('./todos/show', {
          content: json,
          strId: 'Todo de l\'id : ' + req.params.id
        })
      },
      'application/json': function(){
        res.send(json)
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

router.post('/', (req, res) => {
  console.log('-> POST /todos')
  console.log('Database Open')
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null || req.body.userId === undefined || req.body.userId === null) {
    res.format({
        'text/html': function() {
          res.redirect('/users')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
  } else {
  return db.run(`INSERT into todos VALUES ('${req.body.message}', '${req.body.completion}', '${strDate}', '${strDate}', '${req.body.userId}')`)
  .then(() => {
    res.format({
      'text/html': function() {
        res.redirect('/todos')
      },
      'application/json': function(){
        res.send({message: 'success'})
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
  }
})

router.delete('/:id', (req, res) => {
  console.log('-> DELETE /todos/:id (id : ' + req.params.id +')')
  console.log('Database open')
  Promise.all([
    db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id),
    db.run('DELETE FROM todos WHERE rowid = ' + req.params.id)
  ])
  .then((response) => {
    if (response[0] === undefined || response[0] === null) {
      res.format({
        'text/html': function() {
          res.redirect('/todos')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
    } else {
      res.format({
        'text/html': function() {
          res.redirect('/todos')
        },
        'application/json': function(){
          res.send({message: 'success'})
        }
      })
    }
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

router.put('/:id', (req, res) => {
  console.log('-> PUT /todos/:id (id : ' + req.params.id +')')
  console.log('Database open')
  // verif req.body.message.length
  if(req.body.message === undefined || req.body.message === null || req.body.completion === undefined || req.body.completion === null || req.body.userId === undefined || req.body.userId === null) {
    res.format({
        'text/html': function() {
          res.redirect('/users')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
  } else {
    Promise.all([
    db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id),
    db.run(`UPDATE todos SET message = '${req.body.message}', completion = '${req.body.completion}', updatedAt = '${strDate}' WHERE rowid = ${req.params.id}`)
  ]).then((response) => {
  if (response[0] === undefined || response[0] === null) {
    res.format({
        'text/html': function() {
          res.redirect('/todos')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
  } else {
    res.format({
      'text/html': function() {
        res.redirect('/todos')
      },
      'application/json': function(){
        res.send({message: 'success'})
      }
    })
  }
  }).catch((err) => {
      return res.status(404).send(err)
    })
  }
})

module.exports = router
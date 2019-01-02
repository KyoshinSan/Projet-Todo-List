const router = require('express').Router()
const db = require('sqlite')
const moment = require('moment')
let strDate = moment().format('DD[/]MM[/]YYYY')

router.get('/', (req, res) => {
  let json = []
  return db.all('SELECT * FROM todos')
  .then(response => {
    json = response
  })
  .then(() => {
    //la variable array_todos permet de stocker les éléments du json pour le envoyer sur pug sous forme d'un tableau a 2 dimension pour exploiter les données plus facilement
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
  res.render('./todos/add')
})

router.get('/:id/edit', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  res.render('./todos/edit', {id: req.params.id})
})

router.get('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  let json = []
  return db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id)
  //on vérifie si la todos existe
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
  //on vérifie si les variables existent/sont remplies
  if(req.body.message === undefined || req.body.message === null || req.body.message.length < 1 || req.body.completion === undefined || req.body.completion === null || req.body.completion.length < 1 || req.body.userId === undefined || req.body.userId === null || req.body.userId.length < 1) {
    res.format({
        'text/html': function() {
          res.redirect('/todos')
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

router.delete('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  Promise.all([
    db.get('SELECT * FROM todos WHERE rowid = ' + req.params.id),
    db.run('DELETE FROM todos WHERE rowid = ' + req.params.id)
  ])
  // on vérifie si la todos existe
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

router.put('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  if(req.body.message === undefined || req.body.message === null || req.body.message.length < 1 || req.body.completion === undefined || req.body.completion === null || req.body.completion.length < 1) {
    res.format({
        'text/html': function() {
          res.redirect('/todos')
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
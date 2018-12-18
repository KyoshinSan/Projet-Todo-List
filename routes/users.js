const router = require('express').Router()
const db = require('sqlite')
const moment = require('moment')
let strDate = moment().format('DD[/]MM[/]YYYY')

router.get('/', (req, res) => {
  console.log('-> GET /users')
  console.log('Database Open')
  let json = []
  return db.all('SELECT * FROM users')
  .then(response => {
    json = response
  })
  .then(() => {
    let array_users = []
    let array_tmp = []
    let i = 0

    json.forEach(function(element) {
      for (let key in element) {
        array_tmp.push(element[key])
      }
      array_users.push(array_tmp)
      array_tmp = []
    })
    console.log(array_users)
    res.format({
    'text/html': function() {
      res.render('./users/index', {
        content: array_users
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
  console.log('-> GET /users/add')
  console.log('Database Open')
  res.render('./users/add')
})

router.get('/:id/edit', (req, res) => {
  console.log('-> GET /users/add')
  console.log('Database Open')
  res.render('./users/')
})

router.get('/:id', (req, res, next) => {
  console.log('-> GET /users/:id (id : ' + req.params.id +')')
  console.log('Database Open')
  let json = []
  return db.get('SELECT * FROM users WHERE rowid = ' + req.params.id)
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
        res.render('./users/show', {
          content: json,
          strId: 'Users de l\'id : ' + req.params.id
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
  console.log('-> POST /users')
  console.log('Database Open')
  return db.run(`INSERT into users VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.username}', '${req.body.password}', '${req.body.email}', '${strDate}', '${strDate}')`)
  .then(() => {
    res.format({
      'text/html': function() {
        res.redirect('/users')
      },
      'application/json': function(){
        res.send({message: 'success'})
      }
    })
  })
  .catch((err) => {
    return res.status(404).send(err)
  })
})

router.delete('/:id', (req, res) => {
  console.log('-> DELETE /users/:id (id : ' + req.params.id +')')
  console.log('Database open')
  Promise.all([
    db.get('SELECT * FROM users WHERE rowid = ' + req.params.id),
    db.run('DELETE FROM users WHERE rowid = ' + req.params.id)
  ])
  .then((response) => {
    if (response[0] === undefined || response[0] === null) {
      res.format({
        'text/html': function() {
          res.redirect('/users')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
    } else {
      res.format({
        'text/html': function() {
          res.redirect('/users')
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
  console.log('-> PUT /users/:id (id : ' + req.params.id +')')
  console.log('Database open')
  // verif req.body.message.length
  if(req.body.firstname === undefined || req.body.firstname === null || req.body.lastname === undefined || req.body.lastname === null || req.body.username === undefined || req.body.username === null || 
  req.body.password === undefined || req.body.password === null || req.body.email === undefined || req.body.email === null) {
    res.end('Modification echouer')
  } else {
    Promise.all([
    db.get('SELECT * FROM users WHERE rowid = ' + req.params.id),
    db.run(`UPDATE users SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', username = '${req.body.username}', password = '${req.body.password}', email = '${req.body.email}', updatedAt = '${strDate}' WHERE rowid = ${req.params.id}`)
  ]).then((response) => {
  if (response[0] === undefined || response[0] === null) {
    res.format({
        'text/html': function() {
          res.redirect('/users')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })
  } else {
    res.format({
      'text/html': function() {
        res.redirect('/users')
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

router.get('/:id/todos', (req, res, next) => {
  console.log('-> GET /users/:id/todos (id : ' + req.params.id +')')
  console.log('Database Open')
  let json = []
  return db.get('SELECT * FROM todos WHERE userId = ' + req.params.id)
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
        res.render('./users/showtodos', {
          content: json,
          strId: 'Users de l\'id : ' + req.params.id
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


module.exports = router
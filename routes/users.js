const router = require('express').Router()
const db = require('sqlite')
const moment = require('moment')
const bcrypt = require('bcrypt')
const saltRounds = 10
let strDate = moment().format('DD[/]MM[/]YYYY')

router.get('/', (req, res) => {
  let json = []
  return db.all('SELECT * FROM users')
  .then(response => {
    json = response
  })
  .then(() => {
    //la variable array_todos permet de stocker les éléments du json pour le envoyer sur pug sous forme d'un tableau a 2 dimension pour exploiter les données plus facilement
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
  res.render('./users/add')
})

router.get('/:id/edit', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  res.render('./users/edit', {id: req.params.id})
})

router.get('/:id/todos', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  let json = []
  Promise.all([
    db.get(`SELECT userId FROM todos WHERE userId = '${req.params.id}'`),
    db.all(`SELECT * FROM todos WHERE userId = '${req.params.id}'`)
  ])
  //on vérifie si l'userId existe
  .then(response => {
    console.log(response)
    if(!(response[0] === undefined || response[0] === null)) {
        json = response[1]
      } else {
        next()
      }
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
        res.render('./users/showtodos', {
          content: array_todos,
          id: req.params.id
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

router.get('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
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
  // on vérifie si l'id est bien un nombre
  let password_hashed = bcrypt.hashSync(req.body.password, saltRounds)
  if(req.body.firstname === undefined || req.body.firstname === null || req.body.firstname.length < 1 || req.body.lastname === undefined || req.body.lastname === null || req.body.lastname.length < 1 || req.body.username === undefined || req.body.username === null || req.body.username.length < 1 || 
  req.body.password === undefined || req.body.password === null || req.body.password.length < 1 || req.body.email === undefined || req.body.email === null || req.body.email.length < 1 ) {
    res.format({
        'text/html': function() {
          res.redirect('/users')
        },
        'application/json': function(){
          res.send({message: 'failed'})
        }
      })   
	} else { 
  return db.run(`INSERT into users VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.username}', '${password_hashed}', '${req.body.email}', '${strDate}', '${strDate}')`)
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
  }
})

router.delete('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
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

router.put('/:id', (req, res, next) => {
  // on vérifie si l'id est bien un nombre
  if (isNaN(Number(req.params.id))) {
    next()
  }
  let password_hashed = bcrypt.hashSync(req.body.password, saltRounds)
  //on vérifie si les variables existent/sont remplies
  if(req.body.firstname === undefined || req.body.firstname === null || req.body.firstname.length < 1 || req.body.lastname === undefined || req.body.lastname === null || req.body.lastname.length < 1 || req.body.username === undefined || req.body.username === null || req.body.username.length < 1 || 
  req.body.password === undefined || req.body.password === null || req.body.password.length < 1 || req.body.email === undefined || req.body.email === null || req.body.email.length < 1 ) {
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
    db.get('SELECT * FROM users WHERE rowid = ' + req.params.id),
    db.run(`UPDATE users SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}', username = '${req.body.username}', password = '${password_hashed}', email = '${req.body.email}', updatedAt = '${strDate}' WHERE rowid = ${req.params.id}`)
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


module.exports = router
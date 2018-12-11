// const bcrypt = require('bcrypt')
// const saltRounds = 10

// bcrypt.hash('azertyhgbjrstbgfbh rstbhfbjkdb', saltRounds, function(err, hash) {
  // console.log(hash)
// })

let json = [
    {
        "message": "Faire le Node",
        "completion": "En cours",
        "createdAt": "12/11/2018",
        "updatedAt": "12/11/2018",
        "userId": "1"
    },
    {
        "message": "Faire l UX Design",
        "completion": "Pas commencé",
        "createdAt": "12/11/2018",
        "updatedAt": "12/11/2018",
        "userId": "1"
    }
]

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

// while (i < 3) {
  // array_todos.push( ["Faire le Node","En cours","12/11/2018","12/11/2018","1"] )
  // i++
// }

console.log(array_todos)
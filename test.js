const bcrypt = require('bcrypt')
const saltRounds = 10

bcrypt.hash('azertyhgbjrstbgfbh rstbhfbjkdb', saltRounds, function(err, hash) {
  console.log(hash)
})
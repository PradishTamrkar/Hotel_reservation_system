const bcrypt = require ('bcrypt')

const saltRounds = 10

const hashedPass = async(password) => {
    return await bcrypt.hash(password, saltRounds);
}
 module.exports = hashedPass
const bcrypt = require ('bcrypt')

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)

const hashedPass = async(password) => {
    return await bcrypt.hash(password, saltRounds);
}

const compPass = async(password, hashedPass) => {
    return await bcrypt.compare(password, hashedPass)
}

exports.hashedPass = hashedPass
exports.compPass = compPass
const username = "multibrandwnpowe_multibrand_adm"
const password = "multibrandcomex"
const database = "multibrandwnpowe_db"

module.exports = 
{
  "development": {
    "username": username,
    "password": password,
    "database": database,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": username,
    "password": password,
    "database": database,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": username,
    "password": password,
    "database": database,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
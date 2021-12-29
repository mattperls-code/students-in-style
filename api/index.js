/* 
*  Very fucking hacky, but it works.
*  Written in 2 days.
*  Will refactor later. (I'm not sure if it's worth it)
*/

const express = require("express")
const morgan = require("morgan")
const fs = require("fs")
const cors = require("cors")
const bcrypt = require("bcrypt")
require('dotenv').config()


const { signup } = require("./middleware/signup")



const app = express()

const secretCode = process.env['SECRET_CODE']

app.use(morgan())
app.use(express.json())
app.use(cors())


app.post("/img", (req, res) => {
  const { imgUrl, username, hashedPassword } = req.body

  try {
    const users = require("./users.json")

    const target = users.find((user) => user.username === username)

    if (target.username === username) {

      if (target.password === hashedPassword) {
        const data = require("./logos.json")
        data.push(imgUrl)

        fs.writeFileSync("./logos.json", JSON.stringify(data))



        return res.status(200).json({
          success: true
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Invalid password"
        })
      }


    } else {
      return res.status(200).json({
        success: false,
        message: `User with username "${username}" does not exist`,
        debug: `${target}, ${username}`
      })
    }
  } catch (e) {
    return res.status(200).json({
      success: false,
      message: e
    })
  }
})

app.get("/", (_, res) => {
  const data = require("./logos.json")
  console.log(data)
  return res.status(200).json({
    data: data[data.length - 1]
  })
})

app.get("/all", (_, res) => {
  const data = require("./logos.json")
  return res.status(200).json({
    data: data
  })
})

app.post("/auth/create/:secret", signup, async (req, res) => {

  if (req.params.secret != secretCode) {
    return res.status(400).json({
      success: false,
      message: "Nice try"
    })
  }
  const { username, password } = req.body

  try {
    const users = require("./users.json")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(password)

    const user = {
      username: username,
      password: hashedPassword
    }


    users.push(user)
    fs.writeFileSync("./users.json", JSON.stringify(users))

    return res.status(200).json({
      success: true,
      user: user,
    })
  } catch (e) {
    return res.status(400).json({
      err: e
    })
  }
})

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body

  try {
    const users = require("./users.json")

    const target = users.find((user) => user.username === username)

    if (target.username === username) {
      bcrypt.compare(password, target.password, (err, result) => {
        return res.status(200).json({
          success: true,
          result: result,
          user: target
        })

      })
    } else {
      return res.status(200).json({
        success: false,
        message: `User with username "${username}" does not exist`,
        debug: `${target}, ${username}`
      })

    }


  } catch (e) {
    return res.status(400).json({
      err: e
    })
  }
})

app.post("/auth/validate", (req, res) => {
  const { username, hashedPassword } = req.body

  try {
    const users = require("./users.json")

    const target = users.find((user) => user.username === username)


    if (target.username === username) {
      if (target.password === hashedPassword) {
        return res.status(200).json({
          success: true,
          result: true
        })
      }
    } else {
      return res.status(200).json({
        success: true,
        result: false
      })
    }


  } catch (e) {
    return res.status(400).json({
      err: e
    })
  }
})


app.get("/auth/users/:secret", (req, res) => {

  if (req.params.secret != secretCode) {
    return res.status(400).json({
      success: false,
      message: "Nice try"
    })
  }
  return res.status(200).json({
    success: true,
    users: require("./users.json")
  })
})


app.post("/fill", (_, res) => {
  fs.writeFileSync("logos.json", "[]")
  fs.writeFileSync("users.json", "[]")
  res.status(200).json({
    success: true,
    logos: require("./logos.json"),
    users: require("./users.json")
})


})


app.listen(process.env.PORT || 8080, () => console.log("started"))
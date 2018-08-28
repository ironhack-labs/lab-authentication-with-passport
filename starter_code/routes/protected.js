const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')

router.use(ensureLogin.ensureLoggedIn('/auth/sign-in'))

router.get('/', (req, res, next) => {
    console.log(req.user)
    res.send("Here's your answer: 42")
})

router.get('/other-secret', (req, res, next) => {
    res.send("Here's your answer: 43")
})

module.exports = router

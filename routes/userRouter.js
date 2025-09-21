const express = require('express')
const { signUp, deleteUser, getAll, updateUser, getOneUser } = require('../controllers/userControllers')
const upload  = require('../middleware/multer')
const router = require('express').Router()

const signUpfield = upload.fields([
    {name: 'profilePicture', maxCount: 1},
    {name: 'gallery', maxCount: 8},
])

router.post('/user',signUpfield,signUp)
router.get('/user',getAll)
router.get('/user/:id',getOneUser)
router.delete('/user/:id',deleteUser)
router.put('/user/:id', signUpfield,updateUser)

module.exports = router
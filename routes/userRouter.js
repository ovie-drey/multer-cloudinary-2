const { signUp, deleteUser, getAll, updateUser, getOneUser } = require('../controllers/userControllers')
const upload  = require('../middleware/multer')
const router = require('express').Router()

router.post('/user',upload.single('image'),signUp)
router.get('/user',getAll)
router.get('/user/:id',getOneUser)
router.delete('/user/:id',deleteUser)
router.put('/user/:id',upload.single('image'),updateUser)

module.exports = router
const express = require("express");
const {getUsers, getUserById, postUser, deleteUser, updateUser, loginUser } = require('..controllers/usercontroller.js');
const usercontroller = require("../controllers/usercontroller.js")

const router = express.Router();

//get all users
router.get('/', getUsers);
//register new user
router.post('/register', postUser);
//user lgin password === password: email found!!
router.post('/login', logignUser);
//get user by specific id
router.get('/:id', getUserById);
//get user by id nd delete account
router.delete("/:id", deleteUser);
//edit user details 
router.put('/:id', updateUser);

module.exports = router;
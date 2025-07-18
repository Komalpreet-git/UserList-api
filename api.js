'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://Komalpreet:Preet1972@cluster0.pbgp5g1.mongodb.net/UserList',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');

    app.listen(port, () =>{
        console.log('User API server is running on port ' + port);
    });
})
.catch((error) =>{
    console.error('Error connecting to MongoDB: ', error)
})

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    id: {type: Number, unique: true, required: true},
    email: {type: String, required: true},
    username: {type: String}
});

const Users = mongoose.model("Users", UsersSchema);

const router = express.Router();

app.use('/api/users', router);
router.route("/")
    .get((req,res) => {
        console.log("Fetching the information");
        Users.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(400).json("Error: "+ err));
    });

router.route("/user/:id")
    .get((req,res)=> {
        const userId = Number(req.params.id);
        Users.find({id: userId})
            .then((users) => res.json(users))
            .catch((err) => res.status(400).json("Error: "+ err));
    });

router.route("/newuser")
    .post((req,res) => {

        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;

        const newUsers = new Users({
            id,
            email,
            username
        });

        newUsers
           .save()
           .then(() => res.json("Users are added!"))
           .catch((err) => res.status(400).json("Error: " + err));
    });

    router.route("/modify/:id")
          .put((req,res) => {
            Users.findOne({id: Number(req.params.id)})
               .then((users) => {
                   users.id = req.body.id;
                   users.email = req.body.email;
                   users.username = req.body.username;

                   users 
                      .save()
                      .then(() => res.json("User is modified"))
               })
               .catch((err) => res.status(400).json("Error: "+ err))
          });
    router.route("/delete/:id")
          .delete((req,res) => {
            Users.findOneAndDelete({id: Number(req.params.id)})
                .then(() =>  res.json("User is deleted"))
                .catch((err) => res.status(400).json("Error: "+ err));
          });
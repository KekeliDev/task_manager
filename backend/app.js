const express = require('express');
const app = express();
const { mongoose } = require('./db/mangoose');
const bodyParser = require('body-parser');


// load in mongoose models

const { List, Task, User } = require('./db/models/index');

const jwt = require('jsonwebtoken');

// load middleware from body parser
app.use(bodyParser.json());


// request headers for cors

// website : https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,  x-access-token, x-refresh-token, _id");
    
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );


    
    next();
  });




// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });

}


// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}




// Routes Handlers

// list

app.get('/lists', (req, res) => {
    // we want to get array of all the list in the database that belongs to the authenticated user
    List.find({
        _userId: req.user_id
    }).then((lists)=>{
        res.send(lists);
    }).catch((e) =>{
        res.send(e);
    });
})
app.get('/all-lists', authenticate, (req, res) => {
    // we want to get array of all the list in the database that belongs to the authenticated user
    List.find({
        _userId: req.user_id
    }).then((lists)=>{
        res.send(lists);
    }).catch((e) =>{
        res.send(e);
    });
})

app.post('/lists', authenticate, (req, res) => {
    // we want to create a new list and return new list 
    // install body parser (npm install body-parser --save)
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });

    newList.save().then((listDoc) => {
        // before list doc is returned
        res.send(listDoc);
    })
})

app.patch('/lists/:id', authenticate, (req, res) => {
    // update
    List.findByIdAndUpdate({_id: req.params.id, _userId: req.user_id},
        {
            $set: req.body
        }
        ).then(() => {
        res.send({'message': 'upated list'});
    });

});
app.delete('/lists/:id', authenticate, (req, res) => {
    // delete
    List.findOneAndRemove(
        {
            _id: req.params.id,
            _userId: req.user_id
        }
        )
        .then((removedListDoc) => {
        res.send(removedListDoc);

        // delete all the task that in the list
        deleteTaskFromList(removedListDoc._id)
    })

});

//  tasks
app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

app.post('/lists/:listId/tasks', authenticate,(req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if(list) {
            // user object is valid
            // therefore current authenticated user create objects
            return true;
        }

        // user object undefined
        return false;
    }).then((canCreateTask) =>{
        if(canCreateTask) {

            let newtask = new Task({
                _listId: req.params.listId,
                title: req.body.title
                
            });
            newtask.save().then((newTaskDoc) =>{
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })

   
})

app.patch('/lists/:listId/tasks/:taskId', authenticate,(req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) =>{
        if(list) {

            // now can update task
            return true;
        }

        return false;
    }).then((canUpdateTasks) => {
        if(canUpdateTasks) {
            // current authenticated user can the task
            
            Task.findByIdAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            },
            {
                $set:req.body
            }).then(() => {
                res.send({message: "Updated Successfully"});
            });
        } else {
            res.sendStatus(404)
        }
    })
   
});

app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) =>{
        if(list) {

            // now can update task
            return true;
        }

        return false;
    }).then((canDeleteTasks) => {
        if(canDeleteTasks) {

            Task.findByIdAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })

        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/lists/:listId/tasks/:taskId', (req, res) =>{
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});


/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
 app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: Login
 */
 app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})



// Helper methods
let deleteTaskFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() =>{
        console.log('Tasks deleted! ' + _listId );
    })
}

app.listen(3000, () => {
    console.log("server is being listened to at 3000");
})
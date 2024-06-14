const { app } = require('express');

const userController = {
  getUsers(req, res, next){
    const getQueryString = 'SELECT * FROM test;';
    User.query(getQueryString, (err, results) => {
      if (err) throw err;
      res.status(200).json(results.rows);
      console.log('called back from query inside of the controller ', results.rows);
    });
  },
  getUserById(req, res, next){
    const getQueryString = 'SELECT * FROM test WHERE id = $1;';
    const id = parseInt(req.params.id);

    User.query(getQueryString, [id], (err, results) => {
      if (err) throw err;
      return res.status(200).json(results.rows[0]);
    });
  },
  postUser(req, res, next){
    const checkUserExists = 'SELECT u FROM test u WHERE u.email = $1;';

    const getQueryString = 'INSERT INTO test (name, dob, email, password) VALUES ($1, $2, $3, $4);';
   
    const {name,dob,email,password} = req.body;
    
        console.log('name on kine 111', name);
        if (name.length < 1 || email.length < 1 || password.length < 1){
          console.log('please enter all fields');
          res.json({message:"fail"});
        }

    bcrypt.genSalt(parseInt(salt), (err, salt) => {
 
      bcrypt.hash(`${password}`, parseInt(salt), (err, hash) => {
        if (err) throw err;
        // console.log('hash', hash, 'password', password);
        const hashpw = hash;
        
        console.log('salt ', salt, hashpw);
        User.query(checkUserExists, [email], (err, results) => {
          if (results.rows.length){
            // res.send(res.rows.length);
            // res.send("Looks like you already have an account");
            console.log("Looks like you already have an account");
            res.json({message: "fail"});
          }
          
          
          User.query(getQueryString, [name,dob,email,hashpw], (err, results) => {
            
            if (err) throw err;
            // res.status(201).send("User registration success");
            console.log('User registratiton success');
            res.json({message: "success"});
            
          });
        });
        
      });


    })

},
deleteUser(req, res, next){
  const deleteStr = 'DELETE FROM test WHERE id = $1 RETURNING *;';
  const getQueryString = 'SELECT * FROM test WHERE id = $1;';
  const id = parseInt(req.params.id);
  User.query(getQueryString, [id], (err, results) => {
    const userNotFound = !results.rows.length;
    if (userNotFound){
      res.send("User could not be located in database");
    }

  User.query(deleteStr, [id], (err, results) => {
    if (err) throw err;
    res.status(200).send("User successfully deactivated account");
  });    
  });
},
updateUser(req, res, next){
  const getQueryString = 'SELECT * FROM test WHERE id = $1;';
  const id = parseInt(req.params.id);
  const {name} = req.body;
  
  User.query(getQueryString, [id], (err, results) => {
    const userNotFound = !results.rows.length;
    if (userNotFound){
      res.send("User profile changes cannot be made because user does not exist");
    };
    
    const updateStr = 'UPDATE test SET name = $1 WHERE id = $2;';
    //set the variable we pass in to the id that we pass in, we have to specify the row 
  User.query(updateStr, [name, id], (err, results) => {
      if (err) throw err;
      res.status(200).send("Changes to profile made successfully");
    });
  });

},
loginUser(req, res, next){
  const getQueryString = 'SELECT * FROM test WHERE email = $1;';
  const {email, password} = req.body;
  
  // console.log('request body password ', password);
  console.log('button click tapped the server. we are in the controller now');
  //get user by Email

  User.query(getQueryString, [email], async(err, results) => {
    const userNotFound = !results.rows.length;
    // console.log('logging results from login query in controller ', results.rows);
    if (userNotFound){
      // console.log('Please verify email/password combination');
      // return res.redirect('/');
      res.send(JSON.stringify("Account not found. Please verify email/password combination"));
    } else{
      // let resHash = await bcrypt.hash(results.rows[0].password, 10);
      console.log('password extracted ', password, 'results row ',results.rows[0].password);
      // console.log('password extracted ', password, 'results row ',resHash);

      // console.log('password extracted', password)

      //if user is found, check the password they put in;
      // console.log('objPass ', typeof results.rows[0].password, results.rows[0].password);
      await bcrypt.compare(password, results.rows[0].password, (err, bool) =>{
              console.log('bool', typeof bool, bool);
              if(bool === true){
                // console.log(JSON.stringify(results.rows[0]));
                console.log("hello from bcrypt success");
                
                
                // res.status(200).send(JSON.stringify(results.rows[0],{success: true}));
                // res.status(200).send(`this is bool ${bool}`);

                // res.redirect('user/login');
                // res.send(bool);
                res.json({status: bool, username: results.rows[0].name});
                // res.json({status: bool, id: results.rows[0].id});

              } else {
                console.log('Please verify email/password combination 2');

                res.json({status: bool});
             '
              }
            });
          };

      if (err) throw err;
  
  });

}
}
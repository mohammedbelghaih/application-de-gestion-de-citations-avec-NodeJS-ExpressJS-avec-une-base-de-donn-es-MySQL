let express = require('express');
let http = require('http');
let mysql = require('mysql');
let app = express();
let bodyParser = require('body-parser');

/*
***parse All form data
*/

app.use(bodyParser.urlencoded({ extended: true }));


/*
*** this is a view engin
*** template parsing
*** we are using ejs types 
*/

app.set('view engine', 'ejs');



/*
*** Import all related javaScript an CSS files to inject in our App
*/

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

/*
*** DataBase is connection details
*** Localhost - When in production mode change this to your host
*** User - User name of the database
*** password - Database is the name of the DataBase
*/

const con =mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database :"1st db"
});

/*
***Global site title and base url
*/
const siteTitle = "myApp";
const baseURL = "http://localhost:3000";


/*
*** When page is loaded
*/
app.get('/', function (req, res){
    /*
     *** get the event list
     */
    con.query("SELECT * FROM user", function(err, result){
        res.render('index', {
            siteTitle : siteTitle,
            pageTitle : "Students list",
            items : result
        });
    });
});

app.get('/event/add', function (req, res){
    /*
     *** add
     */
        res.render('add.ejs', {
            siteTitle : siteTitle,
            pageTitle : "add new student",
            items : ''
        });
    });


app.post('/event/add', function (req, res){
    let query = "INSERT INTO `user` (nom,prenom) VALUES(";
        query += " '"+req.body.nom+"',";
        query += " '"+req.body.prenom+"')";
    con.query(query, function (err, result){
        res.redirect(baseURL);
    });
});




    /*
    *** Update
    */
// app.get('/event/edit/:id', function(req,res){
//     con.query("SELECT * FROM user WHERE id = '"+ req.params.id + "'", function(err,result){
//         result[0].nom=result[0].nom;
//         result[0].prenom=result[0].prenom;
//         res.render('edit',{
//             siteTitle : siteTitle,
//             pageTitle : "Editing in: " + result[0].nom,
//             item : result
//         })
//     })
// })

// app.post('/event/edit/:id',function(req,res){
//     let query = "UPDATE `user` SET";
//         query += "`nom` = '"+req.body.nom+"',";
//         query += "`prenom` = '"+req.body.prenom+"',";
//         query += "WHERE `user`.`id`="+req.body.id+"";
//     con.query(query, function(err, result){
//         if(result.affectedRows){
//             res.redirect(baseURL);
//         }
//     }); 
// });

app.get('/event/edit/:id',(req, res) => {

    
    let sql = "Select * from user where id ="+ req.params.id;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit', {
            siteTitle : siteTitle,
            pageTitle : "Editing in : " + result[0].e_name,
            item : result
        });
    });
});

app.post('/event/edit/:id',(req, res) => {

     
      let sql = "update user SET nom='"+req.body.nom+"', prenom='"+req.body.prenom+"'where id ="+req.body.id;
      let query = con.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect(baseURL);
      });
  });

/*
***Delete
*/

app.get('/event/delete/:id', function(req,res){

    con.query("DELETE FROM user WHERE id='"+req.params.id+"'", function(err,result){
        if(result.affectedRows){
            res.redirect(baseURL);
        }
    })
})

/*
*** Conetct to the server
*/

let server = app.listen(3000, function(){
    console.log('server started on 3000...');
});
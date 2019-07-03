
const http = require('http');
var MongoClient = require('mongodb').MongoClient;
const express = require('express');
var bodyParser = require('body-parser');
const multer =require('multer');

// const upload =multer({
//     dest:'uploads/'
// });

var app = express();
var insert_router = express.Router();       
var delete_router = express.Router();
var show_router = express.Router();

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');


});
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null,Date.now()+ '-'+file.originalname )
    }
});
const filefilter=(req,file,cb)=>{
    if(file.mimetype ==='image/jpeg'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}
var filesize= function(req,file,cb){
 if(file.size < 1024*1024){
     cb(null,true);
     req.send("file saved");
 }
 else{
     cb(null,false)
     req.send("file is too long")
    }
}
var upload = multer({storage: storage},
 {filefilter:filefilter},{filesize:filesize});

app.listen(3000, 'localhost', function (req, res) {
    console.log("Server is running at http://localhost:3000");
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use("/insert", insert_router);
app.use("/show", show_router);
app.use("/delete", delete_router);


// app.use(bodyParser.raw());

//////////////////////// INSERTION////////////////////////////

insert_router.get('/', function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/test", function (err, db) {

        dbo = db.db();

        console.log(dbo);

        dbo.collection('Persons', function (err, collection) {

            collection.insert({ id: 5, firstName: 'Nishant', lastName: 'Srivastava' });
            //collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
            //collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });

            dbo.collection('Persons').find().toArray(function (err, count) {
                if (err) throw err;

                console.log(count);
            });
        });

    });

    console.log(req)
    res.send("Record Inserted Successfully")
});

////////////////DELETION///////////////////////////////////
delete_router.get('/', function (req, res) {
    MongoClient.connect("mongodb://localhost:27017/test", function (err, db) {

        dbo = db.db();

        console.log(dbo);

        dbo.collection('Persons', function (err, collection) {


            collection.remove({ id: 1 }, function (err, result) {

                if (err) throw err;

                console.log('Document Removed Successfully');
            });

          


        });

    });
    res.send("Record Deleted Succesfully");
});


///////////////////////// VIEWING/////////////////////////////
show_router.post('/', upload.single('fileUpload'),function (req, res) {
    // var fileUpload=req.file;
    console.log(req.file);


    if(req.file.size > 1024 *1024){


       return res.send("file size does not match")
    }
   
    MongoClient.connect("mongodb://localhost:27017/test",{ useNewUrlParser: true }, function (err, db) {

        dbo = db.db();
        dbo.collection('Persons', function (err, collection) {

            dbo.collection('Persons').find().toArray(function (err, count) {
                if (err) throw err;
                res.send(JSON.stringify(count));
            });

        });
    });
   
});




/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  
  app.route('/api/books')
    //DONE
    .get(function (req, res){
      var title = req.query.title;
    

      //response will be array of book objects
     MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var dbo = db.db("librarybooks");
        
            dbo.collection("library").find({}).toArray(function(err, result) {
              if(result == null || result == "") {
                res.json({error: "no records found!"});
                db.close();
              }
              else {
                res.json(result);
                db.close();
              }
            });
     });
    
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    //DONE
    .post(function (req, res){
      var title = req.body.title;
      var _id = new ObjectId();
    
      //response will contain new book object including atleast _id and title
      var toBeAdded = {_id: _id, title: title, commentcount: 0};
      var toDisplay = {_id: _id, title: title};
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("librarybooks");
        
        dbo.collection("library").insertOne(toBeAdded, function(err, res) {
              if (err) throw err;
              db.close();
        });    
      });
    
      res.json(toDisplay);
    })
    
    //DONE
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("librarybooks");
        
        dbo.collection("library").deleteMany({}, function(err, obj) {
            if (err) throw err;
            db.close();
        });
        res.json({success: 'complete delete successful'});
      });
    });



  app.route('/api/books/:id')
    //DONE
    .get(function (req, res){
      var bookid = req.params.id;
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        var dbo = db.db("librarybooks");
        
            dbo.collection("library").findOne({_id: ObjectId(bookid)}, function(err, result) {
              if(result == null || result == "") {
                res.json({error: 'no book exists'});
              }
              else {
                dbo.collection("comments").find({bookId: bookid}).toArray(function(err, re) {
                  if(re == null || re == "") {
                    var comments = {};
                    res.json({_id: result._id, title: result.title, comments: comments});
                    db.close();
                  }
                  else {   
                    var comments = {};
                    for(var i=0; i<re.length; i++) {
                      comments[i] = re[i].comment; 
                    }
                    res.json({_id: result._id, title: result.title, comments: comments});
                    db.close();
                  }
                });
              }
            });
       });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    //DONE
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("librarybooks");
        
        dbo.collection("library").findOne({_id: ObjectId(bookid)}, function(err, result) {
              if(result == null || result == "") {
                res.json({error: 'no book exists'});
                db.close();
              }
              else {
                var toBeAdded = {title: result.title, comment: comment, bookId: bookid};
                dbo.collection("comments").insertOne(toBeAdded, function(err, resul) {
                  if (err) throw err;
                });
                
                dbo.collection("library").deleteOne({_id: ObjectId(bookid)}, function(err, obj) {
                  if (err) throw err;
                });
                
                var number = parseInt(result.commentcount);
                number++;
                
                var newBook = {_id: ObjectId(result._id), title: result.title, commentcount: number};
                dbo.collection("library").insertOne(newBook, function(err, r2) {
                  if (err) throw err;
                  
                });

                dbo.collection("comments").find({bookId: bookid}).toArray(function(err, re) {
                  if(re == null || re == "") {
                    var comments = {};
                    res.json({_id: result._id, title: result.title, comments: comments});
                  }
                  else {   
                    var comments = {};
                    for(var i=0; i<re.length; i++) {
                      comments[i] = re[i].comment; 
                    }
                    res.json({_id: result._id, title: result.title, comments: comments});
                  }
                });
                db.close();
              }
        });  
      });
    })
    
    //DONE
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          if (err) throw err;
            var dbo = db.db("librarybooks");
        
        dbo.collection("comments").deleteMany({_id: ObjectId(bookid)}, function(err, obj) {
           if (err) throw err;
        });
        
        dbo.collection("library").deleteOne({_id: ObjectId(bookid)}, function(err, obj) {
            if (err) {
              res.json({error: 'failed'});
            }
          else {
            res.json({success: 'delete successful'});
          }
        });
      });
    });
  
};

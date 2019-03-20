/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'testing'
        })
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.title, 'testing');
        done();
      });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: ''
        })
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.error, "please give a title");
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'error');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books')
        .send({
          _id: 'sds'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'error');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books')
        .send({
          _id: '5c91c6be510cbe23e03a46f0'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'comments');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          id: '5c91c6be510cbe23e03a46f0',
          comment: 'test'
        })
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body[0], 'title');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'comments');
        done();
      });
      
    });

  });
  })

});

'use strict';

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const app = require('express')();

const blockedPhrases = new RegExp(/porn|sexy/);  // No thank you.

var webshot = require('webshot');
const path = require('path');
const fs = require('fs');

app.get('/', function(req, res) {
  res.status(200).send('hello world')
});

app.get('/test', function (req, res, next) {

  const public_dir = __dirname + '/public';
  // get url to process
  // const url = 'https://www.instagram.com/_rotta_/';
  // const url = 'http://bbs.ruliweb.com/news/read/104869';
  // const url = 'http://gall.dcinside.com/board/view/?id=superidea&no=137814';
  const url = 'http://pann.nate.com/talk/341190139';

  console.log('gogo', url)
  screen(url)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(next);

  res.status(200).send('okok');
});


app.get('/gg', (req, res, next) => {
  console.log('Before');
  
  const url = 'https://www.instagram.com/_rotta_/';

  // REturn image  
  getData('google.jpg')
  .then(file => {
    const filePath = path.resolve(__dirname) + '/google.jpg';
    setTimeout(() => {
      fs.unlinkSync(filePath);
    }, 2000);

    return res.sendFile(filePath)
  })
  .catch(err => res.send(err.message))
});

function getData(fileName, type = 'utf8') {
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, type, (err, data) => {
        err ? reject(err) : resolve(data);
    });
  });
}

const screen = url => {
  var options = {
    streamType: 'jpg',
    renderDelay: 1000,
    screenSize: {
      width: 320
      , height: 480
    }
    , shotSize: {
      width: 320
      , height: 'all'
    }
    , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
  };

  return new Promise(function(resolve, reject) {
    webshot(url, 'google.jpg', options, function(err) {
      if (err) {
        reject(err);
      }

      // screenshot now saved to google.png 
      console.log('saved!!');
      resolve('saved');
    })
  });
  // return new Promise(function(resolve, reject) {
  //   resolve('saved');
  // });
}

exports.cors = functions.https.onRequest(app);
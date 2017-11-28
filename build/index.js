const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const fs = require('fs');
const PAGE_ROOT = "..";
const photog = require('../data/photog.json');
const event = require('../data/event.json');
const user = require('../data/user.json');
const subject = require('../data/subject.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, PAGE_ROOT));

ejs.delimiter = "&";

(function injectData (pathname){
  const fullPath = path.join(__dirname, PAGE_ROOT, pathname);
  fs.readdir(fullPath, (_, items) => {
    items.forEach((item) => {
      fs.stat(`${fullPath}/${item}`, (_, stat) => {
        const path = `${pathname}/${item}`;
        if (stat.isDirectory()) {
          switch(path){
            case "/":
            case "/parts":
            case "/customer":
            case "/photographer":
            injectData(path);
          }
        } else if (path.endsWith('.ejs')) {
          let realpath = path.substr(0, path.length - 4);
          var label = JSON.stringify(realpath);
          bodyData = {
            subject: subject[realpath],
            photog: photog,
            event: event,
            user: user
          };
          app.get(realpath, (req, res) => res.render(path.substr(1), bodyData));
          if (/index.ejs$/.test(item)) {
            app.get(pathname, (req, res) => res.render(path.substr(1), bodyData));
          }
        }
      });
    });
  });
})('');

// declare static directory
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3002);
console.log('Now the ejs app is un and running at http://localhost:3002/');

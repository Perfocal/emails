const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PAGE_ROOT = "..";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, PAGE_ROOT));

(function addListener (pathname) {
  const fullPath = path.join(__dirname, PAGE_ROOT, pathname);
  fs.readdir(fullPath, (_, items) => {
    items.forEach((item) => {
      fs.stat(`${fullPath}/${item}`, (_, stat) => {
        const path = `${pathname}/${item}`;
        if (stat.isDirectory()) {
          addListener(path);
        } else {
          const realpath = path.substr(0, path.length - 4);
          app.get(realpath, (req, res) => res.render(path.substr(1)));
          if (/index.ejs$/.test(item)) {
            app.get(pathname, (req, res) => res.render(path.substr(1)));
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

var express = require("express");
var app = express();
var path = require('path');
let rootPath = path.resolve(__dirname, '..');
let fileDir = '/views/';
module.exports = {
    goIndex(req, res) {
        return res.sendFile(rootPath + fileDir + 'index.html');
        res.end();
    },
    goBookChapter(req, res) {
        return res.sendFile(rootPath + fileDir + 'chapter.html');
        res.end();
    },
    goArticle(req, res) {
        return res.sendFile(rootPath + fileDir + 'article.html');
        res.end();
    },
}
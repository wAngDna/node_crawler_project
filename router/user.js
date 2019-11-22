const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const cheerio = require('cheerio');
const superagent = require('superagent');
const request = require('request');
const iconv = require('iconv-lite');
const async = require('async');
app.use(express.static(__dirname + '/public')); //静态资源
app.use(bodyParser.urlencoded({ extended: false })); //post请求设置
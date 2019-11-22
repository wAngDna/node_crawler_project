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
const updateViews = require('./router/updateViews');
const async = require('async');
app.use(express.static(__dirname + '/public')); //静态资源
app.use(bodyParser.urlencoded({ extended: false })); //post请求设置
let BaseURL = 'https://www.ddxs.cc';
let URL = 'https://www.ddxs.cc/kehuanxiaoshuo/';
let options = {
    method: 'get',
    encoding: null,
    url: URL,
};
let bookList = []; //小说列表
let bookChapter = []; //小说章节列表
let bookContent = []; //小说章节内容
//请求科幻小说列表
app.get("/", updateViews.goIndex);
app.get("/chapter", updateViews.goBookChapter);
app.get('/article', updateViews.goArticle);
//请求小说章节列表
app.get('/reqBookList', async(req, res, next) => {
    var timer = setInterval(() => {
        if (bookList != "") {
            res.send(bookList);
            clearInterval(timer)
        }
    }, 500);
});
//请求小说章节列表
app.post('/reqChapter', async(req, res, next) => {
    bookChapter = []
    let { bookname, url } = req.body;
    request.get({ url: url, encoding: null }, (err, res) => {
        if (err) {
            console.log(err);
            console.log('章节列表拉取失败');
        } else {
            console.log('开始获取抓取' + bookname + '内容:');
            bookChapter = getBooksChapter(res);
        }
    });
    var timer = setInterval(() => {
        if (bookChapter != "") {
            console.log(bookname + '章节抓取完成!')
            res.send(bookChapter)
            clearInterval(timer)
        }
    }, 500);
});
//请求章节内容
app.post('/reqContent', async(req, res) => {
        let { url } = req.body;
        request.get({ url: url, encoding: null }, (err, res) => {
            if (err) {
                console.log(err);
                console.log('文章内容抓取失败');
            } else {
                console.log('开始抓取文章内容');
                bookContent = getBookContent(res);
            }
        });
        var timer = setInterval(() => {
            if (bookContent != "") {
                console.log('内容抓取完成!')
                res.send(bookContent)
                clearInterval(timer)
            }
        }, 500);
    })
    //请求小说列表
request.get(options, async(err, res) => {
    if (err) {
        console.log(err);
        console.log('科幻小说排行榜列表获取失败');
    } else {
        console.log('开始获取小说列表');
        bookList = getBookList(res)
    }
});
//获取小说列表
let getBookList = (res) => {
    let bookList = []
    var body = iconv.decode(res.body, 'gb2312');
    var $ = cheerio.load(body, { decodeEntities: false });
    let rankingList = $('#newscontent .r li');
    rankingList.each(function() {
        var a = $(this);
        let data = {
            'bookurl': BaseURL + a.find('.s2 a').attr('href'),
            'bookname': a.find('.s2').text(),
            'bookauthor': a.find('.s5').text()
        }
        bookList.push(data)
    });
    if (bookList != "") {
        console.log('科幻小说列表获取成功')
        return bookList
    }
};
//获取小说章节列表
let getBooksChapter = (res) => {
    let booksChapter = {
        'bookmsg': '',
        'bookChapter': []
    };
    var body = iconv.decode(res.body, 'gb2312');
    var $ = cheerio.load(body, { decodeEntities: false });
    let bookname = $('#info>h1').text();
    let bookauthor = $('#info>p').eq(0).text();
    let booktype = $('#info>p').eq(1).text();
    let booknew = $('#info>p').eq(2).text();
    let booknewtime = $('#info>p').eq(3).text();
    let bookintr = $('#intro>p').text();
    let bookmsg = {
        'bookname': bookname,
        'bookauthor': bookauthor,
        'booktype': booktype,
        'booknew': booknew,
        'booknewtime': booknewtime,
        'bookintr': bookintr
    }
    booksChapter.bookmsg = bookmsg;
    let direcList = $('#list dd a');
    direcList.each(function(i, item) {
        let a = $(this);
        let url = BaseURL + a.attr('href');
        let data = {
            'index': i,
            'url': url,
            'title': a.text(),
        }
        booksChapter.bookChapter.push(data);
    });
    if (booksChapter != "") {
        return booksChapter;
    }
};
//获取章节内容
let getBookContent = (res) => {
    let bookContent = [];
    var body = iconv.decode(res.body, 'gb2312');
    var $ = cheerio.load(body, { decodeEntities: false });
    let title = $('.bookname>h1').text();
    let content = $('#content').html();
    let data = {
        'title': title,
        'content': content
    }
    bookContent.push(data);
    if (bookContent != "") {
        return bookContent;
    }
};
const server = app.listen(8080, function() {
    console.log("Server is Running");
});
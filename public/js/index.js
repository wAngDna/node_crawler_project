var indexVue = new Vue({
    el: '#vue',
    data: {
        bookList: '',
        bookChapter: '',
    },
    methods: {
        //请求小说列表
        reqBookList() {
            $.get('/reqBookList', (res) => {
                this.bookList = res;
            })
        },
        //获取小说信息
        getBookInner(bookname, url) {
            if (bookname && url) {
                this.reqBookChapter(bookname, url)
            } else {
                alert('书籍信息获取失败')
            }
        },
        //请求小说章节
        reqBookChapter(bookname, url) {
            $.post('/reqChapter', {
                bookname: bookname,
                url: url
            }, (res) => {
                this.bookChapter = res;
                var timer = setInterval(() => {
                    if (this.bookChapter) {
                        sessionStorage.setItem('chapter', JSON.stringify(this.bookChapter));
                        location.href = '/chapter';
                        clearInterval(timer)
                    }
                }, 500)
            })
        },
        //获取章节信息
        getArticleInner(url) {
            if (url) {
                this.reqBookContent(url)
            } else {
                alert('文章信息获取失败')
            }
        },
        reqBookContent(url) {
            $.post('/reqContent', { url: url }, (res) => {
                console.log(res)
            })
        }
    },
    created() {
        this.reqBookList()
    },
})
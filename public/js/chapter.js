var chapterVue = new Vue({
    el: '#chapterVue',
    data: {
        bookChapter: '',
    },
    methods: {
        getChapterInner() {
            if (sessionStorage.getItem('chapter')) {
                this.bookChapter = JSON.parse(sessionStorage.getItem('chapter'))
            } else {
                alert('信息获取错误')
                location.href = '/';
            }
        },
        //获取点击文章信息及文章信息列表
        getArticleInner(index) {
            var articleUrlList = this.getArticleUrlList();
            if (articleUrlList != "") {
                var articleInner = {
                    'index': index,
                    'articleUrlList': articleUrlList
                }
                sessionStorage.setItem('article', JSON.stringify(articleInner));
                window.open('/article');
            } else {
                alert('网络开小差了~');
                return;
            }
        },
        //获取文章列表Url
        getArticleUrlList() {
            var articleUrlList = []
            for (item of this.bookChapter.bookChapter) {
                articleUrlList.push(item.url)
            }
            return articleUrlList;
        },
    },
    created() {
        this.getChapterInner()
    },
})
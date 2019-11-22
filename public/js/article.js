var articleVue = new Vue({
    el: '#articleVue',
    data: {
        articleUrlList: '',
        index: '',
        articleContent: ''
    },
    methods: {
        getArticleInner() {
            if (sessionStorage.getItem('article')) {
                var list = JSON.parse(sessionStorage.getItem('article'));
                this.index = list.index;
                this.articleUrlList = list.articleUrlList;
                this.reqArticleContent()
            }
        },
        reqArticleContent() {
            $.post('/reqContent', {
                url: this.articleUrlList[this.index],
            }, (res) => {
                this.articleContent = res[0];
                console.log(this.articleContent)
            })
        },
        frontArticle() {
            if (this.index == 0) {
                alert('前面没有更多了~');
                return
            }
            this.index--;
            this.reqArticleContent();
        },
        nextArticle() {
            if (this.index == this.articleUrlList.length - 1) {
                alert('前面没有更多了~');
                return
            }
            this.index++;
            this.reqArticleContent();
        },

    },
    created() {
        this.getArticleInner();
    },
})
const container = document.querySelector('#grid-container')

let n = 0;

function getId() {
    n++
    return n
}

const urlConstructor = () => {

    const keyword = () => {
        const search = document.querySelector('#keyword').value
        switch (search) {
            case '': return 'JavaScript'
            default: return search
        }
    }

    const language = () => {
        const lang = document.querySelector('#lang').value
        switch (lang) {
            case 'de': return 'de'
            case 'en': return 'en'
            case 'pt': return 'pt'
            case 'ru': return 'ru'
            case 'it': return 'it'
        }
    }

    const apiKey = '44a6a73f818d4cd584e9f5db383a017f'
    const url = new URL('http://newsapi.org/v2/everything')
    const urlParams = new URLSearchParams()
    urlParams.append('q', keyword())
    urlParams.append('language', language())
    urlParams.append('pageSize', '30')
    urlParams.append('apiKey', apiKey)
    url.search = urlParams.toString()
    return url
}

function fetchData() {

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }

    fetch(urlConstructor())
        .then(resp => resp.json())
        .then((data) => {
            data.articles.forEach(articles => {
                const article = {
                    'imgSrc': articles.urlToImage,
                    'title': articles.title,
                    'publisher': articles.source.name,
                    'text': articles.content,
                    'publishedAt': articles.publishedAt,
                    'manipulatedDate': () => {
                        let date = new Date(articles.publishedAt).toLocaleDateString()
                        return date
                    }
                }

                const articleDOM = {
                    'imageConstructor': () => {
                        const articleElementImage = document.createElement('img')
                        articleElementImage.src = article.imgSrc
                        return articleElementImage
                    },

                    'headingConstructor': () => {
                        const articleElementHeading = document.createElement('h2')
                        articleElementHeading.innerHTML = `${article.title} - ${article.publisher}`
                        return articleElementHeading
                    },

                    'textConstructor': () => {
                        const articleElementText = document.createElement('p')
                        articleElementText.innerText = article.text
                        return articleElementText
                    },

                    'dateConstructor': () => {
                        const articleElementDate = document.createElement('p')
                        articleElementDate.innerHTML = article.manipulatedDate()
                        return articleElementDate
                    },

                    'buttonConstructor': () => {
                        const articleElementButton = document.createElement('a')
                        articleElementButton.innerText = 'Read more'
                        articleElementButton.setAttribute('class', 'button-50')
                        articleElementButton.setAttribute('href', article.url)
                        return articleElementButton
                    },

                    'containerConstructor': () => {
                        const articleContainer = document.createElement('article')
                        articleContainer.setAttribute('id', 'article_' + getId())
                        articleContainer.setAttribute('class', 'article')
                        articleContainer.appendChild(articleDOM.imageConstructor())
                        articleContainer.appendChild(articleDOM.headingConstructor())
                        articleContainer.appendChild(articleDOM.textConstructor())
                        articleContainer.appendChild(articleDOM.dateConstructor())
                        articleContainer.appendChild(articleDOM.buttonConstructor())
                        return articleContainer
                    }
                }
                container.appendChild(articleDOM.containerConstructor())
            })
        })
}

document.querySelector('#submit').addEventListener('click', fetchData, false)

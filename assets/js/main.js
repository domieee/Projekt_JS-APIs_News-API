const container = document.querySelector('#grid-container')

let n = 0;

function getId() {
    n++
    return n
}

function urlConstructor() {
    const keyword = () => {
        const search = document.querySelector('#keyword').value
        switch (search) {
            case '': return 'programming'
            default: return search
        }
    }
    let language = () => {
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
    console.log(url.toString());
    return url
}

function fetchData() {

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }

    fetch(urlConstructor())
        .then(resp => resp.json())
        .then((data) => {
            console.log(data);
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
                    'image': () => {
                        const articleElementImage = document.createElement('img')
                        articleElementImage.src = article.imgSrc
                        return articleElementImage
                    },
                    'heading': () => {
                        const articleElementHeading = document.createElement('h2')
                        articleElementHeading.innerHTML = `${article.title} - ${article.publisher}`
                        return articleElementHeading
                    },
                    'text': () => {
                        const articleElementText = document.createElement('p')
                        articleElementText.innerText = article.text
                        return articleElementText
                    },
                    'date': () => {
                        const articleElementDate = document.createElement('p')
                        articleElementDate.innerHTML = article.manipulatedDate()
                        return articleElementDate
                    },
                    'button': () => {
                        const articleElementButton = document.createElement('a')
                        articleElementButton.innerText = 'Read more'
                        articleElementButton.setAttribute('class', 'button-50')
                        articleElementButton.setAttribute('href', article.url)
                        return articleElementButton
                    },
                    'container': () => {
                        const articleContainer = document.createElement('article')
                        articleContainer.setAttribute('id', 'article_' + getId())
                        articleContainer.setAttribute('class', 'article')
                        articleContainer.appendChild(articleDOM.image())
                        articleContainer.appendChild(articleDOM.heading())
                        articleContainer.appendChild(articleDOM.text())
                        articleContainer.appendChild(articleDOM.date())
                        articleContainer.appendChild(articleDOM.button())
                        return articleContainer
                    }
                }
                container.appendChild(articleDOM.container())
            })
        })
}

document.querySelector('#submit').addEventListener('click', fetchData, false)

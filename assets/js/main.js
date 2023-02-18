const container = document.querySelector('#grid-container')

const urlConstructor = () => {

    const apiKey = '44a6a73f818d4cd584e9f5db383a017f'
    const url = new URL('http://newsapi.org/v2/everything')
    const urlParams = new URLSearchParams()

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

    urlParams.append('q', keyword())
    urlParams.append('language', language())
    urlParams.append('pageSize', '30')
    urlParams.append('apiKey', apiKey)
    url.search = urlParams.toString()
    return url
}

function fetchData() {

    // Checks if the container contains any article
    // In case of they get deleted
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }

    // Calls the URL Constructor and returns the URL with the given parameters
    fetch(urlConstructor())
        .then(resp => resp.json())
        .then((data) => {
            data.articles.forEach(articles => {

                // Saves the data we need in an object so we can handle it later
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

                // Constructs the article with the data we saved in the container
                const articleDOM = {
                    'imageConstructor': () => {
                        try {
                            const articleElementImage = document.createElement('img')
                            articleElementImage.src = article.imgSrc
                            return articleElementImage
                        } catch(err) {
                            console.log(err.message);
                        }
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

                    // Constructs the article itself and loops through each of the methods to create the different parts of the article
                    // In the end, it appends the created elements as a child of the article container and returns the whole container
                    'containerConstructor': () => {
                        const articleContainer = document.createElement('article')
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

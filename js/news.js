// news.js
document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');

    fetch('/get_news')
        .then(response => response.json())
        .then(news => {
            news.forEach(item => {
                const newsItem = document.createElement('article');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3>${item[1]}</h3>
                    <img src="${item[3]}" alt="${item[1]}" onerror="this.style.display='none'">
                    <p>${item[2].substring(0, 200)}...</p>
                    <a href="/news/${item[0]}" class="read-more">Читать далее</a>
                    <p class="news-date">${new Date(item[4]).toLocaleDateString()}</p>
                `;
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке новостей:', error);
            newsContainer.innerHTML = '<p>Произошла ошибка при загрузке новостей. Пожалуйста, попробуйте позже.</p>';
        });
});
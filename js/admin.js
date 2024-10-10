document.addEventListener('DOMContentLoaded', function() {
    const addNewsBtn = document.getElementById('addNewsBtn');
    const saveNewsBtn = document.getElementById('saveNewsBtn');
    const newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
    const newsForm = document.getElementById('newsForm');
    const newsList = document.getElementById('newsList');

    // Загрузка списка новостей
    function loadNews() {
        fetch('/get_news')
            .then(response => response.json())
            .then(news => {
                newsList.innerHTML = '';
                news.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'card mb-3';
                    newsItem.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${item[1]}</h5>
                            <p class="card-text">${item[2].substring(0, 100)}...</p>
                            <button class="btn btn-sm btn-primary edit-news" data-id="${item[0]}">Редактировать</button>
                            <button class="btn btn-sm btn-danger delete-news" data-id="${item[0]}">Удалить</button>
                        </div>
                    `;
                    newsList.appendChild(newsItem);
                });
            })
            .catch(error => console.error('Ошибка при загрузке новостей:', error));
    }

    // Обработка добавления новости
    addNewsBtn.addEventListener('click', () => {
        newsForm.reset();
        document.getElementById('newsId').value = '';
        document.getElementById('newsModalLabel').textContent = 'Добавить новость';
        newsModal.show();
    });

    // Обработка сохранения новости
    saveNewsBtn.addEventListener('click', () => {
        const newsId = document.getElementById('newsId').value;
        const title = document.getElementById('newsTitle').value;
        const content = document.getElementById('newsContent').value;
        const imageUrl = document.getElementById('newsImageUrl').value;

        const newsData = { title, content, image_url: imageUrl };

        const url = newsId ? `/edit_news/${newsId}` : '/add_news';
        const method = newsId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newsData),
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            newsModal.hide();
            loadNews();
        })
        .catch(error => console.error('Ошибка при сохранении новости:', error));
    });

    // Обработка редактирования и удаления новостей
    newsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-news')) {
            const newsId = event.target.dataset.id;
            fetch(`/news/${newsId}`)
                .then(response => response.json())
                .then(news => {
                    document.getElementById('newsId').value = news[0];
                    document.getElementById('newsTitle').value = news[1];
                    document.getElementById('newsContent').value = news[2];
                    document.getElementById('newsImageUrl').value = news[3];
                    document.getElementById('newsModalLabel').textContent = 'Редактировать новость';
                    newsModal.show();
                })
                .catch(error => console.error('Ошибка при загрузке новости:', error));
        } else if (event.target.classList.contains('delete-news')) {
            const newsId = event.target.dataset.id;
            if (confirm('Вы уверены, что хотите удалить эту новость?')) {
                fetch(`/delete_news/${newsId}`, { method: 'DELETE' })
                    .then(response => response.text())
                    .then(result => {
                        alert(result);
                        loadNews();
                    })
                    .catch(error => console.error('Ошибка при удалении новости:', error));
            }
        }
    });

    // Загрузка новостей при открытии страницы
    loadNews();
});
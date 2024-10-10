from flask import Flask, send_from_directory, request, jsonify, render_template
import sqlite3
import os
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

# Создание базы данных SQLite и таблиц при запуске приложения
def create_database():
    if not os.path.exists('ukaz_database.db'):
        conn = sqlite3.connect('ukaz_database.db')
        cursor = conn.cursor()
        
        # Таблица для вакансий
        cursor.execute('''CREATE TABLE IF NOT EXISTS applications (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            address TEXT,
                            city TEXT,
                            phone TEXT
                          )''')
        
        # Таблица для новостей
        cursor.execute('''CREATE TABLE IF NOT EXISTS news (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            content TEXT NOT NULL,
                            image_url TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                          )''')
        
        conn.commit()
        conn.close()

create_database()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Функционал для вакансий (jobs)

@app.route('/apply', methods=['POST'])
def apply():
    try:
        data = request.json
        name = data.get('name')
        address = data.get('address')
        city = data.get('city')
        phone = data.get('phone')

        if not name:
            return 'Имя является обязательным полем', 400

        with sqlite3.connect('ukaz_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO applications (name, address, city, phone) VALUES (?, ?, ?, ?)", 
                           (name, address, city, phone))
            conn.commit()

        return 'Данные успешно сохранены в базе данных', 200
    except Exception as e:
        return f'Произошла ошибка при сохранении данных: {str(e)}', 500

@app.route('/view')
def view():
    try:
        with sqlite3.connect('ukaz_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name, address, city, phone FROM applications")
            data = cursor.fetchall()
        return jsonify(data)
    except Exception as e:
        return f'Произошла ошибка при загрузке данных: {str(e)}', 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if username == 'admin' and password == 'password':
            return jsonify({'authenticated': True}), 200
        else:
            return jsonify({'authenticated': False}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/edit', methods=['POST'])
def edit():
    try:
        data = request.json
        name = data.get('name')
        address = data.get('address')
        city = data.get('city')
        phone = data.get('phone')

        with sqlite3.connect('ukaz_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE applications SET address=?, city=?, phone=? WHERE name=?", 
                           (address, city, phone, name))
            conn.commit()

        return 'Данные успешно обновлены в базе данных', 200
    except Exception as e:
        return f'Произошла ошибка при обновлении данных: {str(e)}', 500

@app.route('/delete', methods=['POST'])
def delete():
    try:
        data = request.json
        name = data.get('name')

        with sqlite3.connect('ukaz_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM applications WHERE name=?", (name,))
            conn.commit()

        return 'Данные успешно удалены из базы данных', 200
    except Exception as e:
        return f'Произошла ошибка при удалении данных: {str(e)}', 500

# Новый функционал для новостей

@app.route('/add_news', methods=['POST'])
def add_news():
    try:
        data = request.json
        title = data.get('title')
        content = data.get('content')
        image_url = data.get('image_url')

        if not title or not content:
            return 'Заголовок и содержание являются обязательными полями', 400

        with sqlite3.connect('ukaz_database.db') as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)", 
                           (title, content, image_url))
            conn.commit()

        return 'Новость успешно добавлена', 200
    except Exception as e:
        return f'Произошла ошибка при добавлении новости: {str(e)}', 500

@app.route('/get_news')
def get_news():
       try:
           with sqlite3.connect('ukaz_database.db') as conn:
               cursor = conn.cursor()
               cursor.execute("SELECT id, title, content, image_url, created_at FROM news ORDER BY created_at DESC")
               news = cursor.fetchall()
           return jsonify(news)
       except Exception as e:
           return f'Произошла ошибка при загрузке новостей: {str(e)}', 500

@app.route('/news/<int:news_id>')
def get_news_item_html(news_id):
       try:
           with sqlite3.connect('ukaz_database.db') as conn:
               cursor = conn.cursor()
               cursor.execute("SELECT id, title, content, image_url, created_at FROM news WHERE id = ?", (news_id,))
               news_item = cursor.fetchone()
           if news_item:
               return render_template('news_item.html', news_item=news_item)
           else:
               return 'Новость не найдена', 404
       except Exception as e:
           return f'Произошла ошибка при загрузке новости: {str(e)}', 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
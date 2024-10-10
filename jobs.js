document.addEventListener('DOMContentLoaded', function () {
  const applyButtons = document.querySelectorAll('.apply-button');
  const modal = document.getElementById('apply-modal');
  const closeButton = document.querySelector('.close-button');

  applyButtons.forEach(button => {
      button.addEventListener('click', function () {
          modal.style.display = 'block';
      });
  });

  closeButton.addEventListener('click', function () {
      modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  const applyForm = document.getElementById('apply-form');
  applyForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Собираем данные из формы
      const formData = new FormData(applyForm);
      const requestData = {};
      formData.forEach((value, key) => {
          requestData[key] = value;
      });

      // Отправляем данные на сервер
      fetch('/apply', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка отправки данных на сервер');
              }
              return response.text();
          })
          .then(data => {
              alert(data);
              modal.style.display = 'none';
          })
          .catch(error => {
              console.error(error);
              alert('Произошла ошибка при отправке данных');
          });
  });

  // Функция для удаления данных
  function deleteRow(name) {
      if (confirm('Вы уверены, что хотите удалить эту запись?')) {
          fetch('/delete', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name: name })
          })
              .then(response => {
                  if (response.ok) {
                      location.reload(); // Перезагрузить страницу после успешного удаления
                  } else {
                      alert('Ошибка при удалении данных');
                  }
              })
              .catch(error => console.error('Error deleting data:', error));
      }
  }
});

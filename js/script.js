document.addEventListener('DOMContentLoaded', function() {
    const orderButtons = document.querySelectorAll('.order-button');
    
    orderButtons.forEach(button => {
      button.addEventListener('click', function() {
        alert('Функционал заказа будет добавлен позже');
        // Здесь будет код для обработки заказа
      });
    });
  });
  
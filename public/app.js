// Управление темой
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
}

// Установка начальной темы
document.body.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

// Обработка форм
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });

        if (response.ok) {
            window.location.href = '/profile.html';
        } else {
            alert('Ошибка входа');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });

        if (response.ok) {
            alert('Регистрация успешна');
        } else {
            alert('Ошибка регистрации');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
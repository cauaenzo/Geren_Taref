document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aqui você pode adicionar a lógica de autenticação
        // Por enquanto, vamos apenas redirecionar para a página principal
        if (email && password) {
            // Simula uma autenticação básica
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html';
        }
    });

    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Aqui você pode adicionar a lógica para abrir o formulário de registro
        alert('Funcionalidade de registro em desenvolvimento');
    });

    // Verifica se o usuário já está logado
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
}); 
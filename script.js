document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    // Lógica para mostrar/esconder senha
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    // Lógica para o formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === '' || password === '') {
                alert('Por favor, preencha o e-mail e a senha.');
            } else {
                // Simulação de login bem-sucedido
                alert('Login realizado com sucesso! Redirecionando...');
                
                // ESTA É A LINHA QUE FAZ O REDIRECIONAMENTO:
                window.location.href = 'index3.html'; 
                // Substitua 'dashboard.html' pelo nome da sua página de destino
            }
        });
    }
});
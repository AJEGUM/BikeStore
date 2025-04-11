
// Cambiar entre formularios de inicio de sesión y registro
document.getElementById('show-register').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Validación del formulario de inicio de sesión
document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === '' || password === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    // Simulación de inicio de sesión
    alert('Inicio de sesión exitoso');
    // Aquí puedes agregar la lógica para el inicio de sesión real.
});

// Validación del formulario de registro
document.getElementById('form-register').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const regEmail = document.getElementById('reg-email').value;
    const regPassword = document.getElementById('reg-password').value;
    const regConfirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (regEmail === '' || regPassword === '' || regConfirmPassword === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    if (regPassword !== regConfirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // Simulación de registro
    alert('Registro exitoso');
    // Aquí puedes agregar la lógica para el registro real.
});

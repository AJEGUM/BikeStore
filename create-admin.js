const fetch = require('node-fetch');

async function createAdmin() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/create-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_usuario: 'admin',
                email: 'admin@bikestore.com',
                clave: 'admin123',
                nombre_completo: 'Administrador Principal'
            })
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error al crear administrador:', error);
    }
}

createAdmin(); 
# API Bikestore

API REST para el sistema de gestión de bicicletas.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd bikestore-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
- Copiar el archivo `.env.example` a `.env`
- Modificar las variables según tu configuración local

4. Crear la base de datos:
- Ejecutar el script SQL en `db/BK_BD.sql`

5. Crear la carpeta para uploads:
```bash
mkdir uploads
```

## Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## Endpoints

### Categorías
- GET /api/categorias - Obtener todas las categorías
- GET /api/categorias/:id - Obtener una categoría
- POST /api/categorias - Crear una categoría
- PUT /api/categorias/:id - Actualizar una categoría
- DELETE /api/categorias/:id - Eliminar una categoría

### Productos
- GET /api/productos - Obtener todos los productos
- GET /api/productos/:id - Obtener un producto
- POST /api/productos - Crear un producto
- PUT /api/productos/:id - Actualizar un producto
- DELETE /api/productos/:id - Eliminar un producto

### Stock
- GET /api/stock - Obtener todo el stock
- GET /api/stock/:id - Obtener un registro de stock
- POST /api/stock - Crear un registro de stock
- PUT /api/stock/:id - Actualizar un registro de stock
- DELETE /api/stock/:id - Eliminar un registro de stock

### Usuarios
- GET /api/usuarios - Obtener todos los usuarios
- GET /api/usuarios/:id - Obtener un usuario
- POST /api/usuarios - Crear un usuario
- PUT /api/usuarios/:id - Actualizar un usuario
- DELETE /api/usuarios/:id - Eliminar un usuario

### Roles
- GET /api/roles - Obtener todos los roles
- GET /api/roles/:id - Obtener un rol
- POST /api/roles - Crear un rol
- PUT /api/roles/:id - Actualizar un rol
- DELETE /api/roles/:id - Eliminar un rol

### Ventas
- GET /api/ventas - Obtener todas las ventas
- GET /api/ventas/:id - Obtener una venta
- POST /api/ventas - Crear una venta
- PUT /api/ventas/:id - Actualizar una venta
- DELETE /api/ventas/:id - Eliminar una venta

## Estructura del Proyecto

```
bikestore-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── categoria.controller.js
│   │   ├── producto.controller.js
│   │   ├── stock.controller.js
│   │   ├── usuario.controller.js
│   │   ├── rol.controller.js
│   │   └── venta.controller.js
│   ├── routes/
│   │   ├── categoria.routes.js
│   │   ├── producto.routes.js
│   │   ├── stock.routes.js
│   │   ├── usuario.routes.js
│   │   ├── rol.routes.js
│   │   └── venta.routes.js
│   └── index.js
├── uploads/
├── .env
├── package.json
└── README.md
``` 
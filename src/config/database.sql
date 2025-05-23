-- Crear la base de datos si no existe
DROP DATABASE IF EXISTS bikestore;
CREATE DATABASE bikestore;

-- Usar la base de datos
USE bikestore;

-- Crear tabla de categorías
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Crear tabla de productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    id_categoria INT,
    imagen VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insertar algunas categorías de ejemplo
INSERT INTO categoria (nombre_categoria, descripcion) VALUES
('Mountain Bike', 'Bicicletas para montaña y senderos'),
('Ruta', 'Bicicletas para carretera y competencia'),
('Urbana', 'Bicicletas para uso en la ciudad'),
('BMX', 'Bicicletas para acrobacias y parques');

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre_producto, descripcion, precio, id_categoria) VALUES
('Mountain Pro', 'Bicicleta de montaña profesional', 899.99, 1),
('Ruta Elite', 'Bicicleta de ruta de alta gama', 1299.99, 2),
('City Cruiser', 'Bicicleta urbana cómoda', 499.99, 3),
('BMX Trick', 'Bicicleta BMX para acrobacias', 399.99, 4);

-- Crear tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insertar roles por defecto con IDs específicos
INSERT INTO roles (id, nombre_rol, descripcion) VALUES
(1, 'Administrador', 'Acceso total al sistema'),
(2, 'Vendedor', 'Puede realizar ventas y gestionar productos'),
(3, 'Cliente', 'Puede realizar compras y ver productos');

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    clave VARCHAR(500) NOT NULL,
    nombre_completo VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB; 
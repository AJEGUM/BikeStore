-- PARA INICIAR LA API SE COLOCA EN LA CONSOLA (node index.js)

CREATE DATABASE bikestore;
--admin@bikestore.com
--admin123

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

create table usuarios(
	id int auto_increment primary key,
    correo varchar(200),
    contrasena varchar(200)
);

select * from categoria;
select * from productos;
select * from usuarios;

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
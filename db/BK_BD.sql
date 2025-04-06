CREATE DATABASE Bikestore;
Use BikeStore;

CREATE TABLE categoria(
    id INT auto_increment Primary key,
    nombre_categoria varchar(50) NOT NULL,
    descripcion varchar(255),
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE productos (
    id INT auto_increment Primary key,
    categoria_id INT NOT NULL,
    nombre_producto varchar(50) NOT NULL,
    descripcion varchar(255),
    precio decimal(10,2) NOT NULL,
    imagen blob,
    fecha_creacion timestamp default current_timestamp,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE stock(
    id INT auto_increment Primary key,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    lote Varchar(30),
    fecha_entrada timestamp default current_timestamp,
    fecha_salida date,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE roles (
    id INT auto_increment Primary key,
    nombre_rol varchar(50) NOT NULL,
    descripcion varchar(255),
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios (
    id INT auto_increment Primary key,
    rol_id INT NOT NULL,
    nombre_usuario varchar(50) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    clave varchar(500) NOT NULL,
    nombre_completo varchar(100),
    telefono varchar(20),
    direccion varchar(255),
    fecha_registro timestamp default current_timestamp,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);


CREATE TABLE ventas (
    id INT auto_increment Primary key,
    usuario_id INT NOT NULL,
    fecha_venta timestamp default current_timestamp,
    total decimal(10,2) NOT NULL,
    estado varchar(20) DEFAULT 'PENDIENTE',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalle_venta (
    id INT auto_increment Primary key,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario decimal(10,2) NOT NULL,
    subtotal decimal(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
SELECT * FROM roles;
-- Insertar roles básicos
INSERT INTO roles (nombre_rol, descripcion) VALUES 
('Administrador', 'Control total del sistema'),
('Vendedor', 'Gestión de ventas y productos'),
('Cliente', 'Usuario final del sistema');

/* Insertar categorías de ejemplo
INSERT INTO categoria (nombre_categoria, descripcion) VALUES 
('Mountain Bike', 'Bicicletas de montaña'),
('Ruta', 'Bicicletas de ruta'),
('Urbana', 'Bicicletas urbanas'),
('Accesorios', 'Accesorios para bicicletas'); */
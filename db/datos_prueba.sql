-- Insertar categorías de ejemplo
INSERT INTO categoria (nombre_categoria, descripcion) VALUES 
('Mountain Bike', 'Bicicletas de montaña'),
('Ruta', 'Bicicletas de ruta'),
('Urbana', 'Bicicletas urbanas'),
('Accesorios', 'Accesorios para bicicletas');

-- Insertar productos de ejemplo
INSERT INTO productos (categoria_id, nombre_producto, descripcion, precio, estado) VALUES 
(1, 'Mountain Bike Pro', 'Bicicleta de montaña profesional', 899.99, 1),
(1, 'Mountain Bike Elite', 'Bicicleta de montaña de élite', 1299.99, 1),
(2, 'Ruta Speed', 'Bicicleta de ruta de alta velocidad', 1499.99, 1),
(2, 'Ruta Comfort', 'Bicicleta de ruta cómoda', 999.99, 1),
(3, 'Urbana City', 'Bicicleta urbana para la ciudad', 599.99, 1),
(3, 'Urbana Classic', 'Bicicleta urbana clásica', 499.99, 1),
(4, 'Casco Deportivo', 'Casco para ciclismo', 49.99, 1),
(4, 'Luces LED', 'Luces LED para bicicleta', 29.99, 1);

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (rol_id, nombre_usuario, email, clave, nombre_completo, estado) VALUES 
(1, 'admin', 'admin@bikestore.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPT6', 'Administrador', 1),
(2, 'vendedor', 'vendedor@bikestore.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPT6', 'Vendedor', 1),
(3, 'cliente', 'cliente@bikestore.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDu0.i9ZwPT6', 'Cliente', 1);

-- Insertar ventas de ejemplo
INSERT INTO ventas (usuario_id, total, estado) VALUES 
(3, 949.98, 'completada'),
(3, 1799.98, 'completada'),
(3, 599.99, 'completada'),
(3, 999.99, 'completada'),
(3, 1499.99, 'completada');

-- Insertar detalles de venta de ejemplo
INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(1, 5, 1, 599.99, 599.99),
(1, 7, 1, 49.99, 49.99),
(1, 8, 1, 29.99, 29.99),
(2, 1, 1, 899.99, 899.99),
(2, 2, 1, 899.99, 899.99),
(3, 5, 1, 599.99, 599.99),
(4, 3, 1, 999.99, 999.99),
(5, 3, 1, 1499.99, 1499.99);

-- Insertar stock de ejemplo
INSERT INTO stock (producto_id, cantidad, lote, estado) VALUES 
(1, 10, 'LOTE001', 1),
(2, 8, 'LOTE002', 1),
(3, 5, 'LOTE003', 1),
(4, 7, 'LOTE004', 1),
(5, 12, 'LOTE005', 1),
(6, 9, 'LOTE006', 1),
(7, 20, 'LOTE007', 1),
(8, 15, 'LOTE008', 1); 
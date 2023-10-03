const spanCantidad = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");

class Producto {
  constructor(id, nombre, precio, categoria, imagen, specs) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
    this.specs = specs;
  }
}

class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.agregarProducto(
      1,
      "NVIDIA RTX 2070",
      300000,
      "GPU",
      "rtx2070.jpg",
      "8GB VRAM - Memoria GDDR6 - WINDFORCE 3X Cooling System"
    );
    this.agregarProducto(
      2,
      "AMD RX 6600",
      250000,
      "GPU",
      "rx6600.png",
      "8GB VRAM - Memoria GDDR6 - AMD FidelityFX™ Super Resolution"
    );
    this.agregarProducto(
      3,
      "Intel i7 7700",
      100000,
      "CPU",
      "i7-7700.png",
      "4 núcleos - 8 hilos - Hasta 4.20 GHZ de frecuencia máxima"
    );
    this.agregarProducto(
      4,
      "AMD Ryzen 5 7600",
      150000,
      "CPU",
      "amd-ryzen.png",
      "6 núcleos - 12 hilos - Hasta 5.10 GHZ de frecuencia máxima"
    );
  }

  agregarProducto(id, nombre, precio, categoria, imagen, specs) {
    const producto = new Producto(id, nombre, precio, categoria, imagen, specs);
    this.productos.push(producto);
  }

  traerProductos() {
    return this.productos;
  }

  productoPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  productosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("Carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidad = 0;
    this.listar();
  }

  enCarrito({ id }) {
    return this.carrito.find((p) => p.id === id);
  }

  comprar(producto) {
    const productoEnCarrito = this.enCarrito(producto);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("Carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    localStorage.setItem("Carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar() {
    this.total = 0;
    this.cantidad = 0;
    divCarrito.innerHTML = "";

    for (const producto of this.carrito) {
      divCarrito.innerHTML += `<div class= "productoCarrito">
      <h2>${producto.nombre}</h2>
      <p>$${producto.precio}</p>
      <p>Cantidad: ${producto.cantidad}</p>
      <button class= "btnQuitar"  data-id="${producto.id}">Quitar del carrito</button></div>`;

      this.total += producto.precio * producto.cantidad;
      this.cantidad += producto.cantidad;
    }

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = parseInt(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    spanCantidad.innerHTML = this.cantidad;
    spanTotalCarrito.innerText = this.total;
  }
}

const bDatos = new BaseDeDatos();
const carrito = new Carrito();

cargarCatalogo(bDatos.traerProductos());

function cargarCatalogo(productos) {
  divProductos.innerHTML = "";

  for (const producto of productos) {
    divProductos.innerHTML += `
    <div class="card">
    <h2>${producto.nombre}</h2> 
    <p class="precio">$${producto.precio}</p>
    <div class="imagen">
    <img src="img/${producto.imagen}" alt="${producto.nombre}"/>
    </div>
    <p class="specsProducto">${producto.specs}</p>
    <button class="btnAgregar" data-id="${producto.id}">Agregar al carrito</button>    
    </div>`;
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = parseInt(boton.dataset.id);
      const producto = bDatos.productoPorId(idProducto);

      carrito.comprar(producto);
    });
  }
}

//BUSCADOR
inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const producto = bDatos.productosPorNombre(palabra);
  cargarCatalogo(producto);
});

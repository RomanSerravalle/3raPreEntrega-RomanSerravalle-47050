const spanCantidad = document.querySelectorAll(".cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonComprarCarrito = document.querySelector("#btnComprarCarrito");

//Clase de productos
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

//Clase para base de datos del catálogo
class BaseDeDatos {
  constructor() {
    //Array catálogo de productos
    this.productos = [];
    //PRODUCTOS
    this.agregarProducto(
      1,
      "NVIDIA RTX 2070",
      180000,
      "Tarjeta gráfica",
      "rtx2070.jpg",
      "8GB VRAM - Memoria GDDR6 - Frecuencia de 1410 MHz"
    );
    this.agregarProducto(
      2,
      "NVIDIA GTX 1650 Super",
      135000,
      "Tarjeta gráfica",
      "1650-super.png",
      "4GB VRAM - Memoria GDDR6 - Frecuencia de 1740 MHz"
    );
    this.agregarProducto(
      3,
      "NVIDIA RTX 4080",
      1500000,
      "Tarjeta gráfica",
      "nvidia-4080.png",
      "16GB VRAM - Memoria GDDR6X - Frecuencia de 2510 MHz"
    );
    this.agregarProducto(
      4,
      "AMD RX 6600 XT",
      300000,
      "Tarjeta gráfica",
      "rx6600.png",
      "8GB VRAM - Memoria GDDR6 - Frecuencia de 2359 MHz"
    );
    this.agregarProducto(
      5,
      "AMD RX 580",
      210000,
      "Tarjeta gráfica",
      "rx-580.png",
      "8GB VRAM - Memoria GDDR5 - Frecuencia de 1257 MHz"
    );
    this.agregarProducto(
      6,
      "AMD RX 7900 XT",
      1350000,
      "Tarjeta gráfica",
      "rx7900.png",
      "20GB VRAM - Memoria GDDR6 - Frecuencia de 2400 MHz"
    );
    this.agregarProducto(
      7,
      "Intel i7 7700",
      100000,
      "CPU",
      "i7-7700.png",
      "4 núcleos - 8 hilos - Hasta 4.20 GHz de frecuencia"
    );
    this.agregarProducto(
      8,
      "Intel i9 13900k",
      985000,
      "CPU",
      "i9-13900k.png",
      "24 núcleos - 32 hilos - Hasta 5.80 GHz de frecuencia"
    );
    this.agregarProducto(
      9,
      "AMD Ryzen 5 7600",
      150000,
      "CPU",
      "amd-ryzen5.png",
      "6 núcleos - 12 hilos - Hasta 5.10 GHz de frecuencia"
    );
    this.agregarProducto(
      10,
      "AMD Ryzen 9 7950X",
      770000,
      "CPU",
      "amd-ryzen9.png",
      "16 núcleos - 32 hilos - Hasta 4.5 GHz de frecuencia"
    );
    this.agregarProducto(
      11,
      "RAM Corsair DDR4 8GB",
      25000,
      "Memoria RAM",
      "ram-corsair.png",
      "Memoria VENGEANCE® LPX - 8GB RAM DDR4- 2400MHz"
    );
    this.agregarProducto(
      12,
      "RAM Patriot DDR4 8GB",
      30000,
      "Memoria RAM",
      "ram-viper.png",
      "Memoria PATRIOT® VIPER STEEL - 8GB RAM DDR4 - 3200MHz"
    );
  }

  //Método para almacenar productos en el array catálogo
  agregarProducto(id, nombre, precio, categoria, imagen, specs) {
    const producto = new Producto(id, nombre, precio, categoria, imagen, specs);
    this.productos.push(producto);
  }

  //Devuelve el array del catálogo
  traerProductos() {
    return this.productos;
  }

  //Devuelve producto por ID
  productoPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  //Devuelve productos por nombre
  productosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

//Clase para el carrito
class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("Carrito"));
    //Array del carrito
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidad = 0;
    this.listar();
  }

  //Buscar producto según ID
  enCarrito({ id }) {
    return this.carrito.find((p) => p.id === id);
  }

  //Agregar producto a carrito
  comprar(producto) {
    const productoEnCarrito = this.enCarrito(producto);

    //Condicional para actualizar cantidad del producto
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("Carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  vaciarCarrito() {
    this.total = 0;
    this.cantidad = 0;
    this.carrito = [];
    localStorage.setItem("Carrito", JSON.stringify(this.carrito));
  }

  //Quitar producto del carrito
  quitar(id) {
    //Buscar nombre del producto
    const productoQuitar = this.carrito.find((producto) => producto.id === id);

    if (productoQuitar) {
      //Buscar índice según ID
      const indice = this.carrito.findIndex((producto) => producto.id === id);
      //Restar cantidad o quitar producto
      this.carrito[indice].cantidad > 1
        ? this.carrito[indice].cantidad--
        : this.carrito.splice(indice, 1);
      localStorage.setItem("Carrito", JSON.stringify(this.carrito));

      Toastify({
        text: `${productoQuitar.nombre} fue quitado del carrito.`,
        className: "productoQuitado",
        duration: 1000,
        position: "center",
      }).showToast();

      this.listar();
    }
  }

  //Mostrar productos en HTML
  listar() {
    this.total = 0;
    this.cantidad = 0;
    divCarrito.innerHTML = "";
    // Mostrar productos en carrito
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `<div class= "productoCarrito">
      <h2>${producto.nombre}</h2>
      <p>$${producto.precio}</p>
      <p>Cantidad: ${producto.cantidad}</p>
      <button class= "btnQuitar"  data-id="${producto.id}">Quitar del carrito</button></div>`;

      this.total += producto.precio * producto.cantidad;
      this.cantidad += producto.cantidad;
    }

    //Asignar evento a botones de quitar
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = parseInt(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    //Asignar cantidad a contadores
    spanCantidad.forEach((span) => {
      span.innerHTML = this.cantidad;
    });

    spanTotalCarrito.innerText = this.total;
  }
}

const bDatos = new BaseDeDatos();
const carrito = new Carrito();

cargarCatalogo(bDatos.traerProductos());

//Mostrar catálogo en HTML
function cargarCatalogo(productos) {
  divProductos.innerHTML = "";

  for (const producto of productos) {
    divProductos.innerHTML += `
    <div class="card">
    <h2>${producto.nombre}</h2> 
    <p class="precio">$${producto.precio}</p>
    <p class="categoria">${producto.categoria}</p>
    <div class="imagen">
    <img src="img/${producto.imagen}" alt="${producto.nombre}"/>
    </div>
    <p class="specsProducto">${producto.specs}</p>
    <button class="btnAgregar" data-id="${producto.id}">Agregar al carrito</button>    
    </div>`;
  }

  //Asignar evento a botones de agregar
  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = parseInt(boton.dataset.id);
      const producto = bDatos.productoPorId(idProducto);

      carrito.comprar(producto);

      Toastify({
        text: `Se agregó ${producto.nombre} al carrito.`,
        className: "productoComprado",
        duration: 1000,
        position: "center",
      }).showToast();
    });
  }
}

//Buscador
inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const producto = bDatos.productosPorNombre(palabra);
  cargarCatalogo(producto);
});

botonComprarCarrito.addEventListener("click", (event) => {
  event.preventDefault;
  carrito.vaciarCarrito();
  carrito.listar();

  Swal.fire({
    customClass: "alertComprar",
    position: "center",
    icon: "success",
    title: "¡Gracias por la compra!",
    showConfirmButton: false,
    timer: 1500,
  });
});

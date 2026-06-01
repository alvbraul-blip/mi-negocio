let carrito = [];
let total = 0;

// 🛒 Agregar producto
function agregarAlCarrito(precio) {
  precio = Number(precio);

  if (isNaN(precio)) {
    console.error("Precio inválido");
    return;
  }

  // Guardamos producto
  carrito.push(precio);

  actualizarCarrito();
}

// ❌ Eliminar producto
function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// 🔄 Actualizar carrito y total
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");

  lista.innerHTML = "";

  total = 0;

  carrito.forEach((precio, index) => {
    total += precio;

    const item = document.createElement("div");

    item.innerHTML = `
      Producto - $${precio}
      <button onclick="eliminarProducto(${index})">
        Eliminar
      </button>
    `;

    lista.appendChild(item);
  });

  document.getElementById("total").innerText =
    "Total: $" + total;
}

// 💳 Comprar
async function comprar() {
  try {
    if (total <= 0) {
      alert("El carrito está vacío");
      return;
    }

    const response = await fetch(
      "https://mi-negocio-c6ep.onrender.com/crear-preferencia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          precio: total
        })
      }
    );

    const data = await response.json();

    if (!data.id) {
      throw new Error("No se recibió ID");
    }

    window.location.href =
      `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${data.id}`;

  } catch (error) {
    console.error(error);
    alert("Error al procesar el pago");
  }
}
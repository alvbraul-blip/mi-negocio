import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Para servir el frontend correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// 🔐 Configuración correcta Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN
});

// 🚀 Endpoint
app.post("/crear-preferencia", async (req, res) => {
  try {
    const { precio } = req.body;

    console.log("Precio recibido:", precio);

    if (!precio || isNaN(precio)) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: "Compra Avibess Closet",
            unit_price: Number(precio),
            quantity: 1,
            currency_id: "MXN"
          }
        ]
      }
    });

    console.log("Preferencia creada:", response.id);

    res.json({ id: response.id });

  } catch (error) {
    console.error("ERROR MP:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const stripe = require("stripe")(
  "sk_test_51PA68JSJPBTss550EXQxCNHGTEEn07SbP3IAJ2ivYBxF0KC4XbcZvqFxjp769zYeweq8Rj6eiUjmgGXGL1BTAwFq001CL9klD1"
); // Import and initialize Stripe

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log("products ::",products);

  const lineItems = products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [product.thumbnail],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qty,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/cart-react/successpayment",
      cancel_url: "http://localhost:3000/cart-react/cart",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});



app.use(cors());
app.use(express.json());
app.use("/", router);

http.listen(3001, function () {
  console.log("Server is running");
});

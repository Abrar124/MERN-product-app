const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productsRoute = require('./routes/products');
const Product = require('./models/product'); // Import the Product model
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware');
const PurchasedProduct = require('./models/PurchasedProduct');
const stripe = require('stripe')('sk_test_51Nj4iZCIZNlr5xwYj1A2n6g6gRemNba852NK4WWc4SZnAAieMfKP5JK8dCAxUGPj53VIxZSrUE8bn99pwnJ4TFdG00XU5XrCH2');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);


// MongoDB setup
mongoose.connect('mongodb+srv://trial:trial@cluster0.fypri9h.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Purchase API
app.post('/api/purchase', authenticateToken, async (req, res) => {
    const productData = req.body;
    const user_id = req.user.id; // Assuming the user's ID is stored in req.user

    try {
        const purchasedProduct = new PurchasedProduct({
            title: productData.title,
            price: productData.price,
            user_id: user_id,
        });

        await purchasedProduct.save();
        res.status(200).json({ message: 'Product purchased and saved' });
    } catch (error) {
        console.error('Error saving purchased product:', error);
        res.status(500).json({ error: 'An error occurred while saving the product' });
    }
});


// Admin dashboard to recieve data
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const purchasedProducts = await PurchasedProduct.find().populate('user_id');
        res.status(200).json(purchasedProducts);
    } catch (error) {
        console.error('Error fetching purchased products:', error);
        res.status(500).json({ error: 'An error occurred while fetching purchased products' });
    }
});


// Payment API
app.post('/api/create-payment-intent', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // amount in cents
        currency: 'usd',
    });

    res.json({ sessionId: paymentIntent.client_secret });
});


// // Add your dummy products data here
// const initialProducts = [
//     {
//         title: 'Product 1',
//         price: 10.99,
//     },
//     {
//         title: 'Product 2',
//         price: 19.99,
//     },
//     {
//         title: 'Product 3',
//         price: 7.49,
//     },
// ];

// // Insert initial products data into the database
// async function insertInitialProducts() {
//     try {
//         const insertedProducts = await Product.insertMany(initialProducts);
//         console.log('Initial products added:', insertedProducts);
//     } catch (error) {
//         console.error('Error adding initial products:', error);
//     }
// }

// insertInitialProducts(); // Call the function to insert initial products



app.use(productsRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

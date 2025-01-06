require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('./swagger/swagger.json');
const path = require('path');

const app = express();

// Middleware ها
app.use(cors());
app.use(express.json());

// مسیر استاتیک برای فایل‌های عمومی
app.use('/static', express.static(path.join(__dirname, 'public')));

// مسیر موقت برای عملیات نوشتن و فایل‌های پویا
app.use('/temp', express.static('/tmp'));

// شروع سرور با پورت مشخص
const PORT = process.env.PORT || 6501;

const startServer = (port) => {
    const server = app.listen(port, async () => {
        console.log(`✅ Server running on port ${port}`);

        // تنظیم آدرس Swagger برای محیط‌های مختلف
        swaggerDocument.servers = [
            {
                url: process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}`
                    : `http://localhost:${port}`,
                description: process.env.VERCEL_URL
                    ? 'Vercel Production Server'
                    : 'Local server',
            },
        ];

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        console.log(
            `📚 Swagger API docs are available at ${
                process.env.VERCEL_URL
                    ? `https://${process.env.VERCEL_URL}/api-docs`
                    : `http://localhost:${port}/api-docs`
            }`
        );
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use, trying port ${+port + 1}...`);
            startServer(+port + 1); // تلاش برای پورت بعدی
        } else {
            console.error('❌ Server error:', err);
        }
    });
};

startServer(PORT);

// تعریف مسیرها (Routes)
app.use(require('./routes/dev'));
app.use('/auth', require('./routes/auth'));
app.use('/tour', require('./routes/tour'));
app.use('/basket', require('./routes/basket'));
app.use('/user', require('./routes/user'));
app.use('/order', require('./routes/order'));

// مسیر اصلی (Root Route)
app.get('/', (req, res) => {
    res.send('🌍 Welcome to the Tour and Travel Agency API!');
});

// Middleware برای مسیرهای نامشخص
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: '❌ Route not found',
    });
});

// Middleware برای هندل کردن خطاها
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: '❌ Internal Server Error',
    });
});

module.exports = app;

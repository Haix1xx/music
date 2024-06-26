const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoute');
const trackRouter = require('./routes/trackRoute');
const genreRouter = require('./routes/genreRoute');
const streamRouter = require('./routes/streamRoute');
const albumRouter = require('./routes/albumRoute');
const artistRouter = require('./routes/artistRoute');
const searchRouter = require('./routes/searchRoute');
const featuredPlaylistRouter = require('./routes/featuredPlaylistRoute');
const meRouter = require('./routes/meRoute');
const chartRouter = require('./routes/chartRoute');
const overviewRouter = require('./routes/overrviewRoute');
const requestRouter = require('./routes/artistRequestRoute');

const cors = require('cors');

const { uploadImageToCloudinary } = require('./utils/cloudinaryServices');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20000000, files: 2 },
});

app.enable('trust proxy');
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://soundee.vercel.app'],
        credentials: true, // Allow credentials (cookies) to be sent
    })
);
app.use(
    cookieSession({
        secret: process.env.JWT_SECRET,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? false : 'none',
    })
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(bodyParser.json());
// app.use(upload.any());
// app.use(express.static('public'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//create a bucket

// 3) ROUTES
app.use('/healthcheck', (req, res, next) => {
    res.status(200).json('hello world');
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tracks', trackRouter);
app.use('/api/v1/genres', genreRouter);
app.use('/api/v1/streams', streamRouter);
app.use('/api/v1/albums', albumRouter);
app.use('/api/v1/artists', artistRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/f-playlists', featuredPlaylistRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/charts', chartRouter);
app.use('/api/v1/overview', overviewRouter);
app.use('/api/v1/artist-requests', requestRouter);
// app.post('/upload', upload.array('file'), async (req, res) => {
//     const file = req.files[0];
//     const result = await s3UploadFile(file);

//     res.json({ status: 'success', result });
// });

app.post('/uploadImage', upload.array('file'), async (req, res) => {
    const file = req.files[0];
    const result = await uploadImageToCloudinary(file);

    res.json({ status: 'success', result });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

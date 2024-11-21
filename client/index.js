const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// gRPC Client Setup
const PROTO_PATH = path.join(__dirname, '../server/userService.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userServiceProto = grpc.loadPackageDefinition(packageDefinition).UserService;
const client = new userServiceProto.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Routes
app.get('/', (req, res) => res.render('pages/login'));
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    client.Login({ username, password }, (err, response) => {
        if (err) {
            console.error(err);
            res.render('pages/login', { error: err.message });
        } else {
            res.render('pages/login', { success: response.message });
        }
    });
});

app.get('/register', (req, res) => res.render('pages/register'));
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    client.Register({ username, password }, (err, response) => {
        if (err) {
            console.error(err);
            res.render('pages/register', { error: err.message });
        } else {
            res.render('pages/register', { success: response.message });
        }
    });
});

app.get('/updateUser', (req, res) => res.render('pages/update'));
app.post('/updateUser', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    client.UpdateUser({ username, oldPassword, newPassword }, (err, response) => {
        if (err) {
            console.error(err);
            res.render('pages/update', { error: err.message });
        } else {
            res.render('pages/update', { success: response.message });
        }
    });
});

app.get('/deleteUser', (req, res) => res.render('pages/delete'));
app.post('/deleteUser', (req, res) => {
    const { username, password } = req.body;
    client.DeleteUser({ username, password }, (err, response) => {
        if (err) {
            console.error(err);
            res.render('pages/delete', { error: err.message });
        } else {
            res.render('pages/delete', { success: response.message });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Client is running on http://localhost:${PORT}`));
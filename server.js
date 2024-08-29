require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes/authRoute");
const postRoutes = require("./Routes/postRoutes/postRoute");
const { Server } = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ["*"]
    }
});




app.use(cors({
    origin: CLIENT_ORIGIN,
    methods : ["*"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRoutes);
app.use("/post", postRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to EchoStream API!');
});


io.on('connection', (socket) => {
    console.log(`User connected with ${socket.id}`);

    socket.on("newPost", (data) => {
        console.log("received: ", data.email);
        io.emit('updatePost', { data });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected with ${socket.id}`);
    });
});

server.listen(PORT, (err) => {
    if (err) return console.error('Server Error:', err);
    console.log(`Server running on PORT: ${PORT}`);
});



const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('hello guys')
});

io.on('connection', socket => {
    console.log('a user connected to socket');

    socket.emit('hello', [
        {long: 234, lat: 321},
        {long: 123, lat:777}

    ]);

});


http.listen(3000, () => {
    console.log('listening on *:3000');
});
const radars = require('./db').radars;
const radarsPosition = require('./db').radarsPosition;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);



app.get('/', (req, res) => {
    res.send('hello guys')
});

io.on('connection', socket => {
    console.log('a user connected to socket');



    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // socket.on('add-message', (message) => {
    //     io.emit('message', {type:'new-message', text: message});
    // });


    socket.emit('get_radars',radars);
    socket.emit('get_radarsPosition',radarsPosition);


});


http.listen(3000, () => {
    console.log('listening on *:3000');
});
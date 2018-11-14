const radars = require('./db').radars;
const radarsPosition = require('./db').radarsPosition;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


let getRandomLocation = function (latitude, longitude, radiusInMeters, RadarId) {
    let id = RadarId;

    let getRandomCoordinates = function (radius) {
        // Generate two random numbers
        let a = Math.random(),
            b = Math.random();

        return [
            b * radius * Math.cos(2 * Math.PI * a / b),
            b * radius * Math.sin(2 * Math.PI * a / b)
        ];
    };

    let randomCoordinates = getRandomCoordinates(radiusInMeters, true);

    // Earths radius in meters via WGS 84 model.
    let earth = 6378137;

    // Offsets in meters.
    let northOffset = randomCoordinates[0],
        eastOffset = randomCoordinates[1];

    // Offset coordinates in radians.
    let offsetLatitude = northOffset / earth,
        offsetLongitude = eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));


    // Offset position in decimal degrees.
    // console.log(latitude + (offsetLatitude * (180 / Math.PI)) +', ' + longitude + (offsetLongitude * (180 / Math.PI)));
    return {
        // longitude: longitude + (offsetLongitude * (180 / Math.PI)),
        lon: longitude + (offsetLongitude * (180 / Math.PI)),
        lat: latitude + (offsetLatitude * (180 / Math.PI)),
        id: id

    }
};

let randomPoint = [];

setInterval(() => {
    randomPoint = [];
    radarsPosition.forEach(r => {
        let p
        p = getRandomLocation(r.lat, r.lon, 1000, r.id);
        randomPoint.push(p);


    });
    console.log(randomPoint);

}, 3000);


// radarsPosition.forEach(r => {
//     randomPoint = null;
//     setInterval(() => {
//     randomPoint = getRandomLocation(r.lat, r.lon, 1000, r.id);
//     console.log(randomPoint);
// }, 1000);
// });

app.get('/', (req, res) => {
    res.send('hello guys')
});

io.on('connection', socket => {
    console.log('a user connected to socket');


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // socket.on('add-message', (message) => {
    //     io.emit('message', {type:'new-message', text: message});
    // });


    socket.emit('get_radars', radars);
    socket.emit('get_radarsPosition', radarsPosition);
    socket.emit('get_randomPoint', randomPoint);


});


http.listen(3000, () => {
    console.log('listening on *:3000');
});
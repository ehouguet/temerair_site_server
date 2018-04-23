'use strict';

// export
module.exports = PlayerControlleur;

var currentId = 0;

function PlayerControlleur(socket) {
    
    return {
        socket: socket,
        id: 'Anomyne' + currentId++,
        name: '',
        emit(label, data) {
            socket.emit(label, data);
        },
        on(label, fun) {
            socket.on(label, fun);
        },
    }
}
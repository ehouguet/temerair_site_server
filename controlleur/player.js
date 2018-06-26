'use strict';

// export
module.exports = PlayerControlleur;

var currentId = 0;

function PlayerControlleur(socket) {
    
    return {
        socket: socket,
        id: currentId++,
        name: '',
        state: '',
        plateau: null,
        emit(label, data) {
            socket.emit(label, data);
        },
        leave(label, data) {
            socket.leave(label, data);
        },
        on(label, fun) {
            socket.on(label, fun);
        },
    }
}

PlayerControlleur.playing = 'playing';
PlayerControlleur.waiting = 'waiting';
PlayerControlleur.available = 'available';
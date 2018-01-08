let userParticipant = {};

let refreshParticipant = (id) => webix.ajax('/ar/participant/' + id)
    .then((p) => {
        userParticipant[id] = p.json();
        return userParticipant[id];
    })
    .catch((err) => {
        userParticipant[id] = null;
        throw err;
        return null;
    });


let getParticipant = (id) => new Promise((resolve, reject) => {
    if (userParticipant[id]) {
        resolve(userParticipant[id]);
    } else {
        return refreshParticipant(id).then(resolve).fail(reject);
    }
});


export default {
    refreshParticipant: refreshParticipant,
    getParticipant: getParticipant
};

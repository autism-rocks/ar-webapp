let userProfile = {};

let refreshProfile = (id) => webix.ajax('/ar/user/profile' + (id ? '/' + id : ''))
    .then((profile) => {
        userProfile[id] = profile.json();
        return userProfile[id];
    })
    .catch((err) => {
        userProfile[id] = null;
        throw err;
        return null;
    });


let getProfile = (id) => new Promise((resolve, reject) => {
    if (userProfile[id]) {
        resolve(userProfile[id]);
    } else {
        return refreshProfile(id).then(resolve).fail(reject);
    }
});


export default {
    refreshProfile: refreshProfile,
    getProfile: getProfile
};

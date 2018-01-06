let userProfile = null;

let refreshProfile = () => webix.ajax('/ar/user/profile')
    .then((profile) => {
        userProfile = profile.json();
        return userProfile;
    })
    .catch((err) => {
        userProfile = null;
        throw err;
        return null;
    });


let getProfile = () => new Promise((resolve, reject) => {
    if (userProfile) {
        resolve(userProfile);
    } else {
        return refreshProfile().then(resolve).fail(reject);
    }
});


export default {
    refreshProfile: refreshProfile,
    getProfile: getProfile
};

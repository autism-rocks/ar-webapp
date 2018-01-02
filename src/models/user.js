let userProfile = null;

let refreshProfile = () => webix.ajax('/ar/user/profile')
    .then((profile) => {
        userProfile = profile.json();
        return userProfile;
    })
    .catch((err) => {
        userProfile = null;
        throw err;
    });


let getProfile = () => new Promise((resolve, reject) => {
    if (userProfile) {
        resolve(userProfile);
    } else {
        refreshProfile().then(resolve).catch(reject);
    }
});


export default {
    refreshProfile: refreshProfile,
    getProfile: getProfile
};

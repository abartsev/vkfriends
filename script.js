VK.init({
    apiId:6253979
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error("Authentication failed"));
            }
        }, 2);

    });
    
}
function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
            VK.api(method, params, (data) => {
                if (data.Error) {
                    reject(data.Error);
                } else {
                    resolve(data.response);
                }
            })
    })
    
}
auth()
.then(() => {
    return callAPI('users.get', {name_case: 'gen'});
})
.then(([me]) => {
    const headerInfo = document.querySelector('#headerInfo');
    headerInfo.textContent - `Друзья на странице ${me.first_name} ${me.last_name}`;

    return callAPI('friends.get', {fields: 'city, country, photo_100'});
    
})
.then(friends => {
    console.log(friends);
    
});
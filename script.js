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
    headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

    return callAPI('friends.get', {fields: 'city, country, photo_100'});
    
})
.then(friends => {
    const template = document.querySelector('#user-template').textContent;
    const render = Handlebars.complite(template);
    const html = render(friends);
    const results = document.querySelector('#results');
    results.innerHTML = html;
    
});
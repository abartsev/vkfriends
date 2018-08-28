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
(async() => {
    try{
        await auth();
        const [me] = await callAPI('users.get', {name_case: 'gen'});
        const headerInfo = document.querySelector('#headerInfo');

        headerInfo.textContent = `Выберите друзей`;

        const friends = await callAPI('friends.get', {fields: 'photo_100'});
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#results');
        results.innerHTML = html;
        
    }
    catch (e){
        console.error(e);    
    }
})();

const source = document.querySelector('#results');
const target = document.querySelector('.target');

makeDnD([source, target]);
function makeDnD(zones) {
    let currentDrag;

    zones.forEach(zone => {
        zone.addEventListener('dragstart', (e) => {
            currentDrag = { source: zone, node: e.target };
        });

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        zone.addEventListener('drop', (e) => {
            if (currentDrag) {
                e.preventDefault();

                if (currentDrag.source !== zone) {
                    if (e.target.classList.contains('item')) {
                        zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                    } else {
                        zone.insertBefore(currentDrag.node, zone.lastElementChild);
                    }
                }

                currentDrag = null;
            }
        });
    })
}
const zone_plus = document.querySelector('.dndblock');
zone_plus.addEventListener('click', (e) => {
    if (e.target.className == "zone_plus") {
        if (e.target.parentNode.parentNode.className == 'friends') {
            target.appendChild(e.target.parentNode);
        }else{
            const friendsZone = document.querySelector('.friends');
            friendsZone.appendChild(e.target.parentNode);
        }
    }
})
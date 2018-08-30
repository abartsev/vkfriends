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

        const friends = await callAPI('friends.get', {fields: 'photo_100', count: "30"});

        localStorage.friend = JSON.stringify(friends);

        if (localStorage.friend) {
            renders(JSON.parse(localStorage.friend));
        } else {
            renders(friends); 
        }
    }
    catch (e){
        console.error(e);    
    }
})();
//вывод элементов на страницу
    function renders(obj){
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);

        const html = render(obj);
        const results = document.querySelector('#results');
        results.innerHTML = html;            
    }

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
const find = document.querySelector('.find');
const newfind = document.querySelector('.newfind');

//переброс пользователей по клику
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

// событие левого инпута
find.addEventListener('keyup', () => {
    const leftFriends = document.querySelector('.friends');
    
    search(leftFriends, find.value);
})

// событие правого инпута
newfind.addEventListener('keyup', () => {
    const rightFriends = document.querySelector('.target');
    
    search(rightFriends, newfind.value);
})

//перебор елементов в зоне при вводе в инпут
function search(obj, valueInput) {
    let frendObj = obj.childNodes;

    [...frendObj].reduce((result, curent) => {
        if (curent.nodeType !== 3) {
            const answer = compare(curent.childNodes[3].innerHTML, valueInput);

            if (answer) {
                curent.style.display = "flex";
            } else {
                curent.style.display = "none";
            }
        } 
        
        return result;
    }, {});
}
//поиск совпадение по имени и фамилии
function compare(elem1, elem2) {
    return (elem1.toLowerCase().indexOf(elem2.toLowerCase()) == -1 ) ? false : true;
}

const btnsave = document.querySelector('.save');

btnsave.addEventListener('click', (e) => {
    e.preventDefault;
    const Friends = [];
    Friends[0] = document.querySelector('.target');
    Friends[1] = document.querySelector('.friends');
     for (let i = 0; i < 2; i++) {
        localStorage.setItem("newFriend"+i, JSON.stringify(assembly(Friends[i])));      
     }
    
})

function assembly(obj) {
    let frendObj = obj.childNodes;
    const localFriends = JSON.parse(localStorage.friend);
    const newObj = {};
    let count = 0;
    newObj.items = [...frendObj].reduce((result, curent) => {
        if (curent.nodeType !== 3) {
            for (const key in localFriends.items) {
                if (localFriends.items.hasOwnProperty(key)) {                    
                    if (curent.getAttribute('id') == localFriends.items[key].id) {
                        result[count] = localFriends.items[key];
                    }
                }
            }           
        }
        count++;
        return  result;
    }, []);
 return newObj;
}
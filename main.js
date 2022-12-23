const setting = {
    option: { method: 'GET' },
    url: 'https://api.github.com/search/repositories',
    sort: 'stars',
    perPage: '5'
}

class Repo {
    constructor(name, owner, stars) {
        this.name = name;
        this.owner = owner;
        this.stars = stars;
    }
}
let state = [];

const searchEl = document.querySelector('.app');
const datalist = document.querySelector('.datalist');
const listRepo = document.querySelector('.answer');

async function repo(req) {
    const request = new Request(`${setting.url}?q=${req}+in:name+language:js&sort=${setting.sort}&per_page=${setting.perPage}`, setting.option);
    const response = await fetch(request);
    return response.json().then(data => data.items);
};

const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.call(this, ...args), delay);
    };
};

const newTagOption = (index, name) => {
    let newOption = document.createElement('option');
    newOption.value = index;
    newOption.innerHTML = name;
    datalist.appendChild(newOption);
};

const clearList = () => {
    state = [];
    while (datalist.firstChild) {
        datalist.removeChild(datalist.firstChild);
    };
};

const addCard = (data) => {
    let arrWord = ['name', 'owner', 'stars'];
    let newUl = document.createElement('ul');
    let newDiv = document.createElement('div');
    let newImg = document.createElement('img');
    let newMainDiv = document.createElement('div');
    newImg.srcset = './img/red-x-10340.svg';
    newImg.width = '20';
    newDiv.classList = 'rightSide';
    newMainDiv.classList = 'mainDiv';
    newUl.classList = 'leftSide';
    newDiv.appendChild(newImg);
    let index = Number(data);
    for (let i = 0; i < 3; i++) {
        let newLi = document.createElement('li');
        newLi.innerHTML = `${arrWord[i]}: ${state[index][arrWord[i]]}`;
        newUl.appendChild(newLi);
    }
    newMainDiv.appendChild(newUl);
    newMainDiv.appendChild(newDiv);
    listRepo.appendChild(newMainDiv);
};


const write = (e) => {
    if (e.inputType === 'insertReplacementText') {
        searchEl.value = '';
        addCard(e.data);
        clearList();
    } else {
        clearList();
        if (e.target.value) {
            repo(e.target.value).then(data => {
                data.map((el, i) => {
                    newTagOption(i, el.name);
                    state.push(new Repo(el.name, el.owner.login, el.stargazers_count));
                });
            });
        };
    }

};
searchEl.value = '';
searchEl.addEventListener('input', debounce(write, 400));
listRepo.addEventListener('click', (e) => e.target.parentElement.parentElement.remove());


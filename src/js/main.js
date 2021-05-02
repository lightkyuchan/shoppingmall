'use strict';

function loadJson(url) {
    //let strServer = 'http://127.0.0.1:5000/mainContents';
    return fetch(url)
    .then(res => res.json())
    .then(json => json)
    .catch(console.log);
}

function displayItem(items,container) {
    container.innerHTML = items.map(item => createStringHtml(item)).join('');        
}

function createStringHtml(item) {
    return `
        <li>
            <a href="#">
                <img src=${item.imgPath} alt="mainItem" id=${item.id}>
            </a>
        </li>
    `
}

function mainLoad() {
    const url = 'http://127.0.0.1:5000/mainContents';
    const container = document.querySelector('.mainSlider');        

    loadJson(url)
        .then(items => displayItem(items,container));
}

function onButtonClick() {    
    const parent = event.target.parentNode;
    let container = null;
    let isFlag = event.target.dataset.falg;
    let value = event.target.dataset.value;
    let width = 100;

    parent.childNodes.forEach(tag => {        
        if(tag.tagName === 'UL') { container = tag ; return; }
    });

    if(!isFlag) {
        value -= width;
        container.style.transform = `translate(${value}vw)`;
    }

    event.target.dataset.value = value;
  
}    

mainLoad();

    
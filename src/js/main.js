'use strict';

function loadJson() {
    let strServer = 'http://127.0.0.1:5000/mainContents';
    return fetch(strServer)
    .then(res => res.json())
    .then(json => json)
    .catch(console.log);
}

function displayItem(items) {
    //mainItem 
    const mainContainer = document.querySelector('.mainSlider');

    mainContainer.innerHTML = items.map(item => createStringHtml(item)).join('');        
}

function createStringHtml(item) {
    return `
        <li>
            <a href="#">
                <img src=${item.imgPath} alt="main1">
            </a>
        </li>
    `
}



loadJson()
    .then(items => displayItem(items))
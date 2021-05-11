'use strict';

function getMenu() {
    const getMenu = sessionStorage.getItem('menuArray');
    const menuArray = JSON.parse(getMenu);

    const getCategory = sessionStorage.getItem('category');
    const category = JSON.parse(getCategory);

    const getTitle = sessionStorage.getItem('menuTitle');

    return {
        menu: menuArray,
        category: category,
        title: getTitle
    }
}

function drawMenu() {
    const menuInfo = getMenu();
    
    const title = document.querySelector('.title');
    title.textContent = menuInfo.title;

    const menuList = document.querySelector('.menuList');
    menuList.innerHTML = menuInfo.menu.map(menu => createMenuHTML(menu)).join('');

    const list = document.querySelectorAll('.menuList > li');

    list.forEach(menu => {         
        if(menu.className === menuInfo.title) {
            menu.classList.add('select');            
        }
    })
}

function createMenuHTML(menu) {
    return `
        <li class=${menu}>${menu}</li>    
    `
}

async function loadJson(url) {
    const res = await fetch(`http://127.0.0.1:5000/${url}`)
    const data = await res.json();

    return data;
}

function productDraw() {
    const title = getMenu();

    loadJson(title.title)
        .then(item => {
            display(item);
            menuEvent();
        })
}

function display(item) {
    const container = document.querySelector('.productList');

    container.innerHTML = item.map(item => createProductHTML(item)).join('');
}

function createProductHTML(item) {
    return `
        <li>
            <img class=${item.type} onclick=productClick() src=${item.imgPath} alt="상품">
            <span class="productName">${item.name}</span>
            <span class="productprice">${item.price}</span>
            <span class="productSale">${item.sale}</span>
        </li>
    `
}

function menuEvent() {
    const container = document.querySelector('.menuList');
    const menu = document.querySelectorAll('.menuList > li')
    
    container.addEventListener('click', () => {
        menu.forEach(select => {
            select.classList.remove('select');            
        })

        event.target.classList.add('select');

        const str = event.target.className;                
        const removeName = str.replace('select','');
        
        loadJson(removeName.trim())
            .then(item => {
                display(item);
            })
    })
}

function productClick() {
    const img = event.target;
    const startIdx = 21;
    const lastIdx  = img.src.length - startIdx;
    const strImg = img.src.substr(startIdx, lastIdx);

    loadJson(img.className)
        .then(item => {
            item.forEach(img => {
                if(img.imgPath === strImg) {                                        
                    sessionStorage.setItem('product', JSON.stringify(img));
                    location.href = 'http://127.0.0.1:5500/src/html/product.html?';
                    return;
                }
            })
        })

}

drawMenu();
productDraw();

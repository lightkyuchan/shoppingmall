'use strict';

function getProduct() {
    const getProduct  = sessionStorage.getItem('product');
    const jsonToArray = JSON.parse(getProduct);
    
    return jsonToArray;
}

function productInfo() {
    const product = getProduct();
    const img     = document.querySelector('.productImg > img');
    const name    = document.querySelector('.productName > strong');    
    const price   = document.querySelector('.price');
    const sale    = document.querySelector('.sale');

    img.src           = product[0].imgPath;
    name.textContent  = product[0].name;
    price.textContent =  product[0].price;
    sale.textContent  =  product[0].sale;
}

const selectBox = document.querySelector('#productSize');

selectBox.addEventListener('click', () => {
    const idx   = selectBox.options.selectedIndex;    
    const value = selectBox.options[idx].value;
    
    if(value !== '') { 
        createOption(value);         
    }    
})

let sizeValue = '';
let copyData = [];
let valueArray = [];

function createOption(value) {
    const container = document.querySelector('.optionProduct');
    const data = getProduct();

    //사이즈는 총 4개뿐이라 제한두기 위한 것 
    const length = 4;
    
    if(sizeValue === '') {
        container.innerHTML = createStringHTML(data);
        sizeValue = value;               
        copyData.push(data);
        valueArray.push(value);
        
    } else {
        if(sizeValue !== value && copyData.length < length) {             
            sizeValue = value;            
            copyData.push(data);            
            container.innerHTML = copyData.map(data => createStringHTML(data)).join('');
            valueArray.push(value);
        }
    }

    const sizeAll = document.querySelectorAll('.sizeAndPrice > span');
    const up   = document.querySelectorAll('.up');  
    const down = document.querySelectorAll('.down');
    
    let count = 0;
    
    for(let value of sizeAll) {
        value.textContent = `-${valueArray[count]}`
        up[count].id = count;    
        down[count].id = count;    
        ++count;
    }
}

function countUp() {
    let num = 0;    
    const data = getProduct();

    const parent = event.target.parentNode;
    const input  = count(parent)    

    num = Number(input.value);
    ++num;
    input.value = num;
    
    let idx = Number(event.target.id);    
    
    const totalCount = document.querySelectorAll('#count');
    totalCount[idx].textContent = `(${num}개)`

    const totalPrice = document.querySelectorAll('.totalPrice');
    let sale = Number(data[0].sale.replace(/\,/g,''));    
    let price = totalPrice[idx].value.replace(/\원/g,'');
    price = Number(price.replace(/\,/g,''));    

    price += sale;
    price = addComma(price);
    totalPrice[idx].value = price;
}

function addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }

function count(parent) {
    let input = null;

    for(let value of parent.childNodes) {
        if(value.tagName === 'INPUT') {
            input = value;
            break;
        }
    }

    return input;
}


function countDown() {
    let num = 0;    
    const data = getProduct();
    const parent = event.target.parentNode;
    const input  = count(parent)    

    num = Number(input.value);
    --num;
    
    if(num < 1) { return; }

    input.value = num;
    
    let idx = Number(event.target.id);    
    
    const totalCount = document.querySelectorAll('#count');
    totalCount[idx].textContent = `(${num}개)`

    const totalPrice = document.querySelectorAll('.totalPrice');
    let sale = Number(data[0].sale.replace(/\,/g,''));    
    
    let price = totalPrice[idx].value.replace(/\원/g,'');
    price = Number(price.replace(/\,/g,''));    

    price -= sale;
    price = addComma(price);
    totalPrice[idx].value = price;
}

function createStringHTML(data) {
    
    return `
        <li>
          <span class="optionProductName">${data[0].name}</span><br/>

          <div class="sizeAndPrice">
            <span>-M</span>
            <div>
              <span>${data[0].sale}</span>
              <button class="del">x</button>
            </div>
          </div>

          <ul class="option">
            <li>
              <input type="text" class="productCount" placeholder="1" value="1">
              <button class="up" id="" onclick="countUp()">+</button>
              <button class="down" id="" onclick="countDown()">-</button>
            </li>
          </ul>

          <div class="total">
            <span>TOTAL : </span>
            <input type="text" class="totalPrice" value=${data[0].sale}원><span id="count">(1개)</span>
          </div>
        </li>
    `
}

const buy = document.querySelector('.buy');
buy.addEventListener('click', () => alert('구매했습니다'));

const cart = document.querySelector('.cart');
cart.addEventListener('click', () => {
    //넘길 것들
    //상품정보, 옵션(사이즈, 수량), 합계
    const select = document.querySelector('#productSize');
    const idx   = select.options.selectedIndex;    
    const value = select.options[idx].value;

    if(value === '') { 
        alert('필수 옵션을 선택해주세요');
        return;
    }    

    location.href = 'http://127.0.0.1:5500/src/html/cart.html?'
})

productInfo();

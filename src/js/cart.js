'use strict'

function getProduct() {
    const getProduct  = sessionStorage.getItem('product');
    const product    = JSON.parse(getProduct);

    const getPrice = sessionStorage.getItem('price');
    const price = JSON.parse(getPrice);

    const getCount = sessionStorage.getItem('count');
    const count = JSON.parse(getCount);

    const getSize = sessionStorage.getItem('size'); 
    const size = JSON.parse(getSize);
    
    return {
        item: product,
        price: price,
        count: count,
        size: size
    }
}

function cartInfo() {    
    const product   = getProduct();    
    const container = document.querySelector('.productInner');        
    
    container.innerHTML = product.price.map(price => createStringHTML(price, product.item, product.count, product.size)).join('');
    
    const expectedPrcie = document.querySelector('.expectedPrcie');
    const totalPrice    = document.querySelector('.totalPrice');

    expectedPrcie.textContent = product.price;
    totalPrice.textContent    = product.price;
}

function onDelete() {    
    if(window.confirm) { alert('삭제하시겠습니까?');}
    sessionStorage.clear();
}

function order() {
    alert('주문이 완료되었습니다.');
    location.href = 'http://127.0.0.1:5500/src/html/index.html?'
}

function seleteOrder() {
    const select = document.querySelector('.check');

    if(!select.checked) { alert('상품을 선택해주세요.'); return; }

    alert('주문이 되었습니다');
    
    sessionStorage.clear();

    location.href = 'http://127.0.0.1:5500/src/html/index.html?'
}


function createStringHTML(price, item, count, size) {        
    return `
    <li>
          <p>일반상품</p>
          <div class="infos">
            <div class="checkBoxAndimage">
              <input type="checkbox" class="check">
              <img src=${item[0].imgPath} alt="상품">            
          </div>

          <div class="info">
            <p class="productName">${item[0].name}</p>
            <p class="price">${price}</p>
              <div class="countInner">
                <button class="minus">-</button>
                <input type="text" value=${count}>
                <button class="plus">+</button>
              </div>
            </div>
          </div>
          <div class="option">
            옵션 : <span class="size">${size}</span>
          </div>
    
          <div class="total">합계: <span class="price">${price}</span></div>
    
          <div class="toggleBtns">
            <div>
              <button class="del" onclick="onDelete()" >삭제</button>
              <button class="productsOfInterest">관심상품</button>
            </div>        
            <div class="toggleBtnsOrder">
              <button onclick="order()">주문하기</button>
            </div>
          </div>
        </li>
    `
}

function start() {
    if(sessionStorage.length <= 1) { 
      alert('상품이 없습니다');
      location.href = 'http://127.0.0.1:5500/src/html/index.html';
      return; 
    }
    
    cartInfo();
}

start();
'use strict';

function loadJson(url) {    
    return fetch(url)
    .then(res => res.json())
    .then(json => json)
    .catch(console.log);
}

//container를 파라미터로 받아온 이유는 메인페이지에서 앞으로 구현될 내용들이
//비슷할거라고 예상되어서 받아옴 즉 container위치만 알면 그 아래 자식으로
//붙여줄수 있으니까
function displayItem(items,container) {
    container.innerHTML = items.map(item => createStringHtml(item)).join('');        
}

function createStringHtml(item) {        
    if(item.type === 'mainItem') {
        return `
            <li>
                <a href="#">
                    <img src=${item.imgPath} alt="mainItem" id=${item.id}>
                </a>
            </li>
        `
    } else {
        return `
            <li>
                <a href="#" class=${item.type}>
                  <img src=${item.imgPath} alt=${item.type}>
                </a>
                <span class="info">${item.name}</span>
                <span class="price">${item.price}</span>
                <span class="sale">${item.sale}</span>
            </li>
        ` 
    }
}

//메인배너
function mainLoad() {
    const url       = 'http://127.0.0.1:5000/mainContents';
    const container = document.querySelector('.mainSlider');        

    loadJson(url)
        .then(items => {                      
            displayItem(items,container)
        });
}

//메인배너
function prev(url, container,count,width,vwNum) {
    --count;
    width += vwNum;

    //참 많이 고민했던 부분!! 애초에 최초 로딩을할때 데이터를 전부 받게 되는데 
    //그때 복사해서 쓸까 말까 고민했었는데.. 데이터가 많아졌을 때 문제가 생기지 않을까
    //생각되었다.. 이를테면 최초로 로딩해서 데이터를 받고 있는 와중에 유저가
    //next나 prev버튼을 누르게된다면?? 그럼 복사해서 쓰려고했던 obj든 array든 
    //데이터가 없을 수 있을거같아서 이렇게 했다 유저가 클릭했을 시 해당 db를 다시
    //다운받는식이 안전하지 않을까 생각되어서 
    loadJson(url)
        .then(items => {
            if(count < 0 ) { width = -(items.length-1) * vwNum; count = items.length-1; }

            changeContainerWidth(container, count, width);      
        })
}

function next(url, container,count,width,vwNum) {
    ++count;
    width -= vwNum;
    
    loadJson(url)
        .then(items => {
            if(count >= items.length) { width = 0; count = 0; }
            
            changeContainerWidth(container, count, width);
        })
}

//메인배너
//prev와 next에서 처리되는 부분이 비슷하기에 최대한 코드 중복을 막기위해 따로 뺌
function changeContainerWidth(container, count, width) {
    container.style.transform = `translate(${width}vw)`;

    container.dataset.count = count;            
    container.dataset.width = width;         
}

//메인배너 
function onButtonClick() {               
    //각 버튼의 dbUrl를 주는 식으로 처리하면 db를 얻는게 더 수월하지 않나 생각되어서 
    const url    = `http://127.0.0.1:5000/${event.target.dataset.url}`;            
    //내가 찾고 싶은것은 버튼의 부모인 ul이다!!! why? ul의 width위치를 변경하니까
    const parent = event.target.parentNode;        

    let container = null;   
    //next버튼인지 prev버튼이지 확인하기위해 
    let isFlag    = event.target.dataset.flag;       
    
    for(let child of parent.childNodes) {
        if(child.tagName === 'UL') { container = child; break;}
    }    
    
    //next버튼을 누르면 ++count prev는 --count를 해서 0일때와 배너 이미지의 사이즈를 체크하고 
    //처리하기위해
    let count = container.dataset.count;        
    let width = Number(container.dataset.width);    
    //100vw씩 움직이기때문에 할당
    let vwNum = 100;
    
    if(isFlag === 'next') { next(url, container,count,width,vwNum) }
    if(isFlag === 'prev') { prev(url, container,count,width,vwNum) }    
}    

//자동 슬라이드(메인배너)
function autoSlideShow() {
    const mainContainer = document.querySelector('.mainSlider')
    const mainUrl       = 'http://127.0.0.1:5000/mainContents';    
    const vwNum         = 100;
    const ms            = 3000;   
    
    let width =  Number(mainContainer.dataset.width);  
    let count = mainContainer.dataset.count;

    loadJson(mainUrl) 
        .then(items => {
            setInterval(() => {
                ++count;                
                width -= vwNum;

                if(count >= items.length) { width = 0; count = 0; }

                changeContainerWidth(mainContainer, count, width);
            }, ms);
        })
}

// signature Item
let signatureItemLength = 0;
let siVwWidth           = 44;
let signatureBtnCount   = 0;
let siWidth             = 0;
//화민이 768이하일때 
let smallScreenWidth    = 768;

const largeVwWidth = 30;

function signatureItemLoad() {
    const url       = 'http://127.0.0.1:5000/signatureItem';
    const container = document.querySelector('.signatureSlide');      
    const width     = 300; 
    const margin    = 30;    

    loadJson(url)
        .then(items => {                      
            displayItem(items,container)
            container.style.width = (width + margin) * items.length - margin + 'px';   
            signatureItemLength   = items.length;   
        });
}

//아이템마다 length가 다를 수 있어서 아예 따로 만듬..
function onSignatureNextClick() {
    ++signatureBtnCount;
    const container = document.querySelector('.signatureSlide');    
     
    //화면이 768보다 작다면 실행     
    if(window.innerWidth <= smallScreenWidth) {           
        if(signatureBtnCount <= signatureItemLength -2) {
            siWidth += -siVwWidth;       
        } else {
            siWidth           = 0;
            signatureBtnCount = 0;
        }
    } else {             
        siWidth = -largeVwWidth;
        
        if(signatureBtnCount > 1) {
            siWidth           = 0;
            signatureBtnCount = 0;
        }
    }    

    subSlideShow(siWidth, container);
}

function onSignaturePrevClick() {
    --signatureBtnCount;   
    const container = document.querySelector('.signatureSlide');

    if(window.innerWidth < smallScreenWidth) {
        if(signatureBtnCount >= 0) {
            siWidth -= -siVwWidth;        
        } else {
            signatureBtnCount = signatureItemLength-2;
            siWidth           = -siVwWidth * (signatureItemLength-2);
        }
    } else {
        siWidth -= -largeVwWidth;
       if(signatureBtnCount < 0) {
            siWidth           = -largeVwWidth;
            signatureBtnCount = 1;
       }
    }

    subSlideShow(siWidth, container);
}

//suggestItem
let suggestItemLength   = 0;
let suVwWidth           = 44;
let sugnatureBtnCount   = 0;
let suWidth             = 0;

function suggestItemLoad() {
    const url       = 'http://127.0.0.1:5000/suggestItem';
    const container = document.querySelector('.suggestSlide');      
    const width     = 300; 
    const margin    = 30;    

    loadJson(url)
        .then(items => {                      
            displayItem(items,container)
            container.style.width = (width + margin) * items.length - margin + 'px';   
            suggestItemLength   = items.length;       
            console.log();  
        });
}

function onSuggestNextClick() {
    ++sugnatureBtnCount;
    const container = document.querySelector('.suggestSlide');    
     
    if(window.innerWidth <= smallScreenWidth) {        
        if(sugnatureBtnCount <= suggestItemLength -2) {
            suWidth += -suVwWidth;                
        } else {
            suWidth           = 0;
            sugnatureBtnCount = 0;
        }
    } else {             
        suWidth = -largeVwWidth;
        
        if(sugnatureBtnCount > 1) {
            suWidth           = 0;
            sugnatureBtnCount = 0;
        }
    }    

    subSlideShow(suWidth, container);
}

function onSuggestPrevClick() {
    --sugnatureBtnCount;   

    const container = document.querySelector('.suggestSlide');    
    if(window.innerWidth < smallScreenWidth) {
        if(sugnatureBtnCount >= 0) {                        
            suWidth -= -suVwWidth;       
            console.log(suWidth);
        } else {
            sugnatureBtnCount = suggestItemLength-2;
            suWidth           = -suVwWidth * (suggestItemLength-2);
        }
     } else {
         suWidth -= -largeVwWidth;
        if(sugnatureBtnCount < 0) {
             suWidth           = -largeVwWidth;
             sugnatureBtnCount = 1;
        }
    }

    subSlideShow(suWidth, container);
}

function subSlideShow(width, container) {
    container.style.transform = `translate(${width}vw)`;
}

mainLoad();
signatureItemLoad();
suggestItemLoad();
autoSlideShow();
sideEventListner();
sessionStorageTest();

function sessionStorageTest() {    
    const data = sessionStorage.getItem('user');
    const user = JSON.parse(data);
}

//sidebar open
const mainToggleBtn = document.querySelector('.navMenu');
const closeBtn      = document.querySelector('.close');
const sideMenu      = document.querySelector('.sideBar');
const sideVwWidth   = 100;

mainToggleBtn.addEventListener('click', () => {
    sideMenu.style.left          = 0;
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () =>{
    sideMenu.style.left          = -sideVwWidth + 'vw';
    document.body.style.overflow = 'scroll';
});

function sideEventListner() {    
    const subMenu = document.querySelectorAll('.sideSubMenu');    
    const mainMenu = document.querySelectorAll('.mainMenu');        

    for(let i=0; i< mainMenu.length; ++i) {
        mainMenu[i].addEventListener('mouseover', () =>{
            subMenu[i].style.height = subMenu[i].scrollHeight + 'px';
        })
        
        mainMenu[i].addEventListener('mouseout', () => {
            subMenu[i].style.height = 0;
        })        
    }
}

//상세화면 index.html에서 상세화면으로 상품 넘겨주기까지
const signatureItem = document.querySelector('.signatureSlide');
const suggestItem   = document.querySelector('.suggestSlide');

signatureItem.addEventListener('click', () => {    
    //상품의 liTag
    const parent = event.target.parentNode.parentNode;

    const imgTag = getImg(parent);
    
    getItem(imgTag)
        .then(item => {
            sessionStorage.setItem('product', JSON.stringify(item));
            location.href = 'http://127.0.0.1:5500/src/html/product.html?';
        })
})

suggestItem.addEventListener('click', () => {    
    const parent = event.target.parentNode.parentNode;

    const imgTag = getImg(parent);
    
    getItem(imgTag)
    .then(item => {
        sessionStorage.setItem('product', JSON.stringify(item));
        location.href = 'http://127.0.0.1:5500/src/html/product.html?';
    })
})

function getImg(parent) {
    //liTag > aTag
    let child = null;
    //aTag > imgTag
    let imgTag = null;

    for(let value of parent.childNodes) {
        if(value.tagName === 'A') {            
            child = value;
        }
    }

    for(let img of child.childNodes) {
        if(img.tagName === 'IMG') {
            imgTag = img;            
        }
    }

    return imgTag;
}

async function getItem(imgTag) {
    const strImg = imgTag.src;
    const type = imgTag.alt;    
    const startIdx = 21;
    const lastIdx  = imgTag.src.length - startIdx;

    //아이템 검색에 필요한 img string 얻기
    //ex /img/signatureItem1.png
    const imgUrl = imgTag.src.substr(startIdx, lastIdx)
    
    let url = `http://127.0.0.1:5000/${type}`

    let res = await fetch(url);
    let data = await res.json();

    let product = data.filter( item => item.imgPath === imgUrl )
    
    return product;
}

const cart = document.querySelector('#cart');
cart.addEventListener('click', () => location.href = 'http://127.0.0.1:5500/src/html/cart.html?')

//사이드바 sub메뉴 클릭
const category = document.querySelectorAll('.sideSubMenu > li > a');
let menuArray = null;

for(let i=0; i<category.length; ++i) {
    category[i].addEventListener('click', () => {        
        menuArray = getMenu(category[i]);               
        
        sessionStorage.setItem('menuTitle',  category[i].dataset.value);
        sessionStorage.setItem('category',  category[i].dataset.category);        
        sessionStorage.setItem('menuArray', JSON.stringify(menuArray));       
        
        location.href = 'http://127.0.0.1:5500/src/html/list.html?';
    })
}

//각 카테고리의 형제노드들 
//man 이라는 부모태그의 a b자식 노드가 있고, a를 클릭했을 때 b노드도 넘겨주기위해
function getMenu(category) {
    //a > li > parent
    const parent = category.parentNode.parentNode;
    
    //parent노드의 안보이는 text 자식이 있기때문에 거르기    
    //list에서 보여질 메뉴들(a > li의 형제노드들)
    
    const menu = [];
    
    for(let child of parent.childNodes) {
        if(child.tagName === 'LI') {
            for(let i of child.childNodes) {                
                menu.push(i.textContent);
            }
        }
    }

    return menu;
}



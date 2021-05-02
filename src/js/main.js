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
    return `
        <li>
            <a href="#">
                <img src=${item.imgPath} alt="mainItem" id=${item.id}>
            </a>
        </li>
    `
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


//지금 메인페이지에 비슷한 내용으로 3개가있다. 메인배너와 두개의 배너
//거기에 next와 prev버튼이 붙어있기때문에 이거 한개로 다음 3개를 써먹기위해
//구현하였음
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

//prev와 next에서 처리되는 부분이 비슷하기에 최대한 코드 중복을 막기위해 따로 뺌
function changeContainerWidth(container, count, width) {
    container.style.transform = `translate(${width}vw)`;

    container.dataset.count = count;            
    container.dataset.width = width;         
}


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

//자동 슬라이드
function slideShow() {
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

mainLoad();
slideShow();

const section = document.querySelector('section');
const addMemoBtn = document.querySelector('.addMemoBtn');
let tempMemo = [];
let i = 0;


function loadLsMemo(){
    const loadedItem = JSON.parse(localStorage.getItem('memo__LS'));

    for(let i = 0; i < loadedItem.length; i++){
        tempMemo.push(loadedItem[i]);
    } // array로 푸쉬되는게 아니라, 각 text별로 푸쉬되도록  하기위해 for문 사용
    loadedItem.forEach((e) => {
        displayMemo(e);
    })
}

function saveLsMemo(text){
    localStorage.setItem('memo__LS', JSON.stringify(text))
}

function displayMemo(text){
    
    const div = document.createElement('div');
    div.setAttribute('class', 'myMemo');
    div.setAttribute('data-id', i);
    div.innerHTML = `
    <div class="myMemo__header">
        <button class="editMemoBtn" data-id="${i}"><i class="fas fa-edit" data-id="${i}"></i></button>
        <button class="delMemoBtn" data-id="${i}"><i class="fas fa-trash-alt" data-id="${i}"></i></button>
    </div>
    <div class="articleContainer">
        <div class="holdEdit" data-id="${i}"></div>
        <textarea class="myMemoArticle" cols="30" rows="30">${text ? text : ""}</textarea>
    </div>
    `

    const editMemoBtn = div.querySelector('.editMemoBtn');
    editMemoBtn.addEventListener('click',onClickEditMemoBtn);
    
    const delMemoBtn = div.querySelector('.delMemoBtn');
    delMemoBtn.addEventListener('click', onClickDelMemoBtn);

    const articles = document.querySelectorAll('.myMemo');
    const myMemoArticle = div.querySelector('.myMemoArticle')
    
    myMemoArticle.addEventListener('keyup', () => {
    tempMemo[articles.length] = myMemoArticle.value;
    saveLsMemo(tempMemo);

    const myMemo__header = document.querySelector('.myMemo__header')
    myMemo__header.addEventListener('click', (event) => {
        if(event.target.matches('.delMemoBtn')){
            onClickDelMemoBtn(event)
        } else if(event.target.matches('.editMemoBtn')){
            onClickEditMemoBtn(event)
        }
})


    // 필기 point1)
    // 메모1의 저장까진 성공,
    // 근데 메모 2,3,4,5,.. 입력시 각각이 어떻게 안겹치게 저장시킬 것인가? ['abc', 'def']
    // 추가하고 일일이 앞에 과정은 shift로 뺴주는 등 많은 시도를 다해봤찌만,
    // 정답은 tempMemo[0], tempMemo[1]... 처럼, 배열의 element 순서를 직접언급하고, 그 내용을 확정시킬 수 있다는 것을 활용!
    // 그리고, 그 안의 숫자는 지금 memo의 숫자를 알려주는 articles.length를 활용!

})
    section.appendChild(div);
    console.log(`create:${i}`)
    i++
}

function onClickEditMemoBtn(event){
    const id = event.target.dataset.id;
    const toHoldTyping = document.querySelector(`.holdEdit[data-id = "${id}"]`)
    toHoldTyping.classList.toggle('hold')
}

function onClickDelMemoBtn(event){
    
    const id = event.target.dataset.id;
    const toBeDelete = document.querySelector(`.myMemo[data-id = "${id}"]`)
    toBeDelete.remove();
    
    // localstorage에 삭제내용 저장 //
    tempMemo.splice(id, 1);
    console.log(`delete:${id}`)
    saveLsMemo(tempMemo);
    i-- 
}
// 
addMemoBtn.addEventListener('click', () => {
    displayMemo();
});


loadLsMemo();


// 필기 point2) li 등 컨텐츠를 만들고 appendChild 하는 이른바 만들어 붙이기의 경우,
// eventListener의 콜백함수를 미리 만들어 둔 뒤, li 등 컨텐츠를 만들때 한번에 붙인채로 출고시키는 것이 좋다.
// 아니면 나중에 복잡해져서 뭐가뭔지 모르게됨. 
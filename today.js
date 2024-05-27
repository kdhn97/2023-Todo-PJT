const todoInputElem = document.querySelector('.input');
const todoListElem = document.querySelector('.list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');//전체 완료 처리
const leftItemsElem = document.querySelector('.left-items')//남은 메모 개수 표시
const showAllBtnElem = document.querySelector('.show-all-btn');	// All 버튼 
const showActiveBtnElem = document.querySelector('.show-active-btn');// Active 버튼
const showCompletedBtnElem = document.querySelector('.show-completed-btn');// Completed 버튼
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');// Completed Clear 버튼

let id = 0;
const setId = (newId) => {id = newId};

let isAllCompleted = false; // 전체 todos 체크 여부
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = 'all'; // all  | active | complete
const setCurrentShowType = (newShowType) => currentShowType = newShowType

let todos = []; //메모들을 담을 배열
const setTodos = (newTodos) => {
    todos = newTodos;
}
const getAllTodos = () => {
    return todos;
}
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true );
}
const getActiveTodos = () => {// 현재 완료되지 않은 메모리스트를 반환
    return todos.filter(todo => todo.isCompleted === false);
}
const setLeftItems = () => {//남은 메모 개수를 표시
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} 개 메모`
}
const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos)
}
const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos)
}// 전체 todos의 check 여부 (isCompleted)
const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}
const onClickCompleteAll = () => {
    if(!getAllTodos().length) return; // todos배열의 길이가 0이면 return;

    if(isAllCompleted) incompleteAll(); // isAllCompleted가 true이면 todos를 전체 미완료 처리 
    else completeAll(); // isAllCompleted가 false이면 todos를 전체 완료 처리 
    setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
    paintTodos(); // 새로운 todos를 렌더링
    setLeftItems()// 남은 할 일 개수 표시
}
const appendTodos = (text) => {
    const newId = id + 1; // 기존에 i++ 로 작성했던 부분을 setId()를 통해 id값을 갱신하였다.
    setId(newId)
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text})
    /*id : number 타입, 할 일의 유니크한 키 값
      isCompleted :  boolean 타입, 할 일의 완료상태
      content : string 타입, 할 일의 내용*/
    setTodos(newTodos)
    setLeftItems()
    checkIsAllCompleted();// 전체 완료처리 확인
    paintTodos();
}
const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    setLeftItems()
    paintTodos()
}
const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
    setLeftItems()
    checkIsAllCompleted();//전체 todos의 완료 상태를 파악하여 전체 완료 처리 버튼 CSS 반영
}
const updateTodo = (text, todoId) => {
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}
const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId);// todo 수정
            document.body.removeEventListener('click', onClickBody );// 이벤트리스너 제거
        }
    })
    const onClickBody = (e) => { // todoItemElem 요소를 제외한 영역을 클릭 시, 수정모드 종료
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    document.body.addEventListener('click', onClickBody)// body에 클릭에 대한 이벤트 리스너 등록
    todoItemElem.appendChild(inputElem);// todoItemElem 요소에 자식 요소로 inputElem 요소 추가
}
const clearCompletedTodos = () => {
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
}
const paintTodo = (todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('item');
    todoItemElem.setAttribute('data-id', todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))// 'click'이벤트 발생 시, 완료 처리

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))// 더블 클릭에 대한 이벤트 핸들러
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))// 'click'이벤트 발생 시, 해당 할 일 삭제
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }
    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);
    todoListElem.appendChild(todoItemElem);
}
const paintTodos = () => {
    todoListElem.innerHTML = '';//todoListElem 요소 안의 HTML 초기화

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}
const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected')
    setCurrentShowType(newShowType)
    paintTodos();
}
const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{ //keypress : 입력할 수 있는 키보드(영어, 숫자 등)가 눌렸을 때 발생하는 이벤트
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })
    completeAllBtnElem.addEventListener('click',  onClickCompleteAll);// 전체 완료 처리 버튼에 클릭 이벤트 리스너 
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click',onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click',onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);
    setLeftItems()
}
init() //today.js파일이 실행되자마자 호출되는 함수
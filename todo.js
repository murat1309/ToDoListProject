//Tüm elementleri seçmek
const form  = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBOdy = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(e){ //Tüm event Listenerlar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI); 
//DOMContentLoaded eventi -> sayfa yüklendiğinde bu event aktif oluyordu.
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);  //Tuşubıraktığın an aramaya başlasın
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(){
    //Arayüzden Todoları Temizleme.

    if(confirm("Tümünü silmek istediğinizden emin misiniz ? ")){ //ok basarsa brası true olucak.
        //todoList.innerHTML = ""; //yavaş;
        
        while(todoList.firstElementChild != null) { //ul'nin ilk çocuğu(li) silcez.null olmadığı müddetçe ilk elemanı sil

            todoList.removeChild(todoList.firstElementChild);
        } 
        
        localStorage.removeItem("todos"); //localstorage'dan da sildik.
     
    }
}

function filterTodos(e){

    const filterValue = e.target.value.toLowerCase(); //arama kutumuzun içindeki yazıları küçük harfe çevirdik.
    const listItems = document.querySelectorAll(".list-group-item"); //tüm li'lerimizi seçtik.

    listItems.forEach(function(item){
        const text = item.textContent.toLowerCase(); //elimizde li'lerin küçültülmüş isimleri var artık.

        if(text.indexOf(filterValue) === -1){ //text'in içinde filterValue değeri yoksa -1 döner.
            item.setAttribute("style","display : none !important"); //gösterme dedik. !important -> benim dediğim olsun.
        }
        else{
            item.setAttribute("style","display : block"); //sayfada göster.
        }
    });
}
function deleteTodo(e){

    //console.log(e.target); nereye tıklandı bilgisini alabiliyorduk.

    if(e.target.className === "fa fa-remove"){

        e.target.parentElement.parentElement.remove(); //2 üst parent'ına çıktık li'ye ulaşabilmek için.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); //li'nin yazısını silinecek methoda gönderdik.
        showAlert("success","Todo başarıyla silindi.");
    }
}

function deleteTodoFromStorage(deletetodo){

    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){

        if(todo === deletetodo){
            todos.splice(index,1); //Arrayden veri silme
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}
function loadAllTodosToUI(){

    let todos = getTodosFromStorage(); //Arrayimizi aldık.

    todos.forEach(function(todo){ //arrayimizdeki her bir değeri arayüze ekle methodumuza gönderdik.
        addTodoUI(todo);
    })
}

function addTodo(e){

    const newTodo = todoInput.value.trim();
    const listItems = document.querySelectorAll(".list-group-item");
    let control = true;


    if(newTodo === ""){
                                                                /*
                                                                <div class="alert alert-danger" role="alert">
                                                                    This is a danger alert—check it out!
                                                                </div> 
                                                                */
        
        showAlert("danger","Lütfen bir todo girin...");
    }
    
    else{

        listItems.forEach(function(listItem){
            
            if(newTodo === listItem.textContent){
                showAlert("warning","Girdiğiniz Todo daha önceden Oluşturulmuştur...");
                control = false;

            }
        })

        if(control){ //true olarak gelirse eşitlik yok demektir. Eşitlik olsaydı false gelirdi.
 
        addTodoUI(newTodo);
        addTodoToStorage(newTodo);

        showAlert("success","Başarıyla eklendi..");
        }

    }
    
    
    e.preventDefault();
}
function getTodosFromStorage(){ //Storage'dan bütün Todoları almış olucak.

    let todos;

    if(localStorage.getItem("todos") === null){ //yoksa boş bi şekilde başat. Varsa ona sahip ol.

        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos")); //String olarak yazıldığı için ben bunu array'e çevirdim.

    }
    return todos;
}
function addTodoToStorage(newTodo){

   let todos = getTodosFromStorage();

   todos.push(newTodo);

   localStorage.setItem("todos",JSON.stringify(todos)); //arraylerimizi sringe çevirmek için.
}

function showAlert(type,message){

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBOdy.appendChild(alert);
    
    //setTimeout
    setTimeout(function(){ // 1 saniye sonra burası çalışıcak. Yani ben alertim eklendikten bir saniye sonra silinmesini istiyorum.
            alert.remove();
    },1000);
    
    
}

function addTodoUI(newTodo){ //String değerini list item olarak UI'ya ekleyecek.

/**
                <!-- <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>-->
 */

 //List Item oluşturma...
 const listItem = document.createElement("li");
 //Link oluşturma...
 const link = document.createElement("a");
 link.href="#";
 link.className = "delete-item";
 link.innerHTML = "<i class ='fa fa-remove'></i>";

 listItem.className = "list-group-item d-flex justify-content-between";

 //TextNode ekleme

 listItem.appendChild(document.createTextNode(newTodo));
 listItem.appendChild(link);
 
 //Todo List'e ListItem'ı ekleme.
 
 todoList.appendChild(listItem);
 todoInput.value = "";


 console.log(listItem);
}
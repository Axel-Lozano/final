const Clickbutton = document.querySelectorAll(`.button`);
const tbody =document.querySelector(`.tbody`)
let carrito = [];

function addToCarritoItem(e){
    const button = e.target;
    const item = button.closest(`.card`);
    const itemTitle = item.querySelector(`.card-title`).textContent;
    const itemPrice = item.querySelector(`.precio`).textContent;
    const itemImg = item.querySelector(`.card-img-top`).src;

    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem)
}


function addItemCarrito(newItem){

    Toastify({
        text: "Añadido con exito",
        duration: 1500,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true,
        style: {
            background: "blue", 
        },
        onClick: function(){}
    }).showToast();

    const InputElemento = tbody.getElementsByClassName(`input__elemento`)
    for(let i = 0; i < carrito.length ; i++ ){
        if(carrito[i].title.trim() === newItem.title.trim()){
            carrito[i].cantidad ++;
            const inputValue = InputElemento[i]
            inputValue.value++
            CarritoTotal()
            return null;
        }
    }
    carrito.push(newItem)
    renderCarrito()
    CarritoTotal()
}

function renderCarrito() {
    tbody.innerHTML = ``
    carrito.map(item => {
        const tr = document.createElement(`tr`)
        tr.classList.add(`ItemCarrito`)
        const Content = `
        <tr>
            <th scope="row">1</th>
            <td class="table__productos">
                <img src=${item.img} alt="">
                <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
                <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">x</button>
            </td>
        </tr>
        `
        tr.innerHTML = Content
        tbody.append(tr)

        tr.querySelector(`.delete`).addEventListener(`click`, removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener(`change` , sumaCantidad)
    })

    CarritoTotal()
}

Clickbutton.forEach(btn => {
    btn.addEventListener(`click`, addToCarritoItem)
})

function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector(`.itemCartTotal`)
    carrito.forEach((item) => {
        const precio = Number (item.precio.replace("$", ``))
        Total = Total + precio*item.cantidad
    })

    itemCartTotal.innerHTML = `Total $${Total}`
    addLocalStorage()
}

function removeItemCarrito(e) {
    const buttonDelete = e.target;
    const tr = buttonDelete.closest(".ItemCarrito");
    const title = tr.querySelector(`.title`).textContent;
    for(let i = 0; i < carrito.length ; i++){

        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
        }
    }

    Toastify({
        text: "Removido con exito",
        duration: 1500,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true,
        style: {
            background: "blue", 
        },
        onClick: function(){}
    }).showToast();

    tr.remove()
    CarritoTotal()
    
}

function sumaCantidad(e){
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector(`.title`).textContent
    carrito.forEach(item => {
        if(item.title.trim() === title){
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value
            item.cantidad = sumaInput.value
            CarritoTotal()
        }
    })
}

function addLocalStorage(){
    localStorage.setItem(`carrito`, JSON.stringify(carrito))
}

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem(`carrito`))
    if(storage){
        carrito = storage
        renderCarrito()
    }
}

async function obtenerInfo(){
    let response
    let data
    try {
        response = await fetch("https://62e85f8c249bb1284eadb91e.mockapi.io/api/articles")
        data = await response.json()
    } catch (error) {
        console.log(error)
    }
    console.log(data)
}

obtenerInfo()

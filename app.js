let navBarButton = document.querySelector('#navBar');
let p = document.querySelectorAll('p')
let sideBar = document.querySelector('#sideBar');
let home = document.querySelector('#home');
let navBar = document.querySelector('#navBar');
let cart = document.querySelector('#cart');
let searchBar = document.querySelector('#searchBar');
let overlay = document.querySelector('#overlay');
let productsDiv = document.querySelector('#products')
let cartBar = document.querySelector('#cartBar');
let cartButton = document.querySelector('#cartButton');
let cartContainer = document.querySelector('#cartContainer');
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
let precioFinal = document.querySelector('#precioFinal')

document.addEventListener('DOMContentLoaded', function(){
    searchBar.focus();
    homePageProducts(products);
    carItemsOnLoad();
    showPrice();
})

let showPrice = () => {
    let price = 0;
    cartItems.map((item) => {
        price += item.precio
    })
    price = Math.round(price*100)
    precioFinal.textContent = "$"+(price/100)
}

let carItemsOnLoad = () => {
    cartItems.forEach(product => {
        loadToCart(product.nombre, product.precio, product.imagen, product.talles, product.id, product.cant)
    })
}

overlay.addEventListener('click', function(){
    if(overlay.style.display === 'block'){
        sideBar.style.display = 'none'
        overlay.style.display = 'none'
        cartBar.style.display = 'none'
        searchBar.focus()
    }
})

navBarButton.addEventListener('click', function(){
    if(sideBar.style.display === 'none'){
        overlay.style.display = 'block';
        sideBar.style.display = "block";

        p.forEach(element => {
            element.style.display = "block"
        });

    } else {
        overlay.style.display = 'none';
        sideBar.style.display = "none"

        p.forEach(element => {
            element.style.display = "none"
        });
    }
})

cartButton.addEventListener('click', function(){
    openCart();
})

let homePageProducts = (array) => {
    array.forEach((product, index, array) => {       
        loadProducts(product, productsDiv, product.id, index, array);
    })
}

let openCart = () => {
    if(cartBar.style.display === "none"){
        overlay.style.display = 'block';
        cartBar.style.display = "block";
    } else {
        overlay.style.display = 'none';
        cartBar.style.display = "none";
    }
}

let loadProducts = (product, container, id, index, array) => {
    let div = document.createElement('div');
    div.className = "col-2 m-5 shadow rounded d-flex flex-column justify-content-center align-items-center border"

    div.innerHTML = 
        `   <img src="${product.imagen}" width="150px" class="shadow rounded border m-4" alt="">
            <h6 class="text-center m-2 bg-black text-white rounded shadow p-2">${product.nombre}</h6>
            <div class="talle d-flex flex-row justify-content-cemter align-items-center" id="${id}">
                        <p class="text-center m-2 bg-ligth text-black rounded shadow p-2">$${product.precio}</p>
            </div>
        `; 
    div.style.backgroundColor = "#f7f7f7"
    container.appendChild(div);
    let tallesDiv = document.querySelector(`#${id}`);
    let carrito = document.createElement('i');

    carrito.className = "fa-solid fa-cart-shopping pt-2 pb-2 ps-2 pe-2 text-black bg-success m-3 rounded shadow";
    carrito.addEventListener('click', function(){
        Toastify({
            text: "Añadido al carrito",
            duration: 1500,
            gravity: "top", 
            position: "right",
            close: true,
            stopOnFocus: false,
            style: {
                background: "linear-gradient(to right, #434343, #000000)",
                color: "white",
                },
            onClick: function(){
                if(cartBar.style.display === "none"){
                    overlay.style.display = 'block';
                    cartBar.style.display = "block";
                } else {
                    overlay.style.display = 'none';
                    cartBar.style.display = "none";
                }
            },
        }).showToast();
        if(cartItems.some(item => item.id.includes(id))){
            let cartNew = cartItems.filter(item => item.id === id)
            let cantidad = cartNew[0].cant + 1
            cartItems.map(item => {
                if(item.id === id){
                    item.cant = cantidad
                }
            })
        } else {
            cartItems.push(array[index]);

            cartItems.map(item => {
                if(item.id === array[index].id){
                    item.cant = 1
                }
            })
            loadToCart(product.nombre, product.precio, product.imagen, product.talles, id, product.cant);
        }
        showPrice()
        saveStorage();
    })
        tallesDiv.appendChild(carrito);
}

let loadToCart = (product, price, img, talle, id, cant) => {

    let cartElement = document.createElement('div');
    cartElement.className = "col-12 row shadow-sm m-0 mt-2 mb-2 rounded p-2"
    cartElement.style.backgroundColor = "#f7f7f7"
    cartElement.innerHTML = `
                    <div class="col-6">
                        <img src="${img}" height="150px" class="rounded shadow-sm">
                    </div>
                    <div class="col-6 column p-2" id="divCant${id}">
                        <h6>${product}</h6>
                        <p>$${price}</p>
                        <div class="col-6 d-flex flex-row justify-content-between align-items-center border rounded shadow-sm cantDiv p-0" id="divBtn${id}">
                            <button id="buttonLess${id}" class="p-2 border-0 me-2 rounded">-</button>
                            <p class="p-2  border-0 m-0 me-2">${cant}</p>
                            <button id="buttonPlus${id}" class="p-2 border-0 rounded">+</button>
                        </div>
                    </div>`;
    
    
    // document.createElement('div');
    // div1.className = ""
    
    setTimeout(() => {
        let trash = document.createElement('i');
        trash.className = "fa-solid fa-trash border-0 rounded p-2";
        trash.addEventListener('click', function(){
        cartElement.remove()
        let cartNew = cartItems.filter(items => items.id != id)
        cartItems = cartNew;
        saveStorage()
        showPrice()
    })
        let divi = document.querySelector(`#divCant${id}`);
        let divi2 = document.querySelector(`#divBtn${id}`)
        divi2.appendChild(trash)
        divi.appendChild(divi2)
        cartElement.appendChild(divi)
    },500)
    cartContainer.appendChild(cartElement);
}

let saveStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
}

searchBar.addEventListener('input', function(){
    productsDiv.innerHTML = "";
    let searchOutput = products.filter(item => item.nombre.toLowerCase().includes(searchBar.value.toLowerCase()))
    if(searchOutput.length > 0){
        homePageProducts(searchOutput)
    } else {
        let message = document.createElement('p');
        message.textContent = `No products for "${searchBar.value}"`
        message.className = "text-center"
        productsDiv.appendChild(message)
    }
})
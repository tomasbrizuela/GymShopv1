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
console.log(cartItems)


document.addEventListener('DOMContentLoaded', function(){
    searchBar.focus();
    homePageProducts(products);
    carItemsOnLoad();
})

let carItemsOnLoad = () => {
    cartItems.forEach(product => {
        loadToCart(product.product, product.precio, product.img, product.talle)
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
    array.forEach((product) => {       
        loadProducts(product, productsDiv, product.id);
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

let loadProducts = (product, container, id) => {
    let div = document.createElement('div');
    div.className = "col-3 m-5 shadow rounded d-flex flex-column justify-content-center align-items-center border"

    div.innerHTML = 
        `   <img src="${product.imagen}" width="150px" class="shadow rounded border m-4" alt="">
            <h6 class="text-center m-2 bg-black text-white rounded shadow p-2">${product.nombre}</h6>
            <p class="text-center m-2 bg-ligth text-black rounded shadow p-2">Price: $${product.precio}</p>
            <div class="talle d-flex flex-row justify-content-cemter align-items-center" id="${id}">
            </div>
        `; 

    container.appendChild(div);
    let tallesDiv = document.querySelector(`#${id}`);

    let tallesArray = product.talles;
    tallesArray.forEach(talle => {
        let talleDiv = document.createElement('p');
        talleDiv.className = "p-1 ps-2 pe-2 text-white m-3 rounded tallesButton";
        talleDiv.textContent = talle.toLocaleUpperCase();
        talleDiv.addEventListener('click', function(){
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
            loadToCart(product.nombre, product.precio, product.imagen, talle, id);
            cartItems.push({
                "product": product.nombre,
                "precio": product.precio,
                "img": product.imagen,
                "talle": talle.toLocaleUpperCase()
            })
            saveStorage();
        })
        tallesDiv.appendChild(talleDiv)
    })
}

let loadToCart = (product, price, img, talle, id) => {
    let cartElement = document.createElement('div');
    cartElement.className = "col-12 row"

    cartElement.innerHTML = `
                    <div class="col-6">
                        <img src="${img}" height="150px">
                    </div>
                    <div class="col-6 column p-2">
                        <h6>${product}</h6>
                        <p>${talle}</p>
                        <p>${price}</p>
                        <div class="d-flex flex-row col-12" id="remove${id}">
                            
                        </div>
                    </div>`;
    
    cartContainer.appendChild(cartElement);
    console.log(cartItems)
}

let saveStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
}


searchBar.addEventListener('input', function(){
    productsDiv.innerHTML = "";
    let searchOutput = products.filter(item => item.nombre.toLowerCase().includes(searchBar.value.toLowerCase()))

    if(searchOutput.length > 0){
        homePageProducts(searchOutput)
        console.log("Aca")
    } else {
        let message = document.createElement('p');
        message.textContent = `No products for "${searchBar.value}"`
        message.className = "text-center"
        productsDiv.appendChild(message)
    }
})
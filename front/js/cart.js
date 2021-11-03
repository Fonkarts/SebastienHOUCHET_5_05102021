/* --------------------------------------------------------------- */
/* ----- RECUPERATION INFOS LOCAL STORAGE ET AFFICHAGE PANIER ---- */
/* --------------------------------------------------------------- */

const cartTotalQty = document.getElementById("totalQuantity");
const deleteButton = document.querySelector(".deleteItem");


if(localStorage.length == 0) {
    document.querySelector("#cart__items > article").textContent = "Votre panier est vide !";
} else {
    let n=1; // Création d'articles supplémentaires selon le nombre de produits sélectionnés
    while(n < localStorage.length) {
        const cartItem = document.querySelector("#cart__items > article").cloneNode(true);
        document.getElementById("cart__items").appendChild(cartItem);
        n++;
    }
}

let totalQtySum = 0;
let totalPriceSum = 0;

for(let i=0; i<localStorage.length; i++) {
    let thisProduct = JSON.parse(localStorage.getItem("storedProduct" + i));
    totalQtySum += parseInt(thisProduct.qty); 
}
cartTotalQty.textContent = totalQtySum;


for(let i=0; i<localStorage.length; i++) { 

    let storedProduct = JSON.parse(localStorage.getItem("storedProduct" + i));
    // Envoi de requêtes GET uniquement pour les produits de l'API stockés dans le localStorage (via ID)
    fetch("http://localhost:3000/api/products/" + storedProduct.id)
        .then(function(res) {
            if(res.ok) {
                return res.json(); // Vérification du résultat
            }
        })
        .then(function(value) {
            const cartImage = document.querySelectorAll(".cart__item__img > img")[i];
            const cartName = document.querySelectorAll(".cart__item__content__titlePrice > h2")[i];
            const cartPrice = document.querySelectorAll(".cart__item__content__titlePrice > p")[i];
            const cartQty = document.querySelectorAll(".itemQuantity")[i];

            const thisQty = document.querySelectorAll(".itemQuantity")[i];


            cartImage.setAttribute("src", value.imageUrl); // Attribution des informations Produits
            cartImage.setAttribute("alt", value.altTxt); // depuis l'API et le localStorage
            cartName.textContent = value.name + ", " + storedProduct.color;
            cartPrice.textContent = value.price + "€";
            cartQty.setAttribute("value", storedProduct.qty);
            totalPriceSum += parseFloat(storedProduct.qty*value.price);
            document.getElementById("totalPrice").textContent = totalPriceSum + ",00";


            thisQty.addEventListener("change", function() { 
            // Ecoute changement de quantités de chaque produit et recalcule quantités et prix totaux
                totalQtySum -= parseInt(storedProduct.qty);
                totalPriceSum -= value.price*storedProduct.qty;

                storedProduct.qty = thisQty.value;
                totalQtySum += parseInt(storedProduct.qty);
                cartTotalQty.textContent = totalQtySum;
                
                totalPriceSum += value.price*storedProduct.qty;
                document.getElementById("totalPrice").textContent = totalPriceSum + ",00";

            })

        })
        .catch(function(err) {
            console.error(err); // Récupération des erreurs
        });
}
/*deleteButton.addEventListener("click", () => {
    
    document.querySelector(".cart__item").textContent = "Votre panier est vide !";
    
    localStorage.clear();
    cartImage.setAttribute("src", ("../../back/images/kanap01.jpeg"));
    cartName.textContent = "Nom du Produit";
    cartPrice.textContent = "0,00 €"; // (Qté:42, Price:42€, etc.)
    cartQty.setAttribute("value", "0");
    cartTotalQty.textContent = "0";
    document.getElementById("totalPrice").textContent = "0,00 €";
});*/


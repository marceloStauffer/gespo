// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC91oioVkrrxnw0METfw0km1Z7VYkWdz8I",
  authDomain: "gespo-fb.firebaseapp.com",
  projectId: "gespo-fb",
  storageBucket: "gespo-fb.firebasestorage.app",
  messagingSenderId: "805894941559",
  appId: "1:805894941559:web:0de8669809c4b79236cf72",
  measurementId: "G-3LW8DK16ZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let cardContainer = document.querySelector(".card-container");
let dados = [];

async function iniciarBusca() {
    if (dados.length === 0) {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    }

    let campoBusca = document.getElementById("campo-busca").value.toLowerCase();

    let resultados = dados.filter(dado => {
        let nome = dado.nomePopular.toLowerCase();
        let cientifico = dado.nomeCientifico.toLowerCase();
        let origem = dado.origem.toLowerCase();
        return nome.includes(campoBusca) || cientifico.includes(campoBusca) || origem.includes(campoBusca);
    });

    renderizarCards(resultados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");

        let imagem = dado.foto ? `<img src="${dado.foto}" alt="${dado.nomePopular}">` : "";

        article.innerHTML = `
        <h2>${dado.nomePopular}</h2>
        <p>${dado.nomeCientifico}</p>
        <p>${dado.origem}</p>
        <p>${imagem}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `  

        cardContainer.appendChild(article);
    }
}

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

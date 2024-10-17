const urlApi = "http://gateway.marvel.com/v1/public";
const personajes = "/characters";
const urlComics = "/comics";
const publicKey = "5097480aa6dc4ac1d4f47f09120fe013";
const privateKey = "";

let resultadosGlobales = []; 
let paginaActual = 1;
const resultadosPorPagina = 20;

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.querySelector('input[type="text"]').value;
    const tipo = document.querySelector('#comics').value;

    const ts = Date.now().toString(); 
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    let url;
    if (tipo === "comics") {
        url = `${urlApi}${urlComics}?titleStartsWith=${query}&apikey=${publicKey}&ts=${ts}&hash=${hash}`;
    } else {
        url = `${urlApi}${personajes}?nameStartsWith=${query}&apikey=${publicKey}&ts=${ts}&hash=${hash}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultadosGlobales = data.data.results; // Almacena todos los resultados
            mostrarResultados(paginaActual); // Muestra la primera página
            crearPaginacion();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

function mostrarResultados(pagina) {
    const resultadosElement = document.getElementById('resultados-busqueda');
    resultadosElement.innerHTML = ""; // Limpiar resultados anteriores

    const inicio = (pagina - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const resultadosPagina = resultadosGlobales.slice(inicio, fin); // Obtiene los resultados de la página actual

    resultadosPagina.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('result-item');

        const img = document.createElement('img');
        const thumbnailPath = item.thumbnail.path;
        const thumbnailExtension = item.thumbnail.extension;
        img.src = `${thumbnailPath}.${thumbnailExtension}`;
        img.alt = item.name || item.title;
        img.classList.add('result-image');

        const titleElement = document.createElement('p');
        titleElement.innerText = item.name || item.title;

        itemElement.appendChild(img);
        itemElement.appendChild(titleElement);
        resultadosElement.appendChild(itemElement);
    });
}




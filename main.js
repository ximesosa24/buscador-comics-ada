// Variables
const urlApi = "http://gateway.marvel.com/v1/public";
const personajes = "/characters";
const urlComics = "/comics";
const publicKey = "5097480aa6dc4ac1d4f47f09120fe013";
const privateKey = "";

let resultadosGlobales = [];
let paginaActual = 1;
const resultadosPorPagina = 20;

document.addEventListener('DOMContentLoaded', () => {
    cargarComics(); // función para cargar cómics al inicio

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        const query = document.getElementById('search-input').value;
        const tipo = document.getElementById('comics').value; 

        buscar(tipo, query); // Llama a la función de búsqueda
    });
});

function buscar(tipo, query) {
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
            resultadosGlobales = data.data.results;
            paginaActual = 1;
            mostrarResultados(paginaActual);
            crearPaginacion(); // crear
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function cargarComics() {
    const ts = Date.now().toString();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    const url = `${urlApi}${urlComics}?limit=20&apikey=${publicKey}&ts=${ts}&hash=${hash}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultadosGlobales = data.data.results;
            mostrarResultados(paginaActual); 
            crearPaginacion(); //  crear
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
};
// Funcionalidad orden alfabético
document.getElementById('orden').addEventListener('change', function() {
    ordenarResultados();
});

function ordenarResultados() {
    const ordenSeleccionado = document.getElementById('orden').value;

    switch (ordenSeleccionado) {
        case "a-z":
            resultadosGlobales.sort((a, b) => (a.name || a.title).localeCompare(b.name || b.title));
            break;
        case "z-a":
            resultadosGlobales.sort((a, b) => (b.name || b.title).localeCompare(a.name || a.title));
            break;
        case "mas-nuevo":
            resultadosGlobales.sort((a, b) => new Date(b.modified) - new Date(a.modified));
            break;
        case "mas-viejo":
            resultadosGlobales.sort((a, b) => new Date(a.modified) - new Date(b.modified));
            break;
    }

    mostrarResultados(paginaActual); // Muestra los resultados
};
// Funcionalidad mostrar resultados buscados
function mostrarResultados(pagina) {
    const resultadosElement = document.getElementById('resultados-busqueda');
    resultadosElement.innerHTML = ""; // Limpia resultados anteriores

    const inicio = (pagina - 1) * resultadosPorPagina;
    const fin = inicio + resultadosPorPagina;
    const resultadosPagina = resultadosGlobales.slice(inicio, fin);

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

        itemElement.addEventListener('click', () => {
            mostrarDetalles(item.id); // Llama a la función para cargar y mostrar los detalles
        });

        itemElement.appendChild(img);
        itemElement.appendChild(titleElement);
        resultadosElement.appendChild(itemElement);
    });
}

// function mostrarDetalles(comicId) {
//     const ts = Date.now().toString(); 
//     const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
//     const url = `${urlApi}${urlComics}/${comicId}?apikey=${publicKey}&ts=${ts}&hash=${hash}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             const comic = data.data.results[0]; // Asumiendo que solo hay un resultado
//             const detallesElement = document.getElementById('detalles-comic');
//             detallesElement.innerHTML = ""; // Limpiar detalles anteriores

//             const titleElement = document.createElement('h1');
//             titleElement.innerText = comic.title;

//             const img = document.createElement('img');
//             img.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
//             img.alt = comic.title;

//             const descriptionElement = document.createElement('p');
//             descriptionElement.innerText = comic.description || "No hay descripción disponible.";

//             detallesElement.appendChild(titleElement);
//             detallesElement.appendChild(img);
//             detallesElement.appendChild(descriptionElement);

//             // Mostrar el modal
//             document.getElementById('comic-modal').classList.remove('hidden');
//         })
//         .catch(error => {
//             console.error("Error fetching comic details:", error);
//         });
// }

// // Cerrar el modal al hacer clic en la 'x'
// document.getElementById('close-modal').addEventListener('click', () => {
//     document.getElementById('comic-modal').classList.add('hidden');
// });

const urlApi = "http://gateway.marvel.com/v1/public";
const personajes = "/characters";
const urlComics = "/comics";
const publicKey = "5097480aa6dc4ac1d4f47f09120fe013";
const ts = "marvel";


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.querySelector('input[type="text"]').value;
    const tipo = document.querySelector('#comics').value;
    const orden = document.querySelector('#orden').value;

const msgStatus = document.querySelector(".status");
const msg = document.querySelectorAll(".caixa-mensagem");
const msgPrivada = document.querySelector(".reservada");
const container = document.querySelector(".container");



// nome, envio de usuário, status check

let seuNome = prompt("Digite aqui o seu nome:");

const nomeArmazenado = {
    name: seuNome
}

const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeArmazenado);

requisicao.then(enviarUsuario);
requisicao.catch(usuarioInvalido);


function enviarUsuario (resposta) {
    console.log("Enviou usuário corretamente")
}

function usuarioInvalido (error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro: " + error.response.data);
    alert("Digite outro nome");
    window.location.reload(true);
}

setInterval (function (){
    const statusOnline = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeArmazenado);
    console.log("Você está online")
}, 5000)

// fim status check usuario



// adicionando display de mensagens ao body

setInterval (function () {let promiseMsg = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
container.innerHTML = ``;
promiseMsg.then(tratarMsg);
promiseMsg.catch(tratarErro);

}, 3000);

function tratarMsg(resposta) {

    for (let i = 0; i < resposta.data.length; i++) { //funcao que busca msgs

        const time = resposta.data[i].time;
        const from = resposta.data[i].from;
        const to = resposta.data[i].to;
        const text = resposta.data[i].text;
        const type = resposta.data[i].type;

        adicionarMensagens(time, from, to, text, type);
        container.lastChild.scrollIntoView()
    }
}


function adicionarMensagens(time, from, to, text, type) { //funçao que adiciona ao html
    if (type === "status") {
        container.innerHTML +=
            `<div class="caixa-mensagem ${type}"><p>(${time}) <strong>${from}</strong>
         ${text}</p></div>`
    }
    else {
        container.innerHTML +=
            `<div class="caixa-mensagem ${type}"><p>(${time}) <strong>${from}</strong> para 
        <strong>${to}: </strong>${text}</p></div>`
    }

}




function tratarErro(error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro: " + error.response.data);
}

//fim do display de mensagens do body


const container = document.querySelector(".container");


updateMensagem();
updateParticipantes();

// nome, envio de usuário, status check

let seuNome = prompt("Digite aqui o seu nome:");

const nomeArmazenado = {
    name: seuNome
}

const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeArmazenado);

requisicao.then(enviarUsuario);
requisicao.catch(usuarioInvalido);


function enviarUsuario() {
    console.log("Enviou usuário corretamente");
}

function usuarioInvalido(error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro: " + error.response.data);
    alert("Esse nome já está em uso, por favor digite outro nome");
    window.location.reload(true);
}

setInterval(function () {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeArmazenado);
    console.log("Você está online");
}, 4000)

// fim status check usuario

// adicionando display de mensagens ao body

setInterval(updateMensagem, 3000);

function updateMensagem() {
    let promiseMsg = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promiseMsg.then(tratarMsg);
    promiseMsg.catch(tratarErro);
}


function tratarMsg(resposta) {
    apagarMensagens();
    for (let i = 0; i < resposta.data.length; i++) { //funcao que busca msgs

        const time = resposta.data[i].time;
        const from = resposta.data[i].from;
        const to = resposta.data[i].to;
        const text = resposta.data[i].text;
        const type = resposta.data[i].type;


        adicionarMensagens(time, from, to, text, type);
        container.lastChild.scrollIntoView();
    }
}

function apagarMensagens() {
    container.innerHTML = ``;
}

function adicionarMensagens(time, from, to, text, type) { //funçao que adiciona ao html
    if (type === "status") {
        container.innerHTML +=
            `<div class="caixa-mensagem ${type}"><h1>(${time})</h1> <p> <strong>${from}</strong>
         ${text}</p></div>`
    }
    if (type === "private_message" && seuNome === to) {
        `<div class="caixa-mensagem ${type}"><h1>(${time})</h1> <p> <strong>${from}</strong> para 
        <strong>${to}: </strong>${text}</p></div>`
    }
    else if (type === "message" && to === "Todos") {
        container.innerHTML +=
            `<div class="caixa-mensagem ${type}"><h1>(${time})</h1> <p> <strong>${from}</strong> para 
        <strong>${to}: </strong>${text}</p></div>`
    }

}




function tratarErro(error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro: " + error.response.data);
}

//fim do display de mensagens do body


//envio de mensagem
function enviarMensagem() {
    const mensagem = document.querySelector("input").value;
    const msgObject = {
        from: seuNome,
        to: "Todos",
        text: mensagem,
        type: "message" // ou "private_message" para o bônus
    }

    const envioMsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msgObject);
    envioMsg.then(confirmaMensagem);
    envioMsg.catch(errorMensagem);
}

function confirmaMensagem() {
    console.log("Sua mensagem foi enviada!");
    updateMensagem();
    document.querySelector("input").value = '';
}

function errorMensagem(error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro " + error.response.data);
}

//fazer enviar mensagem com enter
const enter = document.querySelector("input");

enter.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        enviarMensagem();
    }
});


//fim do envio de mensagem

//bonus

function selecionar(el) {
    el.children[2].classList.toggle("escondido")
    el.classList.toggle("selecionado")

}


//abrir lista de participantes

const lista = document.querySelector(".lista-participantes")

function mostrarLista() {
    lista.classList.remove("escondido");
}

function esconderLista() {
    lista.classList.add("escondido");
}

const lateralParticipantes = document.querySelector(".conteudo")

//receber lista de participantes

const conteudo = document.querySelector(".conteudo");

setInterval (updateParticipantes, 10000);

function updateParticipantes() {
    console.log("Atualizando participantes")
    const promiseParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promiseParticipantes.then(tratarParticipantes);
    promiseParticipantes.catch(errorParticipantes);
}



function tratarParticipantes(resposta) { //atualizar participantes
    apagarParticipantes();

    for (let i = 0; i < resposta.data.length; i++) {
        const name = resposta.data[i].name;
        listaParticipantes(name);
    }
}


function errorParticipantes(error) {
    console.log("Status code:" + error.response.status);
    console.log("Mensagem de erro:" + error.response.data);
}


function listaParticipantes(name) {

    conteudo.innerHTML +=
        `
<div class="contato" onclick="selecionar(this)">
    <ion-icon name="person-circle"></ion-icon>
    <h3>${name}</h3>
    <ion-icon name="checkmark-outline" class="escondido"></ion-icon>
</div>`
}

function apagarParticipantes() {
    conteudo.innerHTML = `<div class="contato" onclick="selecionar(this)">
    <ion-icon name="people"></ion-icon>
    <h3>Todos</h3>
    <ion-icon name="checkmark-outline" class="escondido"></ion-icon>
</div> `
}

//fim participantes
const container = document.querySelector(".container");



// nome, envio de usuário, status check

let seuNome = prompt("Digite aqui o seu nome:");

const nomeArmazenado = {
    name: seuNome
}

const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeArmazenado);

requisicao.then(enviarUsuario);
requisicao.catch(usuarioInvalido);


function enviarUsuario(resposta) {
    console.log("Enviou usuário corretamente");
}

function usuarioInvalido(error) {
    console.log("Status code: " + error.response.status);
    console.log("Mensagem de erro: " + error.response.data);
    alert("Digite outro nome");
    window.location.reload(true);
}

setInterval(function () {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeArmazenado);
    console.log("Você está online");
}, 5000)

// fim status check usuario



// adicionando display de mensagens ao body

setInterval(updateMensagem, 3000);

function updateMensagem() {
    let promiseMsg = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    container.innerHTML = ``;
    promiseMsg.then(tratarMsg);
    promiseMsg.catch(tratarErro);
}



function tratarMsg(resposta) {

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
    else if (type === "message") {
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
    window.location.reload(true);
}

//fim do envio de mensagem
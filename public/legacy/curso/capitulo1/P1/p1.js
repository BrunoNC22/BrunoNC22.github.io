var emailValido = false
var senhalValido = false
var confirmaSenhaValido = false
var inputs = document.getElementsByClassName('entradaDeTexto')

function verificarInputs() {
    let botao = document.getElementById('botao')
    if (emailValido && senhalValido && confirmaSenhaValido){
        botao.disabled = false
        botao.style.cursor = 'pointer'
    } else {
        botao.style.cursor = 'unset'
        botao.disabled = true
    }

}

function validarEmail(){
    let email = document.querySelector('#email')
    let conteudoDeEmail = email.value
    if  ((conteudoDeEmail.indexOf('@') != -1) & (conteudoDeEmail.indexOf('.') != -1)) {
        emailValido = true
        email.style.borderColor = 'green';
    }else {
        emailValido = false
        email.style.borderColor = 'red';
    }
}

function validarSenha(){
    let senha = document.getElementById('senha')
    if (senha.value.length < 8) {
        senhalValido = false
        senha.style.borderColor = 'red'
    } else{
        senhalValido = true
        senha.style.borderColor = 'green'
    }
}

function validarConfirmaSenha() {
    let senha = document.getElementById('senha').value
    let confirmaSenha = document.getElementById('confirmaSenha')
    if (senha === confirmaSenha.value) {
        confirmaSenhaValido = true
        confirmaSenha.style.borderColor = 'green'
    } else {
        confirmaSenhaValido = false
        confirmaSenha.style.borderColor = 'red'
    }
}

function cadastrar(){
    if (emailValido && senhalValido && confirmaSenhaValido){
        alert('Cadastro efetuado!')
    }
}

function eventos(){
    let inputs = document.querySelectorAll('.entradaDeTexto')
    let email = document.getElementById('email')
    let senha = document.querySelector('#senha')
    let confirmaSenha = document.querySelector('#confirmaSenha')
    let botao = document.getElementById('botao')
    email.addEventListener('keyup', validarEmail)
    senha.addEventListener('keyup', validarSenha)
    confirmaSenha.addEventListener('keyup', validarConfirmaSenha)
    for (let i = 0; i < inputs.length; i++){
        inputs[i].addEventListener('keyup', verificarInputs)
    }
    botao.addEventListener('click', cadastrar)

}

window.addEventListener('load', eventos)
function minhaPrimeiraFunc() {
    var palavra = prompt('Digite aqui para verificar e é um palindromo:');
    if (palindromo(palavra)) {
        alert('sim');
    } else {
        alert('não');
    }
    
};

function palindromo(palavra){
    palavraAuxiliar = palavra.toString();
    palavra.replace(' ', '')
    console.log(palavraAuxiliar);
    palavraReversa = palavraAuxiliar.split('').reverse().join('');
    return palavraReversa === palavraAuxiliar;
}
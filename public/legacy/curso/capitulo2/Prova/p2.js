function valorFinal(){
    let nome = document.getElementById('nome').value
	let cidRetirada = document.getElementById('Cidade de retirada').value
	let cidEntrega = document.getElementById('Cidade de entrega').value
	let dataRetirada = document.getElementById('Data de retirada').value
	let dataDevolucao = document.getElementById('Data de devolução').value
	let tipoDeCarro = document.getElementById('Tipo de carro').value
	
    let diaDeRetirada = parseInt(dataRetirada.split('/')[0]) 	
	let diaDeDevolucao = parseInt(dataDevolucao.split('/')[0])

	let valor = 0
	let periodo = diaDeDevolucao - diaDeRetirada

	if (tipoDeCarro === 'Basico') {
		valor = periodo * 119
	}
	else if (tipoDeCarro === 'Basico com ar') {
		valor = periodo * 199
	}
	else if (tipoDeCarro === 'Executivo') {
		valor = periodo * 299
	}

	if (cidRetirada != cidEntrega){
		valor += 300
	}

	

	alert(nome + ', o valor final ficou em: ' + valor + ',00')
	
}
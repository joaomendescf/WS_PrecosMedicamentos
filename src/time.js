function time(){
	const data = new Date();
	const hora = data.getHours();
	const min = data.getMinutes();
	const dia = data.getDay();
	const mes = data.getMonth();
	const ano = data.getFullYear();

	const datetime = `${hora}:${min}-${dia}/${mes}/${ano}`

	return datetime
}

module.exports=time;
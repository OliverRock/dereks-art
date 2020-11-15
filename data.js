


str = "Abstract,  rest, bear"

function makeCatagoryList(str){
	var lst = str.split(',');
	for(i=0 ; i < lst.length ; i++){
		lst[i] = lst[i].trim()
		
	}
	return lst
}

console.log(makeCatagoryList(str))
console.log('  helo'.trim())
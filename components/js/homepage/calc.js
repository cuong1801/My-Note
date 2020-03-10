
/****calculator*******/
var keys = document.querySelectorAll('#calc span');
var ops = ['+', '-', 'x', '÷'];
var dec = false;
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		var input = document.querySelector('.result');
		var inputVal = input.innerHTML;
		var keyVal = this.innerHTML;
		if(keyVal == 'c') {
			input.innerHTML = '';
			dec = false;
		}
		else if(keyVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];
			equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
			if(ops.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');
			
			if(equation)
				input.innerHTML = eval(equation);
				
			dec = false;
		}
		else if(ops.indexOf(keyVal) > -1) {
			var lastChar = inputVal[inputVal.length - 1];
			if(inputVal != '' && ops.indexOf(lastChar) == -1) 
				input.innerHTML += keyVal;
			else if(inputVal == '' && keyVal == '-') 
				input.innerHTML += keyVal;
			if(ops.indexOf(lastChar) > -1 && inputVal.length > 1) {
				input.innerHTML = inputVal.replace(/.$/, keyVal);
			}
			
			dec =false;
		}
		else if(keyVal == '.') {
			if(!decimalAdded) {
				input.innerHTML += keyVal;
				dec = true;
			}
		}
		else {
			input.innerHTML += keyVal;
		}
		e.preventDefault();
	} 
}
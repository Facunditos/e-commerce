const numbersArray=[{
        number:15
    },{
        number:5    
    },{
        number:12
    }];
const array=numbersArray.forEach(function(element,index){
    element.number+=10;
});
console.log("-----------forEach--------------------");
console.log(numbersArray);
console.log(array);
console.log("-----------map--------------------");
const numbers=[{
        name:'Facundo',
        number:15
    },{
        name:'Fernando',
        number:5    
    },{
        name:'Fausto',
        number:12
    }];
const newNumbers=numbers.splice(1,1,12)
console.log(numbers);
console.log(newNumbers);
Array().forEach()
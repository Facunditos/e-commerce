const localKey='EhDb0yVERS+jCvmIGO+XgY6CITECqckfhtztwOY6';
const EC_kEY='EhDb0yVERS+jCvmIGO+XgY6CITECqckfhtztwOY6';

const localKeyOnArray=localKey.split("");
const EC_kEYOnArray=EC_kEY.split("");

localKeyOnArray.forEach((character,index)=>{
  if (localKeyOnArray.length!==EC_kEYOnArray.length && index===localKeyOnArray.length-1)  {
    console.log('the keys do not match because each oh them has a different size');
  };

  if (character!==EC_kEYOnArray[index]) {
    console.log('the keys do not match');
    console.log(`the character which index is ${index+1} does not match`);
  } else {
    if (index===localKeyOnArray.length-1) console.log('the keys do match');
  }
});




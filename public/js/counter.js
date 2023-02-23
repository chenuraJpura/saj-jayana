//if count value zerro count button can't update the zerro
const counterTag=document.querySelector('.main-button');
const frontReset=document.getElementById('b1');
const saveCount=document.getElementById('b2');
const resetTag=document.querySelector('.reset');


//default increment
//increment value using keyboard press

window.addEventListener('keydown',(event)=>{
    if(event.keyCode==32){
        counterTag.classList.add('pulse1');
        counterTag.innerHTML=parseInt(counterTag.innerHTML)+1;
        
        }
        if(parseInt(counterTag.innerHTML)>=1){
            frontReset.style.display='';
            saveCount.style.display='';
        }
    })
window.addEventListener('keyup',()=>{
    counterTag.classList.remove('pulse1');

})

//increment value using mouse press
counterTag.addEventListener('click',()=>{
    counterTag.innerHTML=parseInt(counterTag.innerHTML)+1;
    if(parseInt(counterTag.innerHTML)>=1){
        frontReset.style.display='inline'; 
        saveCount.style.display='inline';    
    }
})

//reset button
resetTag.addEventListener('click',()=>{
    counterTag.innerHTML="0";
    frontReset.style.display='none';
    saveCount.style.display='none';
})


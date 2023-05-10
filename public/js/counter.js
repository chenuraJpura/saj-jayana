//if count value zerro count button can't update the zerro
const counterTag=document.querySelector('.main-button');
const frontReset=document.getElementById('b1');
const saveCount=document.getElementById('b2');
const resetTag=document.querySelector('.reset');


//default increment
//increment value using keyboard press

window.addEventListener('keydown',(event)=>{
        if(event.keyCode==67){
        counterTag.classList.add('pulse1');
        counterTag.innerHTML=parseInt(counterTag.innerHTML)+1;
        
        }

        if(event.keyCode==82){
            resetTag.click();             
        }

        if(parseInt(counterTag.innerHTML)>=1){
            frontReset.style.display='';
            if(saveCount) {
                saveCount.style.display='';
            }
            
        }
    })
window.addEventListener('keyup',()=>{
    counterTag.classList.remove('pulse1');
})



//increment value using mouse press
counterTag.addEventListener('mousedown',()=>{
    counterTag.classList.add('pulse1');
    counterTag.innerHTML=parseInt(counterTag.innerHTML)+1;
    if(parseInt(counterTag.innerHTML)>=1){
        frontReset.style.display='inline'; 
        if(saveCount) {
            saveCount.style.display='inline';    
        }
        
    }
    
})


counterTag.addEventListener('mouseup',()=>{
    counterTag.classList.remove('pulse1');

})
//reset button
resetTag.addEventListener('click',()=>{
    counterTag.innerHTML="0";
    frontReset.style.display='none';
    if(saveCount) {
        saveCount.style.display='none';    
    }
    
})


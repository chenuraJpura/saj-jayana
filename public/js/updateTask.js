function updateTaskButtonClick(editId){

    editId=editId.substring(0, editId.length - 2);

    let selectedID=editId.concat("t");

    let selectedTitleObj=document.getElementById(selectedID);

    const modelTitle=document.getElementById("taskUpdateTitle");

    const modelID=document.getElementById("taskUpdateID");

    modelID.value=editId;

    modelTitle.value=selectedTitleObj.innerHTML;


}


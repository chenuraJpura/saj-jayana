function deleteTaskButtonClick(deleteId){

    deleteId=deleteId.substring(0, deleteId.length - 2);

    let deletedObj=document.getElementById("taskDeleteID");

    deletedObj.value=deleteId;


}


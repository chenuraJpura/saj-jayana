function deleteCountButtonClick(deleteId){

    deleteId=deleteId.substring(0, deleteId.length - 2);

    let deletedObj=document.getElementById("countDeleteID");

    deletedObj.value=deleteId;


}


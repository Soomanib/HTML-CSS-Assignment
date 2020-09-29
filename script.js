const NOMODE = 0;

const ASC = true;
const DESC = false;

const SORTID = true;
const SORTCOUNT = false;

const EDITMODE = true;
const REGISTRATIONMODE = false;

const IMAGEPREVIEW = true;
const NOIMAGEPREVIEW = false;

const IMAGE = "resources/defaultPreview.png"

const relativeLeaveImagePath = "leaveImages/"

const EMAILREGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let leaveObjectArray = [];
let leaveObjectArrayToShow = [];
let currentMode = NOMODE;
let currentSortBy = NOMODE;
let editMode = REGISTRATIONMODE;
let callerFunctionEdit;
let imagePreview = NOIMAGEPREVIEW; //default image preview is false

const tableHeads = {
    ID: 0,
    NAME: 1,
    EMAIL: 2,
    STARTDATE: 3,
    ENDDATE: 4,
    DAYCOUNT: 5,
    LEAVETYPE: 6,
    FILE: 7,
    EDITDELETE: 8
};

Object.freeze(tableHeads);

window.addEventListener('load', bindEventListeners);

function bindEventListeners(){
    console.log("The window has been fully loaded");

    document.getElementById("FormSubmitButton").addEventListener( "click", updateLeaveInformation );
    document.getElementById("FormCancelButton").addEventListener( "click", cancelLeaveInformation );
    document.getElementById("AddButton").addEventListener( "click", showRegistrationPage );
    document.getElementById("File").addEventListener( "change", loadFile );

    document.getElementById("SortByID").addEventListener( "click", function(){
        sortTable( SORTID, ASC );
        currentSortBy = SORTID;
        currentMode = ASC;
        renderLeaveObjectsOnListPage();
    } );

    document.getElementById("SortByIdDesc").addEventListener( "click",  function(){
        sortTable( SORTID, DESC );
        currentSortBy = SORTID;
        currentMode = DESC;
        renderLeaveObjectsOnListPage();
    } );

    document.getElementById("SortByDayCount").addEventListener( "click", function(){
        sortTable( SORTCOUNT, ASC );
        currentSortBy = SORTCOUNT;
        currentMode = ASC;
        renderLeaveObjectsOnListPage();
    } );

    document.getElementById("SortByDayCountDesc").addEventListener( "click", function(){
        sortTable( SORTCOUNT, DESC );
        currentSortBy = SORTCOUNT;
        currentMode = DESC;
        renderLeaveObjectsOnListPage();
    } );
}

function cancelLeaveInformation(){
    let errorMessageElements = document.getElementsByClassName("ErrorMessage");
    let i;

    if( editMode === EDITMODE ){
        changeFormPropertiesToRegister(callerFunctionEdit);
    }

    for (i = 0; i < errorMessageElements.length; i++) {
        errorMessageElements[i].innerHTML = "";
    }

    sortTable( currentSortBy, currentMode );
    renderLeaveObjectsOnListPage();
    showListPage();
}

function updateLeaveInformation(){
    currentMode  = NOMODE;
    currentSortBy = NOMODE;
    let leaveInformation = createLeaveObject();
    let isValidated = formValidation(leaveInformation);
    if(isValidated)
    {
        addLeaveObjectToArray(leaveInformation);
        updateLeaveObjectArrayToShow();
        renderLeaveObjectsOnListPage();
        showListPage();
    }
}

function updateLeaveObjectArrayToShow(){
    leaveObjectArrayToShow = [];

    for(let i = 0; i < leaveObjectArray.length; i++)
    {
        leaveObjectArrayToShow.push(i);
    }
}

function renderLeaveObjectsOnListPage(){    
    let employeeLeaveInformation;
    let indexNumber;

    //clear already rendered list page first
    document.getElementById("LeaveTableRowContainer").innerHTML = "";

    //render list page now
    for(let i = 0; i < leaveObjectArrayToShow.length; i++){
        indexNumber = leaveObjectArrayToShow[i];
        employeeLeaveInformation = leaveObjectArray[indexNumber];
        showInformationOnTable(employeeLeaveInformation);
    }
}

function showInformationOnTable(employeeLeaveInformation){
    //In this function table row is created
    let table = document.getElementById("LeaveTableRowContainer");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    row.classList.add("leave-table-body");
    row.insertCell(tableHeads.ID).innerHTML = employeeLeaveInformation.id;
    row.insertCell(tableHeads.NAME).innerHTML = employeeLeaveInformation.name;
    row.insertCell(tableHeads.EMAIL).innerHTML = employeeLeaveInformation.email;
    row.insertCell(tableHeads.STARTDATE).innerHTML = employeeLeaveInformation.startDate;
    row.insertCell(tableHeads.ENDDATE).innerHTML = employeeLeaveInformation.endDate;
    row.insertCell(tableHeads.DAYCOUNT).innerHTML = employeeLeaveInformation.dayCount;
    row.insertCell(tableHeads.LEAVETYPE).innerHTML = employeeLeaveInformation.leaveType;

    let fileColumn = row.insertCell(tableHeads.FILE);
    let imageFile = document.createElement("IMG");
    fileColumn.appendChild(imageFile);

    imageFile.src = employeeLeaveInformation.file;
    imageFile.classList.add("leave-table-img");

    let editDeleteColumn = row.insertCell(tableHeads.EDITDELETE);
    let editButton = document.createElement("SPAN");
    let deleteButton = document.createElement("SPAN");

    editDeleteColumn.appendChild(editButton);
    editDeleteColumn.appendChild(deleteButton);

    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";

    editButton.classList.add("edit-delete-button");
    deleteButton.classList.add("edit-delete-button");  

    deleteButton.setAttribute("onclick", "deleteInformation(this)");
    editButton.setAttribute("onclick", "editInformation(this)");
}

function editInformation(editButton){
    let row = editButton.parentNode.parentNode;
    changeFormPropertiesToEdit(row); 
    showRegistrationPage(); 
    placeHolder(row);  
}

function changeFormPropertiesToEdit(row){
    //change edit mode
    editMode = EDITMODE;    

    //set image preview to true
    imagePreview = IMAGEPREVIEW;

    //change form header text
    document.getElementById("LeaveTableHeadText").innerHTML = "Edit Leave Information";

    //change event listener for save button
    document.getElementById("FormSubmitButton").removeEventListener( "click", updateLeaveInformation );
    document.getElementById("FormSubmitButton").addEventListener( "click", callerFunction = function(){
        callerFunctionEdit= callerFunction;
        updateEditedInformation(row, callerFunction);
    } );
}

function updateEditedInformation(row, callerFunction){
    let showArrayRowIndex = row.rowIndex - 1;
    let leaveObjectRowIndex = leaveObjectArrayToShow[showArrayRowIndex];
    let existedLeaveObject = leaveObjectArray[leaveObjectRowIndex];
    let previewImageFile = existedLeaveObject.file;
    let leaveInformation = createLeaveObject();   
    let isValidated;

    if(imagePreview){
        leaveInformation.file = previewImageFile;
    }
    
    isValidated = formValidation(leaveInformation);
    
    if(isValidated)
    {
        leaveObjectArray[leaveObjectRowIndex] = leaveInformation;
        renderLeaveObjectsOnListPage();

        changeFormPropertiesToRegister(callerFunction);    
        showListPage();
    }
}

function changeFormPropertiesToRegister(callerFunction){
    //change edit mode
    editMode = REGISTRATIONMODE;

    //Head information back to default
    document.getElementById("LeaveTableHeadText").innerHTML = "Register For New Leave";
    document.getElementById("RegistrationFormContent").reset();

    // changed parameters to default value 
    //show leave content and remove flex

    document.getElementById("ListContainer").style.display = "flex";
    document.getElementById("RegistrationFormContainer").style.display = "none";

    //get back to original event listener
    document.getElementById("FormSubmitButton").addEventListener( "click", updateLeaveInformation );
    document.getElementById("FormSubmitButton").removeEventListener( "click", callerFunction );

    //no image preview
    document.getElementById("PreviewImage").src = IMAGE;
    imagePreview = NOIMAGEPREVIEW;
};

function placeHolder(row){
    let showArrayRowIndex = row.rowIndex - 1;
    let leaveObjectRowIndex = leaveObjectArrayToShow[showArrayRowIndex];
    let leaveInformation = leaveObjectArray[leaveObjectRowIndex];

    document.getElementById("EmployeeId").value = leaveInformation.id;
    document.getElementById("Name").value = leaveInformation.name;
    document.getElementById("Email").value = leaveInformation.email;
    document.getElementById("StartDate").value = leaveInformation.startDate;
    document.getElementById("EndDate").value = leaveInformation.endDate;
    
    //radio-button
    if(leaveInformation.leaveType == "Sick")
    {
        document.getElementById("SickLeaveType").checked = true;
    }
    else if(leaveInformation.leaveType == "Custom")
    {
        document.getElementById("CustomLeaveType").checked = true;
    }

    //show image preview
    document.getElementById("PreviewImage").src = leaveInformation.file;

}

function showListPage(){
    document.getElementById("ListContainer").style.display = "flex";
    document.getElementById("RegistrationFormContainer").style.display = "none";
}

function showRegistrationPage(){
    //show default image preview
    document.getElementById("PreviewImage").src = IMAGE;

    //show registration page
    document.getElementById("RegistrationFormContent").reset();
    document.getElementById("ListContainer").style.display = "none";
    document.getElementById("RegistrationFormContainer").style.display = "flex";
}

function deleteInformation(deleteButton){

    let row = deleteButton.parentNode.parentNode;
    let showArrayRowIndex = row.rowIndex - 1;
    let leaveObjectRowIndex = leaveObjectArrayToShow[showArrayRowIndex];

    deleteFromLeaveObject(leaveObjectRowIndex);
    updateLeaveObjectArrayToShow();
    sortTable( currentSortBy, currentMode );
    renderLeaveObjectsOnListPage();
}


function deleteFromLeaveObject(index)
{
    for( i = index; i<leaveObjectArray.length - 1; i++)
    {
        leaveObjectArray[i] = leaveObjectArray[i+1];
    }

    leaveObjectArray.pop();
}

function createLeaveObject()
{
    let leaveInformation = new Object();
    let leaveSelectedValue;
    let filePath;
    let fileName;

    const leaveSelectors = document.querySelectorAll( 'input[name="leave-type"]' );

    for(leaveSelector of leaveSelectors)
    {
        if(leaveSelector.checked)
        {
            leaveSelectedValue = leaveSelector.value;
        }
    }

    filePath = document.getElementById("File").value;
    fileName = relativeLeaveImagePath + filePath.split('\\').pop().split('/').pop();

    leaveInformation.id = document.getElementById("EmployeeId").value;
    leaveInformation.name = document.getElementById("Name").value;
    leaveInformation.email = document.getElementById("Email").value;
    leaveInformation.startDate = document.getElementById("StartDate").value;
    leaveInformation.endDate = document.getElementById("EndDate").value;
    leaveInformation.dayCount = date_diff_indays(leaveInformation.startDate , leaveInformation.endDate);
    leaveInformation.leaveType = leaveSelectedValue;
    leaveInformation.file = fileName;

    return leaveInformation;
}

function formValidation(leaveInformation){
    isValidated = true;
    //check empty field
    if( !leaveInformation.id )
    {
        document.getElementById("IdError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("IdError").innerHTML  = "";
    }

    if( !leaveInformation.name )
    {
        document.getElementById("NameError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("NameError").innerHTML  = "";
    }
    
    if( !leaveInformation.email )
    {
        document.getElementById("EmailError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
            //email validation
            if ( EMAILREGX.test(leaveInformation.email) )
            {
                document.getElementById("EmailError").innerHTML  = "";
            }
            else{
                document.getElementById("EmailError").innerHTML  = "Invalid Email Address";
                isValidated = false;
            }
    }

    if( !leaveInformation.startDate )
    {
        document.getElementById("StartDateError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("StartDateError").innerHTML  = "";
    }

    if( !leaveInformation.endDate )
    {
        document.getElementById("EndDateError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("EndDateError").innerHTML  = "";
    }

    if( !leaveInformation.leaveType )
    {
        document.getElementById("LeaveTypeError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("LeaveTypeError").innerHTML  = "";
    }

    if( leaveInformation.file === relativeLeaveImagePath )
    {
        document.getElementById("FileError").innerHTML  = "This field cannot be empty";
        isValidated = false;
    }
    else
    {
        document.getElementById("FileError").innerHTML  = "";
    }


    //check date validation
    if( leaveInformation.dayCount < 1 )
    {
        document.getElementById("DateEntryError").innerHTML  = "End Date must be a later date from start date";
        isValidated = false;
    }
    else
    {
        document.getElementById("DateEntryError").innerHTML  = "";
    }

    return isValidated;
}


function addLeaveObjectToArray(leaveInformation){
    leaveObjectArray.push(leaveInformation);
}

let date_diff_indays = function(date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    const diffTime = dt2 - dt1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays + 1;
}

//search function

function filterNames() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("FilterNames");
    filter = input.value.toUpperCase();
    table = document.getElementById("LeaveTableRowContainer");
    tr = table.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

//sort function

function sortTable( sortBy, sortMode ){
    //By default if sorting is not needed, example while deleting and NOMODE
    if( (sortBy === NOMODE) && (sortMode === NOMODE) )
        return;

    let switching, shouldSwitch;
    switching = true;

    while (switching) {
        switching = false;

        for (i = 0; i < (leaveObjectArrayToShow.length - 1); i++) {
            shouldSwitch = false;

            let leaveObjectRowIndex = leaveObjectArrayToShow[i];
            let nextLeaveObjectRowIndex = leaveObjectArrayToShow[i+1];
            let leaveInformation = leaveObjectArray[leaveObjectRowIndex];
            let nextLeaveInformation = leaveObjectArray[nextLeaveObjectRowIndex];

            if( sortBy === SORTID )
            {
                if( sortMode === ASC)
                {
                    if( leaveInformation.id > nextLeaveInformation.id )
                    {
                        shouldSwitch = true;
                        break;
                    }
                }

                else if(sortMode === DESC)
                {
                    if( leaveInformation.id < nextLeaveInformation.id )
                    {
                        shouldSwitch = true;
                        break;
                    }
                }
            }

            else if( sortBy === SORTCOUNT )
            {
                if( sortMode === ASC)
                {
                    if( leaveInformation.dayCount > nextLeaveInformation.dayCount )
                    {
                        shouldSwitch = true;
                        break;
                    }
                }

                else if(sortMode === DESC)
                {
                    if( leaveInformation.dayCount < nextLeaveInformation.dayCount )
                    {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            let temp = leaveObjectArrayToShow[i];
            leaveObjectArrayToShow[i] = leaveObjectArrayToShow[i+1];
            leaveObjectArrayToShow[i+1] = temp;
            switching = true;
        }
    }
    
}

let loadFile = function(event) {
    let reader = new FileReader();
    reader.onload = function(){
        let output = document.getElementById('PreviewImage');
        output.src = reader.result;

        //when file is loaded previous image preview changed to file upload
        imagePreview = NOIMAGEPREVIEW;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

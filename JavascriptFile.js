document.getElementById("FormSubmitButton").addEventListener( "click", formSubmitClicked );

document.getElementById("AddButton").addEventListener( "click", addButtonClicked );

document.getElementById("SortByID").addEventListener( "click", function(){
    sortTable( 0, "asc" );
} );

document.getElementById("SortByIdDesc").addEventListener( "click",  function(){
    sortTable( 0, "desc" );
} );

document.getElementById("SortByDayCount").addEventListener( "click", function(){
    sortTable( 5, "asc" );
} );

document.getElementById("SortByDayCountDesc").addEventListener( "click", function(){
    sortTable( 5, "desc" );
} );


function formSubmitClicked()
{
    let employeeInformation = getEmployeeInformation();

    if( formValidated(employeeInformation) ){
        createRow(employeeInformation);
        document.getElementById("RegistrationFormContainer").style.display = "none";
        document.getElementById("ListContainer").style.display = "flex";
        document.getElementById("RegistrationFormContent").reset();
    }
}

function getEmployeeInformation()
{
    let intialStoreArray = [];
    let employeeInformationArray = [];
    let formData = document.getElementById("RegistrationFormContent");

    for(let i=0; i<=8; i++)
    {
        intialStoreArray[i] = formData.elements[i].value;
    }

    employeeInformationArray[0] = intialStoreArray[1]; //id
    employeeInformationArray[1] = intialStoreArray[0]; //name
    employeeInformationArray[2] = intialStoreArray[2]; //email
    employeeInformationArray[3] = intialStoreArray[3]; //start_date
    employeeInformationArray[4] = intialStoreArray[4]; //end_date
    employeeInformationArray[5] = date_diff_indays(intialStoreArray[3], intialStoreArray[4]); //day_count

    employeeInformationArray[7] = intialStoreArray[8]; //file

    const leaveSelectors = document.querySelectorAll( 'input[name="leave-type"]' );

    let leaveSelectedValue;

    for(leaveSelector of leaveSelectors)
    {
        if(leaveSelector.checked)
        {
            leaveSelectedValue = leaveSelector.value;
        }
    }

    employeeInformationArray[6] = leaveSelectedValue;

    return employeeInformationArray;
}

function formValidated(employeeInformation) {
    let message = "These field(s) cannot be empty: ";

    let isValid = true;
    for(let i=0; i<8; i++)
    {
        if( !( employeeInformation[i] ) )
        {
            isValid = false;
            switch(i)
            {
                case 0: 
                    message += " Employee ID,"
                break;
                case 1: 
                    message += " Employee Name,"
                break;
                case 2: 
                    message += " Email Address,"
                break;
                case 3: 
                    message += " Start Date,"
                break;
                case 4: 
                    message += " End Date,"
                break;
                case 6: 
                    message += " Leave Type,"
                break;
                case 7: 
                    message += " File,"
                break;
            }
        }
    }

    if(!isValid)
    {
        let alertMessage = message.slice(0, -1);
        alert(alertMessage);
    }

    return isValid;
}



function addButtonClicked()
{
    document.getElementById("ListContainer").style.display = "none";
    document.getElementById("RegistrationFormContainer").style.display = "flex";
}

function createRow(employeeInformation)
{
    let table = document.getElementById("LeaveTableRowContainer");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.classList.add("leave-table-body");
    for(let i=0; i<9; i++)
        {
            let columnCell = row.insertCell(i);

            if(i==7)
            {
                //cell no 7 for image
                let filePath = employeeInformation[i].split('\\').pop().split('/').pop();
                let imageFile = document.createElement("IMG");

                columnCell.appendChild(imageFile);

                imageFile.src = filePath;
                imageFile.classList.add("leave-table-img");
            }

            else if(i==8)
            {
                let editButton = document.createElement("SPAN");
                let deleteButton = document.createElement("SPAN");

                columnCell.appendChild(editButton);
                columnCell.appendChild(deleteButton);

                editButton.textContent = "Edit";
                deleteButton.textContent = "Delete";

                editButton.classList.add("edit-delete-button");
                deleteButton.classList.add("edit-delete-button");  

                deleteButton.setAttribute("onclick", "deleteFormEntry(this)");
                editButton.setAttribute("onclick", "editFormEntry(this)");
            }

            else{
                columnCell.innerHTML = employeeInformation[i];
            } 
        }
}

function deleteFormEntry(deleteButton)
{
    let row = deleteButton.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


function editFormEntry(editButton){
    let row = editButton.parentNode.parentNode;
    let callerFunction;

    //change form header text
    document.getElementById("LeaveTableHeadText").innerHTML = "Edit Leave Information";

    //show form, don't show list page
    document.getElementById("ListContainer").style.display = "none";
    document.getElementById("RegistrationFormContainer").style.display = "flex";

    //change event listener for save button
    document.getElementById("FormSubmitButton").removeEventListener( "click", formSubmitClicked );
    document.getElementById("FormSubmitButton").addEventListener( "click", callerFunction = function(){
        editSubmitClicked(row, callerFunction);
    } );

    placeHolder(row);
}


function placeHolder(row){

    let formData = document.getElementById("RegistrationFormContent");
    let intialStoreArray = [];
    let imageFile;
    let filePath;
    let fileName;

    for(i=0; i<7; i++)
    {
        intialStoreArray[i] = row.getElementsByTagName("TD")[i].innerHTML;
    }

    formData.elements[0].value = intialStoreArray[1]; //name
    formData.elements[1].value = intialStoreArray[0]; //id
    formData.elements[2].value = intialStoreArray[2]; //email
    formData.elements[3].value = intialStoreArray[3]; //start_date
    formData.elements[4].value = intialStoreArray[4]; //end_date

    imageFile = row.getElementsByTagName("TD")[7].childNodes[0];
    filePath = imageFile.src;
    fileName = filePath.split('\\').pop().split('/').pop();

    //radio-button
    if(intialStoreArray[6] == "Sick")
    {
        document.getElementById("SickLeaveType").checked = true;
    }
    else if(intialStoreArray[6] == "Custom")
    {
        document.getElementById("CustomLeaveType").checked = true;
    }
}

function editSubmitClicked(row, callerFunction){
    let employeeInformation = getEmployeeInformation();
    let columnData;
    let filePath;

    if( formValidated(employeeInformation) ){
        for(i=0; i<7; i++)
        {
            columnData = row.getElementsByTagName("TD")[i];
            columnData.innerHTML = employeeInformation[i];
        }

        columnData = row.getElementsByTagName("TD")[7];
        filePath = employeeInformation[7].split('\\').pop().split('/').pop();
        columnData.childNodes[0].src = filePath;

        //Head information back to default
        document.getElementById("LeaveTableHeadText").innerHTML = "Register For New Leave";
        
        // changed parameters to default value 
        //show leave content and remove flex

        document.getElementById("ListContainer").style.display = "flex";
        document.getElementById("RegistrationFormContainer").style.display = "none";

        //get back to original event listener
        document.getElementById("FormSubmitButton").addEventListener( "click", formSubmitClicked );
        document.getElementById("FormSubmitButton").removeEventListener( "click", callerFunction );

        document.getElementById("RegistrationFormContent").reset();
    }
}


let date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24)) + 1;
}



//This is sort table , n=0 means by id, n=5 means by day count
//mode can be "asc" or "desc"

function sortTable( n, mode ) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("LeaveTableRowContainer");
    switching = true;

    while (switching) {

      switching = false;
      rows = table.rows;

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if(mode == "asc"){
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        else if(mode == "desc"){
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


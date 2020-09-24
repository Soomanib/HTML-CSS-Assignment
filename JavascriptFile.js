document.getElementById("FormSubmitButton").addEventListener( "click", formSubmitClicked );

document.getElementById("AddButton").addEventListener( "click", addButtonClicked );

document.getElementById("SortByID").addEventListener( "click", sortTableByID );

document.getElementById("SortByDayCount").addEventListener( "click", sortTableByDayCount );

document.getElementById("SortByIdDesc").addEventListener( "click", sortTableByIdDesc);

document.getElementById("SortByDayCountDesc").addEventListener( "click", sortTableByDayCountDesc );



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

function formValidated(employeeInformation) {
    let message = "These fields cannot be empty";
    let formValidationSection = document.getElementById("ValidateForm");

    let isValid = true;
    for(let i=0; i<8; i++)
    {
        if(employeeInformation[i] == "")
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
                    message += " File"
                break;
            }
        }
    }

    if(!isValid)
    {
        alert(message);
    }

    return isValid;
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

    if(intialStoreArray[6]=="on") //radio-button
    {
        employeeInformationArray[6] = "Casual";
    }
    else
    {
        employeeInformationArray[6] = "Sick";
    }

    return employeeInformationArray;
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
            }

            else{
                columnCell.innerHTML = employeeInformation[i];
            } 
        }
}

function deleteFormEntry(deleteButton)
{
    var row = deleteButton.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

let date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24)) + 1;
}




//This is sort table by id asc

function sortTableByID() {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("LeaveTableRowContainer");
    switching = true;

    while (switching) {

      switching = false;
      rows = table.rows;

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];


        if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
        }
      }


      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }



  //This is sort table by days count, mode is ascending


  function sortTableByDayCount() {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("LeaveTableRowContainer");
    switching = true;

    while (switching) {

      switching = false;
      rows = table.rows;

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[5];
        y = rows[i + 1].getElementsByTagName("TD")[5];

        if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


//This is sort table by id desc

function sortTableByIdDesc() {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("LeaveTableRowContainer");
    switching = true;

    while (switching) {

      switching = false;
      rows = table.rows;

      for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];


        if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
        }
 

      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }



//This is sort table by days count, mode is descending


function sortTableByDayCountDesc() {
let table, rows, switching, i, x, y, shouldSwitch;
table = document.getElementById("LeaveTableRowContainer");
switching = true;

while (switching) {

    switching = false;
    rows = table.rows;

    for (i = 0; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[5];
        y = rows[i + 1].getElementsByTagName("TD")[5];

        if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
        }
    }
    
    if (shouldSwitch) {
    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    switching = true;
    }
}
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
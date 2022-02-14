var mainTable = document.querySelector("#template_main > table > tbody").children
var subjectsTable=document.querySelectorAll("#template_main > table > tbody")[1].children

var json_subjects = {};


parseOTs(mainTable);
parseMainTable(mainTable);
parseSubjectsTable(subjectsTable)
checkboxStatus()
show()


function parseOTs(table){
    table[0].querySelectorAll("td")[0].colSpan = table[0].querySelectorAll("td")[0].colSpan-10;
    var td = document.createElement("td");
    td.className ="table_topcol"
    td.colSpan =10
    td.insertAdjacentHTML('beforeend', `<td class="table_topcol" colspan="10"><div>
  <input type="checkbox" id="show_ots" name="scales">
  <label for="scales" align=" center"> Ocultar OT's</label>
    </div></td>`);
    table[0].appendChild(td);
    document.getElementById("show_ots").onclick = function() {show()};
    
}
function show(){

    localStorage["checkbox"] = document.querySelector("#show_ots").checked

    var ots_col = document.querySelectorAll(".OT_colapse")
    if (document.querySelector("#show_ots").checked){
        for (var i = 0; i < ots_col.length; i++) {
            ots_col[i].style.visibility = "collapse";
        }
    }
    else{
        for (var i = 0; i < ots_col.length; i++) {
            ots_col[i].style.visibility = "";
        }
    }
    var ots = document.querySelectorAll(".OT")
    if (document.querySelector("#show_ots").checked){
        for (var i = 0; i < ots.length; i++) {
            if (ots[i].parentElement.className ==="") {
                ots[i].classList.add(ots[i].parentElement.querySelectorAll("td")[0].className)
            }else{
                ots[i].classList.add(ots[i].parentElement.className)
            }
            if (ots[i].title.split(": ")[2].split("\n")[0].split(",").length ==1)
                ots[i].previousSibling.style.borderRight="1px dotted #800000"
            if (ots[i].title.split(": ")[3].split("\n")[0].split(",").length ==1)
                ots[i].style.borderRight="1px dotted #800000"


            ots[i].style.pointerEvents = "none";
            ots[i].style.color = getComputedStyle(ots[i].parentElement).backgroundColor;
            console.log(ots[i])
        }
    }
    else{
        for (var i = 0; i < ots.length; i++) {
            if (ots[i].parentElement.className ==="") {
                ots[i].classList.remove(ots[i].parentElement.querySelectorAll("td")[0].className)
            }else{
                ots[i].classList.remove(ots[i].parentElement.className)
            }
            if (ots[i].title.split(": ")[2].split("\n")[0].split(",").length ==1)
                ots[i].previousSibling.style.borderRight=""
            if (ots[i].title.split(": ")[3].split("\n")[0].split(",").length ==1)
                ots[i].style.borderRight=""
            ots[i].style.pointerEvents = "";
            ots[i].style.color=""
        }
    }
}

function checkboxStatus() {

  if (localStorage["checkbox"]==undefined) {
    console.log("Undefined")
    localStorage["checkbox"]=true
    document.querySelector("#show_ots").checked = true
  }
  document.querySelector("#show_ots").checked = localStorage["checkbox"] == "true"

}




function parseMainTable(table){
    var i;
    var row;
    //Cycle through rows
    
    for(i=2;i<table.length-2;i++){
        row = table[i];
        parseRow(row);
    }
}

function parseRow(row){
    subjects =row.querySelectorAll("td.horario_turma")
    for (var i = 0; i < subjects.length; i++) {
        var aux = {}
        aux["name"]=subjects[i].innerText.split("(")[0]
        if (subjects[i].innerText.split("(")[0].includes("OT")) {
                if (subjects.length==1) {
                    subjects[i].parentElement.classList.add("OT_colapse")
                }else{
                    subjects[i].classList.add("OT")
                }
        }
        day = subjects[i].title.split(": ")[1].split("\n")[0]
        if (day == "Segunda")    
            aux["day"]= "MO"
        else if (day == "Terça")    
            aux["day"]= "TU"
        else if (day == "Quarta")    
            aux["day"]= "WE"
        else if (day == "Quinta")    
            aux["day"]= "TH"
        else if (day == "Sexta")    
            aux["day"]= "FR"
        else if (day == "Sabado")    
            aux["day"]= "SA"

        aux["start"]=subjects[i].title.split(": ")[2].split("\n")[0]
        aux["duration"]=subjects[i].title.split(": ")[3].split("\n")[0]
        aux["room"]=subjects[i].innerText.split("(")[2].replace(")","")
        if (subjects[i].bgColor in json_subjects){
            json_subjects[subjects[i].bgColor] = json_subjects[subjects[i].bgColor].concat([aux])
        }else{
            json_subjects[subjects[i].bgColor] = [aux]
        }
    }

}

function parseSubjectsTable(table){
    var i;
    var row;
    //Cycle through rows
    for(i=0;i<table.length;i++){
        row = table[i].children;
        parseSubjectsRow(row);
    }
}

function parseSubjectsRow(row){
    var tempHours;
    var datestart, dateend;
    var data;
    var link;

    if (row[1].innerText.includes("OT")) {
               row[1].parentElement.classList.add("OT_colapse")
    }
    
    //Insert link to create event in table
    
    subjects = json_subjects[row[0].bgColor]
    var newNode = document.createElement("td");
    for (var i = 0; i < subjects.length; i++) {
        var linkElement = document.createElement("a");
        var imgElement = document.createElement("img");
        link = new URL("https://www.google.com/calendar/render");
        link.searchParams.append("action", "TEMPLATE");
        link.searchParams.append("text", subjects[i]["name"]);

        tempHours = subjects[i]["start"].replace("h","").split(",")

        data = new Date(2022, 02, 07);//new Date();
        if(tempHours.length>1)
            data.setHours(tempHours[0],parseFloat(tempHours[1].replace(",","."))*6,0);
        else
            data.setHours(tempHours[0],0,0);
        
        datestart = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
        min = parseFloat(subjects[i]["duration"].replace("h","").replace(",","."))*60

        data = new Date(data.getTime()  +min*60000)
	
        dateend = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
        link.searchParams.append("dates", datestart + "/" + dateend)
        link.searchParams.append("recur","RRULE:FREQ=WEEKLY;BYDAY="+subjects[i]["day"]+";UNTIL=20220624T000000Z;");
        link.searchParams.append("location", subjects[i]["room"]);
        link.searchParams.append("sf", "true");
        link.searchParams.append("output", "xml");

        linkElement.setAttribute("href", link);
        linkElement.setAttribute("target", "_blank");

        imgElement.setAttribute("src", chrome.extension.getURL("img/calendar.png"));
        imgElement.setAttribute("title",subjects[i]["name"]+" "+subjects[i]["day"] +"\n"+subjects[i]["start"]);

        imgElement.setAttribute("height", "30");
        imgElement.setAttribute("width", "30");
        imgElement.setAttribute("alt", "Calendar Icon");

        linkElement.appendChild(imgElement);
        newNode.append(linkElement);
    }
    
    row[0].parentElement.appendChild(newNode);
    
}


mainTable = document.querySelector("#template_main > table > tbody").children
console.log(mainTable)
subjectsTable=document.querySelectorAll("#template_main > table > tbody")[1].children
var json_subjects = {};


parseMainTable(mainTable);
parseSubjectsTable(subjectsTable)




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
    console.log(json_subjects)

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
    var tempDate, tempHours;
    var datestart, dateend;
    var disciplina, data, codigo, sala, epoca;
    var link;
    
    //Insert link to create event in table
    console.log(row[0].bgColor)
    subjects = json_subjects[row[0].bgColor]
    console.log(subjects)
    var newNode = document.createElement("td");
    for (var i = 0; i < subjects.length; i++) {
        var linkElement = document.createElement("a");
        var imgElement = document.createElement("img");
        link = new URL("https://www.google.com/calendar/render");
        link.searchParams.append("action", "TEMPLATE");
        link.searchParams.append("text", subjects[i]["name"]);

        tempHours = subjects[i]["start"].replace("h","").split(",")

        data = new Date();
        if(tempHours.length>1)
            data.setHours(tempHours[0],parseFloat(tempHours[1].replace(",","."))*6,0);
        else
            data.setHours(tempHours[0],0,0);
        
        datestart = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
        min = parseFloat(subjects[i]["duration"].replace("h","").replace(",","."))*60
        console.log(min)
        data = new Date(data.getTime()+min*60000)

        dateend = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
        link.searchParams.append("dates", datestart + "/" + dateend)
        link.searchParams.append("recur","RRULE:FREQ=WEEKLY;BYDAY="+subjects[i]["day"]+";UNTIL=20210626T000000Z;");
        link.searchParams.append("location", subjects[i]["name"]);
        link.searchParams.append("sf", "true");
        link.searchParams.append("output", "xml");

        linkElement.setAttribute("href", link);
        linkElement.setAttribute("target", "_blank");

        imgElement.setAttribute("src", chrome.extension.getURL("img/calendar.png"));
        imgElement.setAttribute("height", "30");
        imgElement.setAttribute("width", "30");
        imgElement.setAttribute("alt", "Calendar Icon");

        linkElement.appendChild(imgElement);
        newNode.append(linkElement);
    }
    
    row[0].parentElement.appendChild(newNode);

    
}


mainTable = document.querySelector("#form2 > table:nth-child(2) > tbody:nth-child(1)").children;
parseMainTable(mainTable);

function parseMainTable(table){
    var i;
    var row;
    //Cycle through rows
    for(i=2;i<table.length-2;i++){
        row = table[i].children;
        parseRow(row);
    }
}

function parseRow(row){
    var tempDate, tempHours;
    var datestart, dateend;
    var disciplina, data, codigo, sala, epoca;
    var link;

    tempD = row[2].innerText.replace(" DE ", " ").replace(" E "," ").split(" ");
    disciplina = "";
    for (var j = 0; j < tempD.length; j++){
        disciplina = disciplina + tempD[j][0];
    }
    codigo = row[1].innerText;
    sala = row[4].innerText;
    if (row[6].innerText == "DZ")
        epoca = "Especial";
    else if (row[6].innerText == "FN")
        epoca = "Normal";
    else if (row[6].innerText == "RE")
        epoca = "Recurso";
    else 
        epoca = "";
    tempDate = row[0].innerText.split("/");
    tempHours = row[3].innerText.split(":")
    data = new Date();
    data.setDate(tempDate[0]);
    data.setMonth(tempDate[1]);
    data.setFullYear(tempDate[2]);
    data.setHours(tempHours[0],tempHours[1],0);

    //Create link
    link = new URL("https://www.google.com/calendar/render");
    link.searchParams.append("action", "TEMPLATE");
    link.searchParams.append("text", "Exame " + epoca + " " + disciplina);
    datestart = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
    data.setHours(data.getHours() + 2);
    dateend = data.toISOString().replace(/-|:|\.\d\d\d/g,"");
    link.searchParams.append("dates", datestart + "/" + dateend)
    link.searchParams.append("details", "Codigo: " + codigo);
    link.searchParams.append("location", sala);
    link.searchParams.append("sf", "true");
    link.searchParams.append("output", "xml");

    //Insert link to create event in table
    var newNode = document.createElement("td");
    var linkElement = document.createElement("a");
    var imgElement = document.createElement("img");

    linkElement.setAttribute("href", link);
    
    imgElement.setAttribute("src", chrome.extension.getURL("img/calendar.png"));
    imgElement.setAttribute("height", "30");
    imgElement.setAttribute("width", "30");
    imgElement.setAttribute("alt", "Calendar Icon");

    linkElement.appendChild(imgElement);
    newNode.appendChild(linkElement);

    row[0].parentElement.appendChild(newNode);
    
}


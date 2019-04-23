mainTable = document.querySelector("#template_main > table:nth-child(6) > tbody:nth-child(1)").children;
stats = parseMainTable(mainTable);
writeStats(stats);

// Write stats on table at the end of page
function writeStats(stats){
	tableToWrite = document.querySelector("#template_main > table:nth-child(8) > tbody:nth-child(1)");
	
	//Create Element to add
	var newNode1 = document.createElement("tr");
	newNode1.className = "table_cell_par";
	var newTd1 = document.createElement("td");
	newTd1.setAttribute("align", "left");
	newTd1.innerText = "Total Disciplinas";
	var newTd2 = document.createElement("td");
	newTd2.setAttribute("align", "right");
	newTd2.innerText = stats["countD"];
	//Compose element
	newNode1.appendChild(newTd1);
	newNode1.appendChild(newTd2);

	//Create Element to add
	var newNode2 = document.createElement("tr");
	newNode2.className = "table_cell_impar";
	var newTd1 = document.createElement("td");
	newTd1.setAttribute("align", "left");
	newTd1.innerText = "Media Ponderada";
	var newTd2 = document.createElement("td");
	newTd2.setAttribute("align", "right");
	newTd2.innerText = stats["media"].toFixed(2);
	
	//Compose element
	newNode2.appendChild(newTd1);
	newNode2.appendChild(newTd2);
	//Create Element to add
	var newNode3 = document.createElement("tr");
	newNode3.className = "table_cell_impar";
	var newTd1 = document.createElement("td");
	newTd1.setAttribute("align", "left");
	newTd1.innerText = "Total ECTS";
	var newTd2 = document.createElement("td");
	newTd2.setAttribute("align", "right");
	newTd2.innerText = stats["countEcts"];
	//Compose element
	newNode3.appendChild(newTd1);
	newNode3.appendChild(newTd2);
	
	//Add elements
	tableToWrite.appendChild(newNode2);
	tableToWrite.appendChild(newNode1);
	tableToWrite.appendChild(newNode3);
}

function parseMainTable (table){
	count = 0;
	countD = 0;
	sum = 0;
	// Go Through each row
	for(i=1;i<table.length;i++){
		row = table[i];
		rowInfo = parseRow(row);
		if (rowInfo == null)
			continue;
		count = count + rowInfo["ects"];
		countD++;
		sum = sum + (rowInfo["nota"]*rowInfo["ects"]);
	};
	stats = {};
	stats["media"] = sum/count;
	stats["countD"] = countD;
	stats["countEcts"] = count;
	return stats;
}

//Parse a row from the mainTable. Returns dict with info has grade
function parseRow(row){
	//Check whether row is a normal row or a opção row
	if (row.className == "table_cell_par" || row.className == "table_cell_impar"){
		row = row.children;
		return getDataFromRow(row);
	}
	else { 
		hiddenTable = row.querySelector("td>table>tbody").children;
		for(j=1; j<hiddenTable.length-1; j++){
			row = hiddenTable[j].children;
			rowInfo = getDataFromRow(row);
			if (rowInfo != null){
				return rowInfo;
			}	
		}
	}
}

//From a array of td's get info about grade and ects. Returns dict with info if has grade
function getDataFromRow(row){
	rowInfo = {};
	try{
		ects = row[row.length-2].innerText;
		nota = row[row.length-1].innerText;
	}catch(err){
		return;
	}
	ects = parseInt(ects);
	nota = parseInt(nota);
	if(Number.isNaN(ects) || Number.isNaN(nota))
		return;
	rowInfo["ects"] = ects;
	rowInfo["nota"] = nota;
	return rowInfo;
}


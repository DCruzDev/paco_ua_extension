mainTable = document.querySelector("#template_main > p:nth-child(12) > table:nth-child(1) > tbody:nth-child(1)").children;
stats = parseMainTable(mainTable);
writeStats(stats);

// Write stats on table at the end of page
function writeStats(stats){
	tableToWrite = document.querySelector("#template_main > p:nth-child(12) > table:nth-child(1) > tbody").children;
	tableToWrite = tableToWrite[tableToWrite.length-3];
	tableToWrite = tableToWrite.firstElementChild;
	//Create Element to add
	var newNode1 = document.createElement("p");	
	var newB = document.createElement("b");
	
    newB.innerText = "Dinheiro total gasto em propinas: " + stats["totalmoney"].toFixed(2) + "€";
    newNode1.appendChild(newB);
	
	//Add elements
    tableToWrite.append(newNode1);
}

function parseMainTable (table){
	sum = 0;
	// Go Through each row
	for(i=2;i<table.length-3;i++){
        row = table[i].children;
        //console.log(row);
        text = row[1].innerHTML;
        value = text.split(" ")[0].replace(",",".");
		sum = sum + parseFloat(value);
	};
	stats = {};
	stats["totalmoney"] = sum;
	return stats;
}



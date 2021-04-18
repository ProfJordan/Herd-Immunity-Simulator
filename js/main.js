// Herd Immunity Simulator
// Written by Shane Killian (http://www.shanekillian.org/apps/herd.html)
// Modified by Robert Webb (https://www.software3d.com/Home/Vax/Immunity.php)
// Re-Modified by Jordan Halliday (https://pinebee.fun/apps/covid-sim/)

// Fork on GitHub (https://github.com/ProfJordan/Herd-Immunity-Simulator)

// License: Creative Commons-Attribution-ShareAlike
// See: (http://creativecommons.org/licenses/by-sa/3.0/)
// Please attribute Shane Killian & the link: (http://www.shanekillian.org/apps/herd.html)
// as the original author; as well as attributing and linking any other derivative
// authors/creators/developers who've contributed code prior to forking in all copies and derivative works.

var xSize = 50;
var ySize = 16;


var totalVaccinated = 0;
var numInfected = 0;
var numVacInfected = 0;
var javaVaxColor = "";
var javaInfectedColor = "";

function isVac(vacRate)
{
	tmpRand = Math.random();
	if (tmpRand<(vacRate))
		return true;
	else
		return false;
}

function displayTable(populace)
{
	myCell = document.getElementById("cell0-0");
	myCell.style.color = "#000000";
	javaInfectedColor = myCell.style.color;
	myCell.style.color = "#00b000";
	javaVaxColor = myCell.style.color;

	totalVaccinated = 0;
	for (x=0;x<xSize;x++)
	{
		for (y=0;y<ySize;y++)
		{
			myCell = document.getElementById("cell"+y+"-"+x);
			if (populace[x][y])
			{
				totalVaccinated++;
				myCell.style.color = "#00b000";
				myCell.text = "o";
			}
			else
			{
				myCell.style.color = "#e00000";
				myCell.text = "o";
			}
		}
	}
	var totalPop = xSize * ySize;
	var totalUnvaccinated = totalPop - totalVaccinated;
	document.getElementById('TotalPop').value = totalPop;
	document.getElementById('VacPop').value = totalVaccinated;
	document.getElementById('UnvacPop').value = totalUnvaccinated;
}

function populate()
{
	var tmpRand,x,y;
	var vacRateLeft = document.getElementById('Left').value;
	var isSame = document.getElementById('RightSame').checked;
	if (isSame)
	{
		document.getElementById('Right').value = vacRateLeft;
	}
	var vacRateRight = document.getElementById('Right').value;
	var populace = new Array(xSize);
	for (i = 0; i < populace.length; ++ i)
		populace[i] = new Array(ySize);
	
	for (x=0;x<xSize/2;x++)
	{
		for (y=0;y<ySize;y++)
		{
			populace[x][y] = isVac(vacRateLeft);
		}
	}

	for (;x<xSize;x++)
	{
		for (y=0;y<ySize;y++)
		{
			populace[x][y] = isVac(vacRateRight);
		}
	}
	
	displayTable(populace);

	numInfected = 0;
	numVacInfected = 0;
	document.getElementById('NumInfected').value = "";
	document.getElementById('NumVacInfected').value = "";
	document.getElementById('NumUnvacInfected').value = "";
	document.getElementById('PercentInfected').value = "";
	document.getElementById('PercentVacPopInfected').value = "";
	document.getElementById('PercentUnvacPopInfected').value = "";
	document.getElementById('PercentInfectedVac').value = "";
}

function isVaccinated(x,y)
{
	myCell = document.getElementById("cell"+y+"-"+x);
	if (myCell.style.color == javaVaxColor)
	{
		// Since we're changing cell colors anyway, let's consider it storing the result
		return true;
	}
	else
		return false;
}

function isInfected(x,y)
{
	myCell = document.getElementById("cell"+y+"-"+x);
	if (myCell.style.color == javaInfectedColor)
		return true;
	else
		return false;
}

function infect(x,y)
{
	if (isInfected(x,y))
		return;

	var startX,startY,endX,endY,chance;
	var infectionRate = document.getElementById('InfectionRateNonVac').value;
	var vacInfectionRate = document.getElementById('InfectionRateVac').value;
	var infectionSpeed = document.getElementById('InfectionSpeed').value;

	myCell = document.getElementById("cell"+y+"-"+x);
	numInfected++;
	if (myCell.style.color == javaVaxColor)
	{
		numVacInfected++;
	}

	var totalPop = xSize * ySize;
	var totalUnvaccinated = totalPop - totalVaccinated;
	var numUnvacInfected = numInfected - numVacInfected;
	var percentInfected = numInfected * 100 / totalPop;
	var percentVacPopInfected = numVacInfected * 100 / totalVaccinated;
	var percentUnvacPopInfected = numUnvacInfected * 100 / totalUnvaccinated;
	var percentInfectedVac = numVacInfected * 100 / numInfected;
	document.getElementById('NumInfected').value = numInfected;
	document.getElementById('NumVacInfected').value = numVacInfected;
	document.getElementById('NumUnvacInfected').value = numUnvacInfected;
	document.getElementById('PercentInfected').value = percentInfected;
	document.getElementById('PercentVacPopInfected').value = percentVacPopInfected;
	document.getElementById('PercentUnvacPopInfected').value = percentUnvacPopInfected;
	document.getElementById('PercentInfectedVac').value = percentInfectedVac;

	myCell = document.getElementById("cell"+y+"-"+x);
	myCell.style.color = "#000000";
	myCell.text = "x";
	
	if (y <= 0)
		startY = 0;
	else
		startY = parseInt(y) - 1;
	if (x <= 0)
		startX = 0;
	else
		startX = parseInt(x) - 1;
	if (y >= ySize - 1)
		endY = ySize - 1;
	else
		endY = parseInt(y) + 1;
	if (x >= xSize - 1)
		endX = xSize - 1;
	else
		endX = parseInt(x) + 1;

	for (ix=startX;ix<=endX;ix++)
	{
		for (iy=startY;iy<=endY;iy++)
		{
			if (!isInfected(ix,iy))
			{
				if (isVaccinated(ix,iy))
					chance = vacInfectionRate
				else
					chance = infectionRate;

				if (chance>Math.random())
					setTimeout('infect('+ix+','+iy+')',(500+(5000*Math.random())) / infectionSpeed); //The recursive bit

			}
		}
	}
}

function infectThis(cellObj)
{
	var cellId = String(cellObj.id),x,y;
	y = cellId.substring(4,cellId.indexOf('-'));
	x = cellId.substring(cellId.indexOf('-')+1);
	
	infect(x,y); // Start the recursion
}

function rightSame()
{
	var isSame = document.getElementById('RightSame').checked;
	document.getElementById('Right').disabled = isSame;
	if (isSame)
	{
		populate();
	}
}

document.addEventListener("DOMContentLoaded", populate);

function infectorFunc() {
    for (y=0; y<ySize; y++)
{
	document.write('<tr>\n');
	for (x=0; x<xSize; x++)
	{
		document.write('<td><a onclick=\"infectThis(this);\" ');
		document.write('id=\"cell' + y + '-' + x + '\">o</a></td>\n');
	}
	document.write('</tr>\n');
}
}
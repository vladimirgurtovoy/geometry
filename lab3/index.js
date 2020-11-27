let x = 0;
let y = 0;
let pointZ;
let numberOfVertices=0;
let polygonIsDraw=false;
let pointZIsDraw=false;
let numberOfIntersection=0;
const h1 = document.querySelector("h1");
const help = document.querySelector("h2#help");
const h2 = document.querySelector("h2#coord");
const myPics = document.getElementById("cvs");
const btnClear = document.querySelector("button#clear");
const btnEnter = document.querySelector("button#enter");
const input=document.querySelector("input");
const context = myPics.getContext("2d");
myPics.width = 600;
myPics.height = 600;
let maxX=0;
let minX=myPics.width;
let maxY=0;
let minY=myPics.height;
let points=new Array();
btnEnter.addEventListener("click", (e)=>{
	numberOfVertices=parseInt(input.value,10);
	help.innerText = "Расставьте вершины многоугольника ("+ numberOfVertices +" штук)";
});
btnClear.addEventListener("click", (e) => {
	context.clearRect(0, 0, myPics.width, myPics.height);
	input.value="";
	points.length=0;
	numberOfVertices=0;
	pointZ=0;
	polygonIsDraw=false;
	pointZIsDraw=false;
	maxX=0;
	minX=myPics.width;
	maxY=0;
	minY=myPics.height;
	h1.innerText = "";
	h2.innerText = "";
	help.innerText = "Введите количество вершин многоугольника и нажмите кнопку 'Ввести'";
});
// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener("mousedown", (e) => {
	if(!polygonIsDraw) {
		if(points.length!=numberOfVertices) {
			x = e.offsetX;
			y = e.offsetY;
			if(x<minX) {
				minX=x;
			} else if(x>maxX) {
				maxX=x;
			}
			if(y<minY) {
				minY=y;
			} else if(y>maxY) {
				maxY=y;
			}
			drawPoint(context, x, y,"black");
			points.push([x,y]);
			if(points.length===numberOfVertices) {
				drawLines(context, points);
				help.innerText = "Многоульник построен. Укажите место точки Z";
			}
		}
	} else if(polygonIsDraw && !pointZIsDraw) {
		x = e.offsetX;
		y = e.offsetY;
		pointZ=[x,y,myPics.width,y];
		drawPoint(context, x, y,"red");
		pointZIsDraw=true;
		drawLine(context,pointZ[0],pointZ[1],pointZ[2],pointZ[3]);
		help.innerText = "Точка Z и горизонтальный луч из неё построены!";
		getCoordIntersectionPoint(pointZ,points);
	}
});

function drawLine(context, x1, y1, x2, y2) { //построить луч
	context.beginPath();
	context.strokeStyle = "red";
	context.lineWidth = 8;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}


function drawPoint(context, x, y,color) { //построить точку
		context.fillStyle = color;
		context.fillRect(x - 8, y - 8, 16, 16);
}

function drawLines(context, points) { //построить грани многокгольника
		context.beginPath();
		context.strokeStyle = "black";
		context.lineWidth = 8;
		context.moveTo(points[0][0], points[0][1]);
		context.lineTo(points[points.length-1][0], points[points.length-1][1]);
		context.stroke();
		context.closePath();
	for(let i=0;i<points.length-1;i++) {
		context.beginPath();
		context.strokeStyle = "black";
		context.lineWidth = 8;
		context.moveTo(points[i][0], points[i][1]);
		context.lineTo(points[i+1][0], points[i+1][1]);
		context.stroke();
		context.closePath();	
	}
	polygonIsDraw=true;
}


function getCoordIntersectionPoint(pointZ, points) {
	if(pointZ[0]<minX || pointZ[0]>maxX || pointZ[1]<minY || pointZ[1]>maxY) {
		h1.style.color = "red";
		h1.textContent = "Точка находится вне многоугольника!";
		h2.textContent="Чтобы построить новый многоугольник нажмите кнопку 'Очистить'";
	} else {
		let intersectionPoints=new Array();
	//параметры луча
	let A1 = (pointZ[3] - pointZ[1]) / (pointZ[0] - pointZ[2]);
	let C1 = (pointZ[2] * pointZ[1] - pointZ[0] * pointZ[3]) / (pointZ[0] - pointZ[2]);
	

	let A2 = (points[points.length-1][1] - points[0][1]) / (points[0][0] - points[points.length-1][0]);
	let C2 = (points[points.length-1][0] * points[0][1] - points[0][0] * points[points.length-1][1]) / (points[0][0] - points[points.length-1][0]);
	if (Math.abs(A1 - A2) > 0.01) {
		let d = -A1 + A2;
		let dx = C1 - C2;
		let dy = -A1 * C2 + A2 * C1;
		let x = dx / d;
		let y = dy / -d;
		intersectionPoints.push([x,y]);
		if(points[0][0]<points[points.length-1][0]) {
			if (x >= pointZ[0] && x <= pointZ[2] && x >= points[0][0] && x <= points[points.length-1][0]) {
				numberOfIntersection++;
			}
		} else {
			if (x >= pointZ[0] && x <= pointZ[2] && x >= points[points.length-1][0] && x <= points[0][0]) {
				numberOfIntersection++;
			}
		}
	}
	//параметры граней
	for(let i=0;i<points.length-1;i++) {
		let A2 = (points[i+1][1] - points[i][1]) / (points[i][0] - points[i+1][0]);
		let C2 = (points[i+1][0] * points[i][1] - points[i][0] * points[i+1][1]) / (points[i][0] - points[i+1][0]);
		if (Math.abs(A1 - A2) > 0.01) {
			let d = -A1 + A2;
			let dx = C1 - C2;
			let dy = -A1 * C2 + A2 * C1;
			let x = dx / d;
			let y = dy / -d;
			intersectionPoints.push([x,y]);
			if(points[i][0]<points[i+1][0]) {
				if (x >= pointZ[0] && x <= pointZ[2] && x >= points[i][0] && x <= points[i+1][0]) {
					numberOfIntersection++;
				}
			} else {
				if (x >= pointZ[0] && x <= pointZ[2] && x >= points[i+1][0] && x <= points[i][0]) {
					numberOfIntersection++;
				}
			}
		}
	}
	if(numberOfIntersection%2 !== 0) {
		h1.style.color = "green";
		h1.textContent = "Точка находится внутри многоугольника!";
		h2.textContent="Чтобы построить новый многоугольник нажмите кнопку 'Очистить'";
	} else {
		h1.style.color = "red";
		h1.textContent = "Точка находится вне многоугольника!";
		h2.textContent="Чтобы построить новый многоугольник нажмите кнопку 'Очистить'";
	}
	}
}

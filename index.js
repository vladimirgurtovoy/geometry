let firstLineIsDraw = false;
let secondLineIsDraw = false;
let x = 0;
let y = 0;
const h1 = document.querySelector("h1");
const help = document.querySelector("h2#help");
const h2 = document.querySelector("h2#coord");
const myPics = document.getElementById("cvs");
const btn = document.querySelector("button");
const context = myPics.getContext("2d");
myPics.width = 600;
myPics.height = 600;
let line1 = [-1, -1, -1, -1];
let line2 = [-1, -1, -1, -1];
btn.addEventListener("click", (e) => {
	context.clearRect(0, 0, myPics.width, myPics.height);
	line1 = [-1, -1, -1, -1];
	line2 = [-1, -1, -1, -1];
	firstLineIsDraw = false;
	secondLineIsDraw = false;
	h1.innerText = "";
	h2.innerText = "";
	help.innerText = "Укажите точку начала первого отрезка!";
});
// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener("mousedown", (e) => {
	x = e.offsetX;
	y = e.offsetY;
	if (!firstLineIsDraw) {
		drawPoint(context, x, y);
		SetFirstLineCoord(x, y);
	} else {
		drawPoint(context, x, y);
		SetSecondLineCoord(x, y);
	}
});

function drawLine(context, x1, y1, x2, y2) {
	context.beginPath();
	context.strokeStyle = "black";
	context.lineWidth = 8;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}

function drawPointIntersection(context, x, y) {
	context.fillStyle = "red";
	context.fillRect(x - 10, y - 10, 20, 20);
}
function drawPoint(context, x, y) {
	if (!secondLineIsDraw) {
		context.fillStyle = "green";
		context.fillRect(x - 8, y - 8, 16, 16);
	}
}

function SetFirstLineCoord(x, y) {
	if (line1[0] === -1 && line1[2] === -1) {
		line1[0] = x;
		line1[1] = y;
		help.innerText = "Укажите точку конца первого отрезка!";
	} else if (line1[2] === -1 && line1[3] === -1) {
		if (x < line1[0]) {
			line1[2] = line1[0];
			line1[3] = line1[1];
			line1[0] = x;
			line1[1] = y;
			drawLine(context, line1[0], line1[1], line1[2], line1[3]);
			firstLineIsDraw = true;
			help.innerText = "Укажите точку начала второй отрезка!";
		} else {
			line1[2] = x;
			line1[3] = y;
			drawLine(context, line1[0], line1[1], line1[2], line1[3]);
			firstLineIsDraw = true;
			help.innerText = "Укажите точку начала второй отрезка!";
		}
	}
}

function SetSecondLineCoord(x, y) {
	if (line2[0] === -1 && line2[2] === -1) {
		line2[0] = x;
		line2[1] = y;
		help.innerText = "Укажите точку конца второго отрезка!";
	} else if (line2[2] === -1 && line2[3] === -1) {
		if (x < line2[0]) {
			line2[2] = line2[0];
			line2[3] = line2[1];
			line2[0] = x;
			line2[1] = y;
			drawLine(context, line2[0], line2[1], line2[2], line2[3]);
			secondLineIsDraw = true;
			help.innerText =
				"Отрезки построены! Чтобы построить заново, нажмите 'ОЧИСТИТЬ'";
		} else {
			line2[2] = x;
			line2[3] = y;
			drawLine(context, line2[0], line2[1], line2[2], line2[3]);
			secondLineIsDraw = true;
			help.innerText =
				"Отрезки построены! Чтобы построить заново, нажмите 'ОЧИСТИТЬ'";
		}
		console.log(line2);
		if (secondLineIsDraw) {
			getCoordIntersectionPoint();
		}
	}
}

function getCoordIntersectionPoint() {
	let A1 = (line1[3] - line1[1]) / (line1[0] - line1[2]);
	let C1 = (line1[2] * line1[1] - line1[0] * line1[3]) / (line1[0] - line1[2]);
	let A2 = (line2[3] - line2[1]) / (line2[0] - line2[2]);
	let C2 = (line2[2] * line2[1] - line2[0] * line2[3]) / (line2[0] - line2[2]);
	console.log("A1=", A1);
	console.log("A2=", A2);

	if (Math.abs(A1 - A2) > 0.01) {
		h1.style.color = "red";
		let d = -A1 + A2;
		let dx = C1 - C2;
		let dy = -A1 * C2 + A2 * C1;
		let x = dx / d;
		let y = dy / -d;
		if (x >= line1[0] && x <= line1[2] && x >= line2[0] && x <= line2[2]) {
			h1.textContent = "Отрезки пересекаются";
			h2.textContent =
				"Точка пересечения: (" + Math.round(x) + "; " + Math.round(y) + ")";
			drawPointIntersection(context, x, y);
		} else {
			h1.textContent = "Отрезки не пересекаются";
			h1.style.color = "green";
		}
	}
}

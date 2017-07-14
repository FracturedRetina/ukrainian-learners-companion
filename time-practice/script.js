var hour;
var minute;

function isAnalog() {
	if ($('#analog').is(":checked")) {
		return true;
	} else if ($('#digital').is(":checked")) {
		return false;
	} else {
		return false;
	}
}

function refreshTime() {
	hour = Math.floor((Math.random() * 24));
	minute = Math.floor((Math.random() * 60));
	
	if (isAnalog()) {
		$('#text-time').css("display", "none");
		$('#clock-time').css("display", "block");
		drawClock(hour, minute);
	} else {
		$('#clock-time').css("display", "none");
		$('#text-time').css("display", "block");
		$('#text-time').text(getDigitialTime(hour, minute));
	}
}

function getDigitialTime(hour, minute) {
	if (minute < 10) {
		return hour.toString() + ":0" + minute.toString();
	} else {
		return hour.toString() + ":" + minute.toString();
	}
}

function checkAns() {
	var correctAns = timeAsWords(hour, minute);
	
	if ($('#word-form').val().toLowerCase() == correctAns) {
		$('#feedback').text("Correct!");
		$('#feedback').css("color", "green");
		console.log("Correct!");
	} else {
		$('#feedback').text(correctAns);
		$('#feedback').css("color", "red");
		console.log("Correct Answer: " + correctAns);
	}
	$('#feedback').slideDown();
}

function timeAsWords(hour, minute) {
	var hourStr = numberToWords(hour, true);
	var hrSuffix = hourStr.substring(hourStr.length - 2);
	if (hrSuffix == "ій") {
		hourStr = hourStr.substring(0, hourStr.length - 2) + "я";
	} else if (hrSuffix == "ий") {
		hourStr = hourStr.substring(0, hourStr.length - 2) + "а";
	}
	
	if (minute != 0) {
		var minStr = numberToWords(minute, false);
		var minSuffix = "";
		
		if (minute % 10 == 1) {
			minSuffix = "а";
			if (minute != 11) {
				minStr = minStr.substring(0, minStr.length - 4) + "одна";
			}
		} else if (minute % 10 >= 2 && minute % 10 <= 4) {
			minSuffix = "и";
		}
		
		return hourStr + " година " + minStr + " хвилин" + minSuffix;
	} else {
		return hourStr + " година";
	}
}

function drawClock(hour, minute) {
	var c = document.getElementById("clock-time");
	var ctx = c.getContext("2d");
	var radius = Math.min(c.width / 2, c.height / 2) - 2;
	var centX = c.width / 2;
	var centY = c.height / 2;
	
	//Correctly orient clock
	ctx.rotate(Math.PI / -2);
	ctx.translate(-c.width, 0);
	
	//Clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	//Draw rim
	ctx.beginPath();
		ctx.arc(centX, centY, radius, 0, 2 * Math.PI);
	ctx.stroke();
	
	//Draw Ticks
	for (var i = 0; i < 60; i++) {
		var x1 = Math.cos((i / 60) * (2 * Math.PI)) * (radius * .95);
		var y1 = Math.sin((i / 60) * (2 * Math.PI)) * (radius * .95);
		var x2;
		var y2;
		if (i % 5 == 0) {
			x2 = Math.cos((i / 60) * (2 * Math.PI)) * (radius * .80);
			y2 = Math.sin((i / 60) * (2 * Math.PI)) * (radius * .80);
		} else {
			x2 = Math.cos((i / 60) * (2 * Math.PI)) * (radius * .90);
			y2 = Math.sin((i / 60) * (2 * Math.PI)) * (radius * .90);
		}
		ctx.moveTo(centX + x1, centY + y1);
		ctx.lineTo(centX + x2, centY + y2);
		ctx.stroke();
	}
	
	//Draw hands
	//Hour hand
	ctx.moveTo(centX, centY);
	ctx.lineTo(
		centX + Math.cos(((hour + minute / 60) / 12) * (2 * Math.PI)) * (radius / 2),
		centY + Math.sin(((hour + minute / 60) / 12) * (2 * Math.PI)) * (radius / 2)
	);
	ctx.stroke();
	//Minute hand
	ctx.moveTo(centX, centY);
	ctx.lineTo(
		centX + Math.cos((minute / 60) * (2 * Math.PI)) * (radius * .80),
		centY + Math.sin((minute / 60) * (2 * Math.PI)) * (radius * .80)
	);
	ctx.stroke();
	
	//Reset canvas transformation
	ctx.translate(c.width, 0);
	ctx.rotate(Math.PI / 2);
	
	//AM/PM
	ctx.font = "30px Arial";
	if (hour < 12) {
		ctx.fillText("AM", c.width - 45 - 2, c.height - 2); 
	} else {
		ctx.fillText("PM", c.width - 45 - 2, c.height - 2);
	}
	
	console.log(getDigitialTime(hour, minute));
}

$(document).ready(function() {
	refreshTime();
	$('input[type=radio]').change(refreshTime);
	$('#refresh').click(refreshTime);
	$('#word-form').keypress(function(e) {
		if (e.which == 13) {
			if ($('#feedback').css("display") == "none") {
				checkAns();
			} else {
				refreshTime();
				$('#word-form').val("");
			}
		}
	});
});
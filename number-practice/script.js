//Check radio buttons for range
function getRange() {
	if ($('#max10').is(":checked")) {
		return 10;
	} else if ($('#max100').is(":checked")) {
		return 100;
	} else if ($('#max1000').is(":checked")) {
		return 1000;
	} else {
		return 10;
	}
}

//Check radio buttons for cardinal/ordinal
function isCardinal() {
	if ($('#cardinal').is(":checked")) {
		return true;
	} else if ($('#ordinal').is(":checked")) {
		return false;
	} else {
		return true;
	}
}

//Clear existing number and feedback,
//replace with new number
function refreshNumber() {
	//Generate random number
	var num = Math.floor((Math.random() * getRange())).toString();
	
	//If ordinal
	if (!isCardinal()) {
		//Prevent 0th
		if (num == "0") {
			num = Math.floor((Math.random() * (getRange() - 1))) + 1;
		}

		//Add appropriate ordinality suffix
		if (num[num.length - 1] == "1") {
			num = num + "st";
		} else if (num[num.length - 1] == "2") {
			num = num + "nd";
		} else if (num[num.length - 1] == "3") {
			num = num + "rd";
		} else {
			num = num + "th";
		}
	}

	//Put number in textfield
	$("#number").text(num);
	//Hide previous feedback
	$("#feedback").slideUp();
}

function checkAns() {
	var correctAns = numberToWords($('#number').text());
	
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

$(document).ready(function() {
	refreshNumber();
	$('input[type=radio]').change(refreshNumber);
	$('#refresh').click(refreshNumber);
	$('#word-form').keypress(function(e) {
		if (e.which == 13) {
			if ($('#feedback').css("display") == "none") {
				checkAns();
			} else {
				refreshNumber();
				$('#word-form').val("");
			}
		}
	});
});
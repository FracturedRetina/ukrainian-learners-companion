var ordinals = {
	"1":"перший",
	"2":"другий",
	"3":"третій",
	"4":"четвертий",
	"5":"п'ятий",
	"6":"шостий",
	"7":"сьомий",
	"8":"восьмий",
	"9":"дев'ятий",
	"10":"десятий",
	"11":"одинадцятий",
	"12":"дванадцятий",
	"13":"тринадцятий",
	"14":"чотирнадцятий",
	"15":"п'ятнадцятий",
	"16":"шістнадцятий",
	"17":"сімнадцятий",
	"18":"вісімнадцятий",
	"19":"дев'ятнадцятий",
	"20":"двадцятий",
	"30":"тридцятий",
	"40":"сороковий",
	"50":"п'ятдесятий",
	"60":"шістдесятий",
	"70":"сімдесятий",
	"80":"вісімдесятий",
	"90":"дев'яностий",
	"100":"сотий",
	"200":"двохсотий",
	"300":"трьохсотий",
	"400":"чотирьохсотий",
	"500":"п'ятисотий",
	"600":"шестисотий",
	"700":"семисотий",
	"800":"восьмисотий",
	"900":"дев'ятисотий",
	"1000":"тисячний"
}

var baseNumbers = {
	"0":"нуль",
	"1":"один",
	"2":"два",
	"3":"три",
	"4":"чотири",
	"5":"п'ять",
	"6":"шість",
	"7":"сім",
	"8":"вісім",
	"9":"дев'ять",
	"20":"двадцять",
	"30":"тридцять",
	"40":"сорок",
	"50":"п'ятдесят",
	"60":"шістдесят",
	"70":"сімдесят",
	"80":"вісімдесят",
	"90":"дев'яносто",
	"100":"сто",
	"200":"двісті",
	"300":"триста",
	"400":"чотириста",
	"500":"п'ятсот",
	"600":"шістсот",
	"700":"сімсот",
	"800":"вісімсот",
	"900":"дев'ятсот",
	"1000":"тисяча"
};

var specialNumbers = {
	"10":"десять",
	"11":"одинадцять",
	"12":"дванадцять",
	"13":"тринадцять",
	"14":"чотирнадцять",
	"15":"п'ятнадцять",
	"16":"шістнадцять",
	"17":"сімнадцять",
	"18":"вісімнадцять",
	"19":"дев'ятнадцять"
};

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

//Convert numeral to words
function numberToWords(num) {
	var digits = num.toString();
	var words = "";
	var cardinal = isCardinal();

	//Remove ordinality suffix
	if (!cardinal && isNaN(digits.toString()[digits.length - 1])) {
		digits = digits.substring(0, digits.length - 2);
	}

	//Iterate through digits
	for (var i = 1; i <= digits.length; i++) {
		if (i == 1) {
			//If not teen
			if (digits.length == 1 || digits[digits.length - 2] != "1") {
				//If ends with 0
				if (digits[digits.length - 1] == "0") {
					if (digits.length == 1) {
						if (cardinal) {
							words = baseNumbers[digits[digits.length - i]];
						} else {
							words = ordinals[digits[digits.length - i]];
						}
					}
				//If not ending with 0
				} else {
					if (cardinal) {
						words = baseNumbers[digits[digits.length - i]];
					} else {
						words = ordinals[digits[digits.length - i]];
					}
				}

				//Handle twenties, thirties, etc
				if (digits.length != 1 && digits[digits.length - 2] != "0") {
					if (cardinal || digits[digits.length - 1] != 0) {
						words = baseNumbers[digits[digits.length - 2] + "0"] + " " + words;
					} else {
						words = ordinals[digits[digits.length - 2] + "0"] + " " + words;
					}
				}
			//If teen
			} else {
				if (cardinal) {
					words = specialNumbers[digits.substring(digits.length - 2, num.length)];
				} else {
					words = ordinals[digits.substring(digits.length - 2, num.length)];
				}
			}
			//Increment i because two places are handled at once
			//ones and tens
			i++;
		//All digits >= 100
		} else {
			//Whether current digit is last significant
			var currOrd = true;

			//Make sure current digit isn't zero
			if (digits[digits.length - i] == "0") {
				continue;
			}

			//Number without trailing zeros
			//Ex 1000 is 1
			numInPlace = digits[digits.length - i];
			//Check power of number and add trailing zeros
			for (var z = 1; z < i; z++) {
				//If any significant digits smaller than number, clear ordinality
				if (digits[z] != "0") {
					currOrd = false;
				}
				numInPlace += "0";
			}
			
			//If ordinal and current digit should have ordinality suffix
			if (!cardinal && currOrd) {
				words = ordinals[numInPlace] + " " + words;
			} else {
				words = baseNumbers[numInPlace] + " " + words;
			}
		}
	}

	//Remove trailing space
	if (words[words.length - 1] == " ") {
		words = words.substring(0, words.length - 1);
	}


	return words;
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
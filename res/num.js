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

//Convert numeral to words
function numberToWords(num, ordinal) {
	var digits = num.toString();
	var words = "";

	//Remove ordinality suffix
	if (ordinal && isNaN(digits.toString()[digits.length - 1])) {
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
						if (!ordinal) {
							words = baseNumbers[digits[digits.length - i]];
						} else {
							words = ordinals[digits[digits.length - i]];
						}
					}
				//If not ending with 0
				} else {
					if (!ordinal) {
						words = baseNumbers[digits[digits.length - i]];
					} else {
						words = ordinals[digits[digits.length - i]];
					}
				}

				//Handle twenties, thirties, etc
				if (digits.length != 1 && digits[digits.length - 2] != "0") {
					if (!ordinal || digits[digits.length - 1] != 0) {
						words = baseNumbers[digits[digits.length - 2] + "0"] + " " + words;
					} else {
						words = ordinals[digits[digits.length - 2] + "0"] + " " + words;
					}
				}
			//If teen
			} else {
				if (!ordinal) {
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
			if (ordinal && currOrd) {
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
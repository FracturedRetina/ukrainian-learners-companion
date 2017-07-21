var consonant = "(й|ц|к|н|г|ш|щ|з|х|ґ|ф|в|п|р|л|д|ж|ч|с|м|т|б)";
var noEnding = "(й|ц|к|н|г|ш|щ|з|х|ґ|ф|в|п|р|л|д|ж|ч|с|м|т|б|ь)";

var cases = ["Nominative", "Genitive", "Dative", "Accusative", "Instrumental", "Locative", "Vocative"];

var nounChanges;
var dictionary;
var currWord;

function declineNoun(word, kase, plural, declension, animate, gentype) {
	kase = kase.toLowerCase()[0];
	var updated;
	
	if (plural) {
		change = nounChanges[kase][declension]["plural"];
	} else {
		change = nounChanges[kase][declension]["singular"];
	}
	
	if (!(kase == "n" && !plural) && !(kase == "a" && !plural && !animate && declension == 2) && !(kase == "a" && !plural && declension == 3)) {
		for (var i = 3; i > 1; i--) {
			if (word.match(noEnding + "{" + (i - 1) + "}$") != null) {
				if (word[word.length - i] == "о" || word[word.length - i] == "е") {
					word = word.substring(0, word.length - i) + word[word.length - (i - 1)];
					break;
				}
			}
		}
	} else {
		return word;
	}
	
	if (change.hasOwnProperty("animate")) {
		if (animate) {
			change = change["animate"];
		} else {
			change = change["inanimate"];
		}
	}
	
	for (var ending in change) {
		if (change.hasOwnProperty(ending)) {
			if (typeof ending != "string") {
				ending = ending[gentype];
			}
			
			if (change[ending][0] == "+") {
				if (word.match(consonant + "$") != null) {
					updated = word + change[ending].substring(1);
					if (updated.match("#") != null) {
						updated[updated.indexOf("#")] = updated[updated.indexOf("#") - 1];
					}
					return updated;
				}
			} else {
				updated = word.replace(new RegExp(ending.replace("#", consonant) + "$"), change[ending]);
			}
			if (word != updated) {
				return updated;
			}
		}
	}
}

function refreshWord() {
	currWord = dictionary[Math.floor(Math.random() * dictionary.length)];
	$('#word').text(currWord[0]);
	$('#case').text(cases[Math.floor(Math.random() * cases.length)]);
	if (Math.random() > .5 && $('#case').text() != "Nominative") {
		$('#plurality').text("Singular");
	} else {
		$('#plurality').text("Plural");
	}
	//Hide previous feedback
	$("#feedback").slideUp();
	//Clear previous answer
	$('#input-form').val("");
}

function checkAns() {
	var plurality;
	
	if ($('#plurality').text() == "Singular") {
		plurality = false;
	} else if ($('#plurality').text() == "Plural") {
		plurality = true;
	}
	
	var correctAns = declineNoun($('#word').text(), $('#case').text(), plurality, currWord[1], currWord[2], currWord[3]);
	
	if ($('#input-form').val().toLowerCase() == correctAns) {
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
	$.ajaxSetup({
		scriptCharset: "utf-8",
		beforeSend: function(xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});
	
	$.ajax({
		"dataType": "json",
		"url": "noun-cases.json",
		"success": function(data) {
			nounChanges = data;
		}
	});
	
	$.ajax({
		"dataType": "text",
		"url": "dictionary-nouns.csv",
		"success": function(data) {
			dictionary = parseCsv(data);
			refreshWord();
		}
	});
	
	$('#refresh').click(refreshWord);
	$('#input-form').keypress(function(e) {
		if (e.which == 13) {
			if ($('#feedback').css("display") == "none") {
				checkAns();
			} else {
				refreshWord();
				$('input-form').val("");
			}
		}
	});
});
	
function parseCsv(text) {
	var list = [];
	var lines = text.split("\n");
	for (var i = 1; i < lines.length; i++) {
		list.push([]);
		var cells = lines[i].split(",");
		
		for (var j = 0; j < cells.length; j++) {
			if (cells[j].match("\\|") != null) {
				list[i - 1].push(cells[j].split("|"));
			} else {
				list[i - 1].push(cells[j]);
			}
		}
	}
	
	return list;
}


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
	var hour = Math.floor((Math.random() * 24));
	var minute = Math.floor((Math.random() * 60));
	
	//Set digital
	if (minute < 10) {
		$('#text-time').text(hour.toString() + ":0" + minute.toString());
	} else {
		$('#text-time').text(hour.toString() + ":" + minute.toString());
	}
}

function checkAns() {

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
				refreshNumber();
				$('#word-form').val("");
			}
		}
	});
});
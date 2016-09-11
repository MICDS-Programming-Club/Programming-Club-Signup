var socket = io();

var form = document.getElementsByClassName('signup-form')[0];
var $form = $('form');
var $submitForm = $('.signup-submit');

var $emailFieldset = $('.signup-email-fieldset');
var $emailInput = $('.signup-email-input');
var $emailWarning = $('.signup-email-warning');
var emailHeight = $emailWarning.height();

var $firstName = $('.signup-firstName-input');
var $lastName = $('.signup-lastName-input');

var $gradYear = $('.signup-gradYear-input');
var gradYears = getGradeRange();

function validateForm() {
	if($emailInput.val().length > 0) {
		// Email input has text
		if($firstName.val().length > 0 && $lastName.val().length > 0) {
			$submitForm.prop('disabled', false);
		}

		// Test if string is alphabetic
		if(/^[A-Za-z]+$/.test($emailInput.val())) {
			// Don't show warning
			$emailFieldset.removeClass('has-warning');
			$emailWarning.animate({ height: 0 }, 600, 'easeInOutCirc');
		} else {
			// Show warning
			$emailFieldset.addClass('has-warning');
			$emailWarning.animate({ height: $emailWarning.get(0).scrollHeight }, 600, 'easeInOutCirc');
		}
	} else {
		// Email input is emptyfds
		$submitForm.prop('disabled', true);

		$emailFieldset.removeClass('has-warning');
		$emailWarning.animate({ height: 0 }, 600, 'easeInOutCirc');
	}
}

function getGradeRange() {
	var years = [];
	var currentYear = new Date().getFullYear();

	// Get this year and next 3 years
	for(var i = 0; i < 4; i++) {
		years.push(currentYear + i + 1);
	}

	years.reverse();
	return years;
}

// Append graduation years to input
for(var i = 0; i < gradYears.length; i++) {
	$gradYear.append('<option value=' + gradYears[i] + '>Class of ' + gradYears[i] + '</option>');
}

validateForm();
$emailInput.on('change keyup paste', validateForm);
$firstName.on('change keyup paste', validateForm);
$lastName.on('change keyup paste', validateForm);

$form.submit(function(event) {
	event.preventDefault();

	var data = $(this).serializeArray();
	var formData = {};
	for(var i = 0; i < data.length; i++) {
		var formInput = data[i];
		if(formInput.name === 'gradYear') {
			formInput.value = parseInt(formInput.value);
		}
		formData[formInput.name] = formInput.value;
	}

	socket.emit('signup', formData);
	console.log(formData);

	// Reset form data for next user
	form.reset();
	validateForm();
});

socket.on('signup response', function(success, message) {
	console.log(success, message);
});

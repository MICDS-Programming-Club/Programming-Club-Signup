var socket = io();

var $html = $('html');

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

var $loading = $('.signup-loading');
var $loadingMessage = $('.loading-message');

// As soon as Javascript executes, loading sign will hide
// It's not a bug, it's a "feature"
$loading.hide();

// Do form validation logic
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

// Get graduation years of everyone in highschool
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

// Validate form if any of the inputs are changed
validateForm();
$emailInput.on('change keyup paste', validateForm);
$firstName.on('change keyup paste', validateForm);
$lastName.on('change keyup paste', validateForm);

$form.submit(function(event) {
	event.preventDefault();

	// Loop through form and convert to object
	var data = $(this).serializeArray();
	var formData = {};
	for(var i = 0; i < data.length; i++) {
		var formInput = data[i];
		if(formInput.name === 'gradYear') {
			formInput.value = parseInt(formInput.value);
		}
		formData[formInput.name] = formInput.value;
	}

	// Send form data to server
	socket.emit('signup', formData);
	console.log(formData);

	// Scroll to top of page
	$('html, body').animate({
		scrollTop: $html.offset().top,
	}, 600, 'easeInOutCirc');

	// Show loading message
	$loadingMessage.text('Signing you up...');
	$loading.fadeIn(600);
});

// When we receive response from server after submitting form
socket.on('signup response', function(success, message) {
	console.log(success, message);

	// If error, show message
	if(!success) {
		$loadingMessage.text('Uh oh... Something bad happened. Please try registering again.');
		setTimeout(function() {
			$loading.fadeOut(600);
		}, 3000);
		return;
	}

	// Reset form because student already registered
	form.reset();
	validateForm();

	// Show success message
	$loadingMessage.text('Thanks for registering!');
	setTimeout(function() {
		$loading.fadeOut(600);
	}, 1500);
});

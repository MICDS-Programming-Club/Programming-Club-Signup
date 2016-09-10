var socket = io();

var form = document.getElementsByClassName('signup-form')[0];
var $form = $('form');
var $submitForm = $('.signup-submit');

var $emailFieldset = $('.signup-email-fieldset');
var $emailInput = $('.signup-email-input');
var $emailWarning = $('.signup-email-warning');

var emailHeight = $emailWarning.height();

function validateForm() {
	if($emailInput.val().length > 0) {
		// Email input has text
		$submitForm.prop('disabled', false);

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

validateForm();
$emailInput.on('change keyup paste', validateForm);

$form.submit(function(event) {
	event.preventDefault();

	var data = $(this).serializeArray();
	var formData = {};
	for(var i = 0; i < data.length; i++) {
		var formInput = data[i];
		formData[formInput.name] = formInput.value;
	}

	socket.emit('signup', formData);
	console.log(formData);

	// Reset form data for next user
	form.reset();
	emailTouched = false;
});

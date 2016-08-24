var socket = io();
var $form = $('form');

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
});

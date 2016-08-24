var $form = $('form');

$form.submit(function(event) {
	event.preventDefault();
	var data = $(this).serialize();
	console.log(data);
});

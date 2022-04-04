
// ------------------- MAIN FUNCTIONS -------------------

// these ajax functions are used on the other frontend js files
function getRequest(url, callback) {
	let jqxhr = $.ajax({ 
		url: url 
	});
	jqxhr.done(data => callback(data));
	jqxhr.fail(err => {
		console.error(err);
		Swal.fire("Error", err.responseText, "error");
	});
}
function postRequest(url, data, callback) {
	let jqxhr = $.ajax({
		url: url,
		type: "POST",
		data, data,
		enctype: 'multipart/form-data',
		processData: false,
		contentType: false
	});
	jqxhr.done(() => callback());
	jqxhr.fail(err => {
		console.error(err);
		Swal.fire("Error", err.responseText, "error");
	});
}
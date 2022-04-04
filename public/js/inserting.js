
// page routing
$(document).ready(() => {
	let pathName = window.location.pathname;
	switch (pathName) {
		case "/addBooks":
			$("#addBooksForm").submit(e => insertBook(e));
			break;
		case "/addReaders":
			$("#addReadersForm").submit(e => insertReader(e));
			break;
	}
});

// validate and display img of book
function displayImg() {
	let picDisplay = document.querySelector("#imgDisplay");
    let imgInput = document.querySelector("#img");
    let file = imgInput.files[0];
    let imageType = /image.*/; 
    if (file.type.match(imageType)) { 
        let reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onload = function () {
            picDisplay.innerHTML = "";
            var img = new Image();
            img.className = 'submittedPic';
            img.src = reader.result;
            img.width = 200;
            img. height = 225;
            picDisplay.appendChild(img);
        };
    } else {
        Swal.fire("Error", "File type not supported", "error");
        document.querySelector("#img").value = "";
		document.querySelector("#imgDisplay").innerHTML = "";
    };
}

// for the loan model form,
// set values and enter reader names in select element
$("#loanModal").on("show.bs.modal", event => {
	let button = $(event.relatedTarget);
	let title = button.data("title");
	let id = button.data("id");
	$("#loanModal").find(".modal-title").text("Loan " + title);
	getRequest(`/query?col=*&table=readers`, (data) => {
		let options = "<option value='' hidden></option>";
		for (let i = 0; i < data.length; i++) {
			options += `
			<option value="${data[i].reader_id}">
				${data[i].first_name} ${data[i].last_name}
			</option>`;
		}
		$("#loanModal").find("#reader").html(options);
		$("#saveLoanBtn").attr("data-bookId", id);
	});
});

// ------------------- INSERTING -------------------
function insertBook(event) {
	event.preventDefault();
	let book = new FormData();
	book.append("title", $("#title").val().trim());
	book.append("author", $("#author").val().trim());
	book.append("genre", $("#genre").val());
	book.append("img", $("#img")[0].files[0]);
    postRequest("/addBooks/insert", book, () => {
		Swal.fire("Success", "Book was successfully submitted.", "success")
		document.getElementById("addBooksForm").reset();
        document.querySelector("#img").value = "";
		document.querySelector("#imgDisplay").innerHTML = "";
    });
}

function insertReader(event) {
	event.preventDefault();
	let reader = new FormData();
	reader.append("first_name", $("#first_name").val().trim());
	reader.append("last_name", $("#last_name").val().trim());
	reader.append("email", $("#email").val().trim());
	reader.append("phone_number", $("#phone_number").val().trim());
	postRequest("/addReaders/insert", reader, () => {
		Swal.fire("Success", "Reader was successfully submitted.", "success");
        document.getElementById("addReadersForm").reset();
	});
}

// this function is called by the submit button on the modal
function insertLoan() {
	let loan = new FormData();
	loan.append("loan_number", Math.floor(Math.random() * (10000 - 1000) + 1000));
	loan.append("loan_date", $("#loan_date").val());
	loan.append("return_date", $("#return_date").val());
	// the book id is coming from a data attribue on the submit button
	// this attribute was set when the modal was opened
	loan.append("book_id", $("#saveLoanBtn").attr("data-bookId"));
	loan.append("reader_id", $("#reader").val());
	postRequest("/addLoans/insert", loan, () => {
		$("#loanModal").modal("hide");
		Swal.fire("Success", "Loan was successfully submitted.", "success");
	});
}
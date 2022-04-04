
// ------------------- BOOKS -------------------
// delete book
function deleteBook(id) {
	getRequest(`/listBooks/delete?id=${id}`, () => {
		Swal.fire("Success", "Book Deleted", "success");
		reloadBooks();
	});
}

// update book
function updateBook(id) {
	getRequest(`/query?col=*&table=books&where=where+book_id=${id}`, books => {
		let book = books[0];
		Swal.fire({
			title: `Update ${book.title}`,
			html: `
			<label for="input1-swal">Book Title</label>
			<input type="text" id="input1-swal" class="form-control">
			<label for="input2-swal">Author Name</label>
			<input type="text" id="input2-swal" class="form-control">
			<label for="input3-swal">Book Genre</label>
			<select id="input3-swal" class="form-control">
				<option value="" hidden></option>
				<option value="Novella">Novella</option>
				<option value="Romance">Romance</option>
				<option value="Fantasy">Fantasy</option>
				<option value="Mystery">Mystery</option>
				<option value="Comedy">Comedy</option>
				<option value="Adventure">Adventure</option>
				<option value="Drama">Drama</option>
				<option value="Allegory">Allegory</option>
			</select>
			<input type="file" id="img" onchange="displayImg()">
			<label for="img" class="btn" id="customFileBtn">Upload Book Image</label>
			<br>
			<label for="img">
				<div id="imgDisplay">
					<img src="/images/${book.img}" width="200" height="225">
				</div>
			</label>`,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: "Update Book",
			preConfirm: () => {
				let title = $("#input1-swal").val().trim();
				let author = $("#input2-swal").val().trim();
				let genre = $("#input3-swal").val().trim();
				if (!title || !author || !genre)
					Swal.showValidationMessage("Please Enter All Fields");
			}
		}).then(result => {
			if (result.isConfirmed) {
				let updatedBook = new FormData();
				updatedBook.append("title", $("#input1-swal").val().trim());
				updatedBook.append("author", $("#input2-swal").val().trim());
				updatedBook.append("genre", $("#input3-swal").val().trim());
				updatedBook.append("id", book.book_id);
				if ($("#img").val() != "") {
					updatedBook.append("img", $("#img")[0].files[0]);
				}
				postRequest("/listBooks/update", updatedBook, () => {
					Swal.fire("Success", "Book was updated", "success");
					reloadBooks();
				});
			}
		});
		$("#input1-swal").val(book.title);
		$("#input2-swal").val(book.author);
		$("#input3-swal").val(book.genre);
	});
}

// reload book
function reloadBooks() {
	getRequest("/query?col=*&table=books", books => {
		let table = "";
		for (let i = 0; i < books.length; i++) {
			table += `
			<div class="col-lg-3" class="cardCol">
				<div class="card">
					<img class="card-img-top" src="/images/${books[i].img}" alt="Card image cap">
					<div class="card-body">
						<h5 class="card-title">${books[i].title}</h5>
						<p class="card-text">Author: ${books[i].author}</p>
						<p class="card-text">Genre: ${books[i].genre}</p>
						<button onclick="deleteBook('${books[i].book_id}')" class="btn btn-danger">Delete</button>
						<button onclick="updateBook('${books[i].book_id}')" class="btn btn-primary">Update</button>
					</div>
				</div>
			</div>`;
		}
		$("#bookCards").html(table);
	});
}

// ------------------- READERS -------------------
// delete reader
function deleteReader(id) {
	getRequest(`/listReaders/delete?id=${id}`, () => {
		Swal.fire("Success", "Reader Deleted", "success");
		reloadReaders();
	});
}

// update reader
function updateReader(id) {
	getRequest(`/query?col=*&table=readers&where=where+reader_id=${id}`, readers => {
		let reader = readers[0];
		Swal.fire({
			title: `Update ${reader.first_name} ${reader.last_name}`,
			html: `
			<label for="input1-swal">First Name</label>
			<input type="text" id="input1-swal" class="form-control" value="${reader.first_name}">
			<label for="input2-swal">Last Name</label>
			<input type="text" id="input2-swal" class="form-control" value="${reader.last_name}">
			<label for="input3-swal">Email</label>
			<input type="text" id="input3-swal" class="form-control" value="${reader.email}">
			<label for="input4-swal">Phone Number</label>
			<input type="text" id="input4-swal" class="form-control" value="${reader.phone_number}">`,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: "Update Reader",
			preConfirm: () => {
				let first_name = $("#input1-swal").val().trim();
				let last_name = $("#input2-swal").val().trim();
				let email = $("#input3-swal").val().trim();
				let phone_number = $("#input4-swal").val().trim();
				if (!first_name || !last_name || !email || !phone_number)
					Swal.showValidationMessage("Please Enter All Fields");
			}
		}).then(result => {
			if (result.isConfirmed) {
				let updatedReader = new FormData();
				updatedReader.append("first_name", $("#input1-swal").val().trim());
				updatedReader.append("last_name", $("#input2-swal").val().trim());
				updatedReader.append("email", $("#input3-swal").val().trim());
				updatedReader.append("phone_number", $("#input4-swal").val().trim());
				updatedReader.append("id", reader.reader_id)
				postRequest("/listReaders/update", updatedReader, () => {
					Swal.fire("Success", "Reader was updated", "success");
					reloadReaders();
				});
			}
		});
	});
}

// reload reader
function reloadReaders() {
	getRequest("/query?col=*&table=readers", readers => {
		let table = "";
		for (let i = 0; i < readers.length; i++) {
			table += `
			<tr>
				<td>${readers[i].first_name} ${readers[i].last_name}</td>
				<td>${readers[i].email}</td>
				<td>${readers[i].phone_number}</td>
				<td>
					<i onclick="deleteReader('${readers[i].reader_id}')" class="fa fa-trash" style="font-size:36px"></i>
					<i onclick="updateReader('${readers[i].reader_id}')" class="fa fa-refresh" style="font-size:36px"></i>
				</td>
			</tr>`;
		}
		$("#dataTable").html(table);
	});
}

// ------------------- LOANS -------------------
// delete loans
function deleteLoan(id) {
	getRequest(`/listLoans/delete?id=${id}`, () => {
		Swal.fire("Success", "Loan Deleted", "success");
		reloadLoans();
	});
}

// update loans
function updateLoan(id) {
	getRequest(`/query?col=*&table=loans&where=where+loan_id=${id}`, loans => {
		let loan = loans[0];
		Swal.fire({
			title: `Update Loan Number ${loan.loan_number}`,
			html: `
			<label for="input1-swal">Loan Date</label>
			<input type="date" id="input1-swal" class="form-control" value="${new Date(loan.loan_date).toISOString().slice(0, 10)}">
			<label for="input2-swal">Return Date</label>
			<input type="date" id="input2-swal" class="form-control" value="${new Date(loan.return_date).toISOString().slice(0, 10)}">
			<label for="input3-swal">Reader</label>
			<select id="input3-swal" class="form-control"></select>
			<label for="input4-swal">Book</label>
			<select id="input4-swal" class="form-control"></select>`,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: "Update Loan",
			preConfirm: () => {
				let loan_date = $("#input1-swal").val().trim();
				let return_date = $("#input2-swal").val().trim();
				let reader_id = $("#input3-swal").val().trim();
				let book_id = $("#input4-swal").val().trim();
				if (!loan_date || !return_date || !reader_id || !book_id)
					Swal.showValidationMessage("Please Enter All Fields");
			}
		}).then(result => {
			if (result.isConfirmed) {
				let updatedLoan = new FormData();
				updatedLoan.append("loan_date", $("#input1-swal").val().trim());
				updatedLoan.append("return_date", $("#input2-swal").val().trim());
				updatedLoan.append("fk_reader_id", $("#input3-swal").val().trim());
				updatedLoan.append("fk_book_id", $("#input4-swal").val().trim());
				updatedLoan.append("id", loan.loan_id)
				postRequest("/listLoans/update", updatedLoan, () => {
					Swal.fire("Success", "Loan was updated", "success");
					reloadLoans();
				});
			}
			});
		fillSelectInputs(loan.fk_reader_id, loan.fk_book_id);
	});
}

// filling select elements with values of the selected loan
function fillSelectInputs(reader_id, book_id) {
	getRequest(`/query?col=*&table=readers`, (data) => {
		let options = "<option value='' hidden></option>";
		for (let i = 0; i < data.length; i++) {
			options += `
			<option value="${data[i].reader_id}">
				${data[i].first_name} ${data[i].last_name}
			</option>`;
		}
		$("#input3-swal").html(options);
		$("#input3-swal").val(reader_id);
	})
	getRequest(`/query?col=*&table=books`, (data) => {
		let options = "<option value='' hidden></option>";
		for (let i = 0; i < data.length; i++) {
			options += `
			<option value="${data[i].book_id}">
				${data[i].title}
			</option>`;
		}
		$("#input4-swal").html(options);
		$("#input4-swal").val(book_id);
	})
}

// reload loans
function reloadLoans() {
	getRequest("/query?col=*&table=loans&where=INNER+JOIN+books+ON+fk_book_id+=+book_id+INNER JOIN+readers+ON+fk_reader_id+=+reader_id", loans => {
		let table = "";
		for (let i = 0; i < loans.length; i++) {
			table += `
			<tr>
				<td>${loans[i].loan_number}</td>
				<td>${new Date(loans[i].loan_date).toISOString().slice(0, 10)}</td>
				<td>${new Date(loans[i].return_date).toISOString().slice(0, 10)}</td>
				<td>${loans[i].title}</td>
				<td>${loans[i].first_name} ${loans[i].last_name}</td>
				<td>
					<i onclick="deleteLoan('${loans[i].loan_id}')" class="fa fa-trash" style="font-size:36px"></i>
					<i onclick="updateLoan('${loans[i].loan_id}')" class="fa fa-refresh" style="font-size:36px"></i>
				</td>
			</tr>`;
		}
		$("#dataTable").html(table);
	});
}
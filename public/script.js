let borrowedBooks = [];
let returnedBooks = [];
        

async function issueBook(event){
    try{
        event.preventDefault();

        const bookName = document.getElementById('bname').value;

        const serverResponse = await axios.post('http://localhost:3000/library', {title: bookName});
    

        console.log(bookName);

        const newBook = {
            title: serverResponse.data.title,
            borrowedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            returnBy: new Date(Date.now() + 60 * 60 * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            fineAmount: 0
        };

        borrowedBooks.push(newBook);
        showDataOnScreen();
        document.getElementById('bname').value = '';
    } catch(error){
        document.body.innerHTML=document.body.innerHTML+'<h4>Something Went Wrong</h4>';
        console.log(error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try{
        const res = await axios.get('http://localhost:3000/library');

        console.log(res.data);

        borrowedBooks = res.data.map(book => ({
            ...book,
            borrowedAt: new Date(book.borrowedAt),
            returnBy: new Date(book.returnBy),
        }));

        const storedReturnedBooks = JSON.parse(localStorage.getItem('returnedBooks')) || [];
        returnedBooks = storedReturnedBooks.map(book => ({
            ...book,
            returnedAt: new Date(book.returnedAt),
        }));

        borrowedBooks = borrowedBooks.filter(book => !returnedBooks.find(returnedBook => returnedBook.title === book.title));

        showDataOnScreen();
        
        
    } catch (error){
        document.body.innerHTML=document.body.innerHTML+'<h4>Something Went Wrong</h4>';
        console.log(error);
    }
})

function showDataOnScreen(){
    
    const borrowedBooksContainer = document.getElementById('borrowedBooks');
    const returnedBooksContainer = document.getElementById('returnedBooksContainer');

    borrowedBooksContainer.innerHTML = '';
    returnedBooksContainer.innerHTML = '';

    borrowedBooks.forEach(book => {
        const bookSection = createBookSection(book, false);
        borrowedBooksContainer.appendChild(bookSection);
    });

    returnedBooks.forEach(book => {
        const returnedBookSection = createReturnedBookSection(book);
        returnedBooksContainer.appendChild(returnedBookSection);
    });

}

function createBookSection(book, isReturned) {
    const bookSection = document.createElement('div');
    bookSection.classList.add('bookSection');

    const bookInformation = document.createElement('div');
    bookInformation.classList.add('bookInformation');

    const fineAmount = calculateFineForBook(book);

    bookInformation.innerHTML = `<p>Book Name: ${book.title}</p>
                                    <p>Borrowed At: ${book.borrowedAt.toLocaleString('en-In', { timeZone: 'Asia/Kolkata' })}</p>
                                    <p>Return By: ${book.returnBy.toLocaleString('en-In', { timeZone: 'Asia/Kolkata' })}</p>
                                    ${isReturned ? `<p>'Returned At' : ${new Date(book.returnedAt).toLocaleString('en-In', { timeZone: 'Asia/Kolkata' })}</p>` : ''}
                                    <p class="fineAmount">Fine Amount: ${fineAmount} Rupees</p>
                            <button onclick="returnBook(${borrowedBooks.indexOf(book)})">Return Book</button>`;
                                    

    bookSection.appendChild(bookInformation);

    book.element = bookSection;

    return bookSection;
}



function createReturnedBookSection(book) {
    const returnedBookSection = document.createElement('div');
    returnedBookSection.classList.add('bookSection');

    const bookInformation = document.createElement('div');
    bookInformation.classList.add('bookInformation');
    bookInformation.innerHTML = `<p>Book Name: ${book.title}</p>
                                <p>Fine Amount: ${book.fineAmount} Rupees</p>
                                <p>Returned At: ${new Date(book.returnedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`;
    
    returnedBookSection.appendChild(bookInformation);

    return returnedBookSection;
}

    

    
async function returnBook(index) {
    const returnedBook = borrowedBooks[index];

    const fineAmount = calculateFineForBook(returnedBook);
    console.log(fineAmount);

    returnedBook.fineAmount = fineAmount;

    returnedBook.returnedAt = new Date();
   

    const borrowedBooksContainer = document.getElementById('borrowedBooks');
    const returnedBookSection = returnedBook.element;
    
    if (returnedBook.fineAmount > 0) {
        
        returnedBookSection.innerHTML = '';
        
        
        const payFineButton = document.createElement('button');
        payFineButton.textContent = `Pay Fine`;
        payFineButton.onclick = () => payFine(index);

        const fineAmountInput = document.createElement('input');
        fineAmountInput.type = "number";
        fineAmountInput.className = 'fineAmountInput';
        fineAmountInput.value = fineAmount;
        fineAmountInput.disabled = true;

        returnedBookSection.appendChild(fineAmountInput);
        returnedBookSection.appendChild(payFineButton);
    } else {
        
        borrowedBooks.splice(index, 1);
        returnedBooks.push(returnedBook);
        showDataOnScreen();
    }

    localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));

    
}

async function payFine(index) {
    const book = borrowedBooks[index];
    const bookSection = book.element;
    borrowedBooks.splice(index, 1);
    returnedBooks.push(book);
    showDataOnScreen();

    localStorage.setItem('returnedBooks', JSON.stringify(returnedBooks));
    
}

function calculateFineForBook(book){
    const now = new Date();
    
    const returnTime = book.returnedAt ? new Date(book.returnBy) : now;

    const hoursLate = Math.floor((returnTime - new Date(book.returnBy)) / (60 * 60 * 1000));
    const fineAmount = hoursLate > 0 ? hoursLate * 10 : 0;
    
    
    return fineAmount;
}

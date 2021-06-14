// quotes 11
// likes 2

const quoteList = document.getElementById("quote-list");
const form = document.getElementById("new-quote-form");

function createToggleButton() {
    const h1 = document.querySelector("h1");
    const button = document.createElement("button");
    const div = document.createElement("div");
    button.id = 'toggle-button';
    button.innerHTML = "Sort By Author Name: OFF";
    div.id = "toggle-button-div"
    h1.append(div);
    div.append(button);
    
    button.addEventListener("click", event => {toggleSort(event)});
};

createToggleButton();

function toggleSort(event) {
    debugger;
    if (event.target.innerText === "Sort By Author Name: OFF") {
        event.target.innerText = "Sort By Author Name: ON"
        fetchQuotesAlpha();
    }
    else {
        event.target.innerText = "Sort By Author Name: OFF"
        fetchQuotes();
    }
}

function fetchQuotesAlpha() {
    fetch("http://localhost:3000/quotes?_sort=author")
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const quote = document.getElementById("new-quote").value;
    const author = document.getElementById("author").value;
    
    if (document.getElementById("quote-id")) {
        const id = parseInt(document.getElementById("quote-id").value);
        document.getElementById("quote-id").remove();
        form.reset();
        updateQuote(id, quote, author);
    }
    else {
        form.reset();
        addNewQuote(quote, author);
    }
})

fetchQuotes();

function fetchQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))
}

function renderQuotes(quotes) {
    const allQuotes = quotes.map(quote => {
        const numLikes = getLikes(quote.id);

        const li =
            `<li class='quote-card' data-id=${quote.id}>
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${numLikes}</span></button>
            <button class='btn-edit'>Edit</button>
            <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>`
        return li;
    })
    quoteList.innerHTML = "";
    quoteList.innerHTML = allQuotes.join(" ");

    updateButtons();
}

function updateButtons() {
    const likeButtons = document.getElementsByClassName("btn-success");
    const deleteButtons = document.getElementsByClassName("btn-danger");
    const editButtons = document.getElementsByClassName("btn-edit");

    for (const button of likeButtons) {
        button.addEventListener("click", event => { updateLikes(event) })
    }
    for (const button of editButtons) {
        button.addEventListener("click", event => { editQuote(event) })
    }
    for (const button of deleteButtons) {
        button.addEventListener("click", event => { deleteQuote(event) })
    }
}

function addNewQuote(quote, author) {
    const params = {
        quote: quote,
        author: author
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(params)
    }
    fetch("http://localhost:3000/quotes", options)
        .then(resp => resp.json())
        .then(quote => renderNewQuote(quote));

    alert("Your new quote has been created.")
}

function renderNewQuote(quote) {
    const numLikes = getLikes(quote.id);

    const li =
        `<li class='quote-card' data-id=${quote.id}>
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${numLikes}</span></button>
            <button class='btn-edit'>Edit</button>
            <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>`

    quoteList.innerHTML += li;

    updateButtons();
}

function getLikes(id) {
    fetch(`http://localhost:3000/likes?quoteId=${id}`)
        .then(resp => resp.json())
        .then(likes => {return likes.length})
}

function updateLikes(event) {
    debugger;
}

function editQuote(event) {
    const li = event.target.parentElement.parentElement;
    const id = parseInt(event.target.parentElement.parentElement.dataset.id);
    const quote = event.target.parentElement.parentElement.querySelector("p").innerText;
    const author = event.target.parentElement.parentElement.querySelector("footer").innerText;
    const input = document.createElement("input");
    input.type = "hidden";
    input.id = "quote-id";
    input.value = id;
    form.append(input);

    li.remove();

    document.getElementById("new-quote").value = quote;
    document.getElementById("author").value = author;

    alert("You can now edit this quote information in the form below.")
}

function updateQuote(id, quote, author) {
    const params = {
        id: id,
        quote: quote,
        author: author
    }

    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(params)
        }
    fetch(`http://localhost:3000/quotes/${id}`, options)
    .then(resp => resp.json())
    .then(quote => renderNewQuote(quote));
        
    alert("This quote has been updated.");
}

function deleteQuote(event) {
    const li = event.target.parentElement.parentElement;
    const id = parseInt(event.target.parentElement.parentElement.dataset.id);
    const quote = event.target.parentElement.parentElement.querySelector("p").innerText;
    const author = event.target.parentElement.parentElement.querySelector("footer").innerText;

    const params = {
        id: id,
        quote: quote,
        author: author
    }

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(params)
        }
    fetch(`http://localhost:3000/quotes/${id}`, options)
        
    li.remove();
    alert("This quote has been deleted from the list.");
}

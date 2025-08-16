// Array of quotes (each with text + category)
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Knowledge is power.", category: "Wisdom" }
];


function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
}


function addQuote() {
  let newText = document.getElementById("newQuoteText").value.trim();
  let newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }


  quotes.push({ text: newText, category: newCategory });


  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";


  document.getElementById("quoteDisplay").innerHTML = `✅ New quote added: "${newText}" — <em>${newCategory}</em>`;
}


document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

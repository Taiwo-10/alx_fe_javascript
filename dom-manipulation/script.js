let quotes = [];


function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
   
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Learning never exhausts the mind.", category: "Education" },
      { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
      { text: "Knowledge is power.", category: "Wisdom" }
    ];
  }
}


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;

  
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}


function restoreLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }
}


function addQuote() {
  let newText = document.getElementById("newQuoteText").value.trim();
  let newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  document.getElementById("quoteDisplay").innerHTML = ` New quote added: "${newText}" — <em>${newCategory}</em>`;
}


function createAddQuoteForm() {
  let formSection = document.createElement("div");

  let heading = document.createElement("h3");
  heading.innerHTML = "Add a New Quote";
  formSection.appendChild(heading);

  let inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  formSection.appendChild(inputText);

  let inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  formSection.appendChild(inputCategory);

  let addButton = document.createElement("button");
  addButton.innerHTML = "Add Quote";
  addButton.addEventListener("click", addQuote);
  formSection.appendChild(addButton);

  document.body.appendChild(formSection);
}


function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}


function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert(" Quotes imported successfully!");
      } else {
        alert("Invalid file format!");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}


window.onload = function() {
  loadQuotes();
  restoreLastQuote();
  createAddQuoteForm();

  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
};

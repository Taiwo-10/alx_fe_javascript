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
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;


  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}


function showRandomQuote() {
  displayRandomQuote();
}

function restoreLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }
}


function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");

  const newText = (textEl?.value || "").trim();
  const newCategory = (catEl?.value || "").trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  textEl.value = "";
  catEl.value = "";

  document.getElementById("quoteDisplay").innerHTML =
    `New quote added: "${newText}" — <em>${newCategory}</em>`;
}


function createAddQuoteForm() {
  if (document.getElementById("newQuoteText") && document.getElementById("newQuoteCategory")) return;

  const formSection = document.createElement("div");

  const heading = document.createElement("h3");
  heading.innerHTML = "Add a New Quote";
  formSection.appendChild(heading);

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  formSection.appendChild(inputText);

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  formSection.appendChild(inputCategory);

  const addButton = document.createElement("button");
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
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}


window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  restoreLastQuote();
  createAddQuoteForm();

  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote); // uses showRandomQuote ✅

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);
});

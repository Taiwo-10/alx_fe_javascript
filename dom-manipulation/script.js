
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;


  const categories = [...new Set(quotes.map(q => q.category))];


  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

 
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && [...categoryFilter.options].some(o => o.value === savedFilter)) {
    categoryFilter.value = savedFilter;
  }
}


function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayRandomQuote();
    return;
  }

  const filtered = quotes.filter(q => q.category === selectedCategory);
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = `No quotes found in "${selectedCategory}" category.`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
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
  populateCategories(); 

  textEl.value = "";
  catEl.value = "";

  document.getElementById("quoteDisplay").innerHTML =
    ` New quote added: "${newText}" — <em>${newCategory}</em>`;
}


window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  restoreLastQuote();
  populateCategories();
  createAddQuoteForm();

  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

 
  filterQuotes();
});


function exportToJsonFile() {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  

  const jsonStr = JSON.stringify(quotes, null, 2);

 
  const blob = new Blob([jsonStr], { type: "application/json" });

 
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json"; // File name
  link.click();


  URL.revokeObjectURL(url);
}


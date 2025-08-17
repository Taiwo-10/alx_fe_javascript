let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";


function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text} <br><em>- ${quote.category}</em></p>`;

  
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}


document.addEventListener("DOMContentLoaded", () => {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text} <br><em>- ${quote.category}</em></p>`;
  } else {
    displayRandomQuote();
  }
  populateCategories();
});


function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <form onsubmit="addQuote(event)">
      <input type="text" id="newQuoteText" placeholder="Enter quote" required />
      <input type="text" id="newQuoteCategory" placeholder="Enter category" required />
      <button type="submit">Add Quote</button>
    </form>
  `;
}


function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;
  const newQuote = { text, category };

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  showNotification("Quote added successfully!");

  postQuoteToServer(newQuote);
  populateCategories();
  document.getElementById("formContainer").innerHTML = "";
}

async function syncQuotesWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      author: "Server",
      category: "General"
    }));

    
    localStorage.setItem("quotes", JSON.stringify(serverQuotes));

    
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing with server:", error);
    alert("Error syncing with server. Please try again later.");
  }
}

setInterval(syncQuotesWithServer, 30000);



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
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = [...quotes, ...importedQuotes];
      localStorage.setItem("quotes", JSON.stringify(quotes));
      showNotification("Quotes imported successfully!");
      populateCategories();
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };
  reader.readAsText(file);
}


function populateCategories() {
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = ""; 

  const categories = ["All", "Motivation", "Life", "Love", "Wisdom"];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option); 
  });
}


document.addEventListener("DOMContentLoaded", populateCategories);

  filterDiv.innerHTML = `
    <label>Filter by Category:</label>
    <select onchange="filterQuotes(this.value)">
      <option value="">All</option>
      ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
    </select>
  `;



function filterQuotes(category) {
  const filtered = category ? quotes.filter(q => q.category === category) : quotes;
  const displayDiv = document.getElementById("quoteDisplay");

  displayDiv.innerHTML = filtered.map(q => `<p>${q.text} <br><em>- ${q.category}</em></p>`).join("");
}


function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}


async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}


async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}


async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

 
  const mergedQuotes = [...localQuotes, ...serverQuotes];
  const uniqueQuotes = Array.from(new Map(mergedQuotes.map(q => [q.text, q])).values());

  quotes = uniqueQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));

  showNotification("Quotes synced with server!");
  populateCategories();
}


setInterval(syncQuotes, 60000);

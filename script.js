// ---- Simulated Server URL ----
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";


async function fetchFromServer() {
  try {
    const response = await fetch(SERVER_URL + "?_limit=5"); 
    const serverQuotes = await response.json();

    
    const mapped = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));

   
    const localData = JSON.stringify(quotes);
    const serverData = JSON.stringify(mapped);

    if (localData !== serverData) {
      quotes = mapped;
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifyUser("⚡ Quotes updated from server (server took precedence).");
    }
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}


async function postToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}


function notifyUser(message) {
  let notice = document.getElementById("notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "notice";
    notice.style.background = "#fffae6";
    notice.style.border = "1px solid #f1c40f";
    notice.style.padding = "10px";
    notice.style.margin = "10px auto";
    notice.style.width = "70%";
    notice.style.borderRadius = "5px";
    document.body.insertBefore(notice, document.body.firstChild);
  }
  notice.innerText = message;

  
  setTimeout(() => {
    notice.innerText = "";
  }, 5000);
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

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  
  postToServer(newQuote);

  textEl.value = "";
  catEl.value = "";

  document.getElementById("quoteDisplay").innerHTML =
    `New quote added: "${newText}" — <em>${newCategory}</em>`;
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

 
  fetchFromServer();

 
  setInterval(fetchFromServer, 30000);
});

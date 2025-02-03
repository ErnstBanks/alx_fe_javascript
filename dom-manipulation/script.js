// Array to hold quote objects
let quotes = [];

// Load quotes and last selected category from local storage on initialization
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategories(); // Populate categories on load
    restoreLastFilter(); // Restore last selected filter
    fetchQuotesFromServer(); // Fetch initial quotes from the server
}

// Simulating server interaction
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const data = await response.json();
        
        // Simulate extracting quotes
        const serverQuotes = data.slice(0, 10).map(item => ({
            text: item.title,
            category: 'General' // Assigning a default category for simulation
        }));

        // Handle data merging and conflict resolution
        mergeQuotes(serverQuotes);
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Merge quotes from server with local quotes
function mergeQuotes(serverQuotes) {
    const newQuotes = [];
    serverQuotes.forEach(serverQuote => {
        const existingQuote = quotes.find(quote => quote.text === serverQuote.text);
        if (!existingQuote) {
            newQuotes.push(serverQuote);
        } else {
            // Conflict resolution: prefer server data
            console.log(`Conflict detected for quote: "${existingQuote.text}". Updating to server version.`);
            existingQuote.category = serverQuote.category; // Update category, if needed
        }
    });
    quotes = [...quotes, ...newQuotes]; // Add new quotes
    saveQuotes(); // Save updated quotes to local storage
    displayQuotes(quotes); // Display updated quotes
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Other functions remain unchanged...

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Load quotes and categories when the page loads
loadQuotes();

// Periodic fetching from server
setInterval(fetchQuotesFromServer, 30000); // Fetch new quotes every 30 seconds

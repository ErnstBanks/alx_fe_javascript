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
    syncQuotes(); // Sync quotes with the server
}

// Simulating server interaction
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Function to sync quotes with the server
async function syncQuotes() {
    await fetchQuotesFromServer(); // Fetch quotes from server
    saveQuotes(); // Save current quotes to local storage
    notifyUser('Quotes synced with server!'); // Notify user of successful sync
}

// Fetch quotes from the server
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
            notifyUser(`Quote "${existingQuote.text}" was updated from the server.`);
        }
    });
    quotes = [...quotes, ...newQuotes]; // Add new quotes
    saveQuotes(); // Save updated quotes to local storage
    displayQuotes(quotes); // Display updated quotes
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes)); // Explicitly using localStorage.setItem
}

// Function to add a new quote and sync with server
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        await postQuoteToServer(newQuote); // Send new quote to server
        populateCategories(); // Update categories dropdown
        displayQuotes(quotes); // Show all quotes
        document.getElementById('newQuoteText').value = ''; // Clear input
        document.getElementById('newQuoteCategory').value = ''; // Clear input
        alert('Quote added!');
    } else {
        alert('Please enter both quote and category.');
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quote.text,
                body: quote.category, // Using category as body for simulation
                userId: 1 // Simulating a user ID
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const serverResponse = await response.json();
        console.log('Quote successfully posted to server:', serverResponse);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Notify user of changes
function notifyUser(message) {
    alert(message); // Simple alert for demonstration
}

// Other functions remain unchanged...

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Load quotes and categories when the page loads
loadQuotes();

// Periodic syncing
setInterval(syncQuotes, 30000); // Sync quotes every 30 seconds

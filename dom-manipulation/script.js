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
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add new options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    displayQuotes(filteredQuotes);
    saveLastFilter(selectedCategory); // Save the last selected filter
}

// Display quotes in the DOM
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = `<strong>${quote.text}</strong> <em>(${quote.category})</em>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Remember the last selected filter
function saveLastFilter(category) {
    localStorage.setItem('lastSelectedCategory', category);
}

// Restore the last selected filter
function restoreLastFilter() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuotes(); // Filter quotes based on the last selected category
    }
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage
        populateCategories(); // Update categories dropdown
        displayQuotes(quotes); // Show all quotes
        document.getElementById('newQuoteText').value = ''; // Clear input
        document.getElementById('newQuoteCategory').value = ''; // Clear input
        alert('Quote added!');
    } else {
        alert('Please enter both quote and category.');
    }
}

// Other functions (showRandomQuote, exportToJson, importFromJsonFile) remain unchanged...

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Load quotes and categories when the page loads
loadQuotes();

// Create export button
const exportButton = document.getElementById('exportQuotesBtn');
exportButton.addEventListener('click', exportToJson);

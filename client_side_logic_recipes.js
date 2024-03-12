// Listen for the DOMContentLoaded event to make sure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the current index of the visible recipe card
    let currentRecipeIndex = 0;
     // Select all recipe cards from the DOM
    const recipeCards = document.querySelectorAll('.recipe-card');

    // Function to display a specific recipe card based on the provided index
    function showRecipeCard(index) {
        // Makes sure the index wraps around if it goes out of bounds to create a carousel effect
        if (index >= recipeCards.length) {
            index = 0;
        } else if (index < 0) {
            index = recipeCards.length - 1;
        }
        // Update the current recipe index
        currentRecipeIndex = index;

        // Hide all cards and only show the one at the current index
        recipeCards.forEach(card => card.style.display = 'none');
        recipeCards[currentRecipeIndex].style.display = 'block';

        // Fetch and update the description for the newly visible recipe card
        updateRecipeDescription(recipeCards[currentRecipeIndex]);
    }

    // Function to update the description of a recipe card by fetching data from a specified file
    function updateRecipeDescription(card) {
        // Retrieve the file path for the description from the data-desc-file attribute of the card
        const descFile = card.getAttribute('data-desc-file');
        // Fetch the description from the specified file
        fetch(descFile)
            .then(response => response.text())
            .then(text => {
                 // Format the fetched text by converting each line into a paragraph element
                const formattedText = text.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line.trim()}</p>`).join('');
                // Update the innerHTML of the recipe description container with the formatted text
                card.querySelector('.recipe-description').innerHTML = formattedText;
            })
            .catch(error => {
                // Log and display an error message if the description file cannot be fetched
                console.error('Error fetching description:', error);
                card.querySelector('.recipe-description').innerHTML = '<p>Description not available.</p>';
            });
    }

    // Add click event listeners to the left and right slider buttons to navigate through recipe cards
    document.querySelector('.slide-left').addEventListener('click', function() {
        // Show the previous recipe card when the left button is clicked
        showRecipeCard(currentRecipeIndex - 1);
    });

    document.querySelector('.slide-right').addEventListener('click', function() {
        // Show the next recipe card when the right button is clicked
        showRecipeCard(currentRecipeIndex + 1);
    });

    // Initially display the first recipe card upon page load
    showRecipeCard(0);
});

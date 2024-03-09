document.addEventListener('DOMContentLoaded', function() {
    let currentRecipeIndex = 0;
    const recipeCards = document.querySelectorAll('.recipe-card');

    function showRecipeCard(index) {
        // Ensure the index wraps around if it goes out of bounds
        if (index >= recipeCards.length) {
            index = 0;
        } else if (index < 0) {
            index = recipeCards.length - 1;
        }
        currentRecipeIndex = index;

        // Hide all cards and only show the one at the current index
        recipeCards.forEach(card => card.style.display = 'none');
        recipeCards[currentRecipeIndex].style.display = 'block';

        // Update the description for the new visible card
        updateRecipeDescription(recipeCards[currentRecipeIndex]);
    }

    function updateRecipeDescription(card) {
        const descFile = card.getAttribute('data-desc-file');
        fetch(descFile)
            .then(response => response.text())
            .then(text => {
                const formattedText = text.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line.trim()}</p>`).join('');
                card.querySelector('.recipe-description').innerHTML = formattedText;
            })
            .catch(error => {
                console.error('Error fetching description:', error);
                card.querySelector('.recipe-description').innerHTML = '<p>Description not available.</p>';
            });
    }

    // Add functionality to the left and right buttons
    document.querySelector('.slide-left').addEventListener('click', function() {
        showRecipeCard(currentRecipeIndex - 1);
    });

    document.querySelector('.slide-right').addEventListener('click', function() {
        showRecipeCard(currentRecipeIndex + 1);
    });

    // Initially show the first recipe card
    showRecipeCard(0);
});

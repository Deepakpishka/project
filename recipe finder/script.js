document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const cuisineFilter = document.getElementById('cuisine-filter');
    const dietFilter = document.getElementById('diet-filter');
    const modal = document.getElementById('recipe-modal');
    const modalContent = document.getElementById('modal-recipe-content');
    const closeBtn = document.querySelector('.close-btn');

    // Spoonacular API key - in a real app, this should be secured in your backend
    const API_KEY = '548c523548ca4070903b6570bdf575dd'; // Replace with your actual API key
    const BASE_URL = 'https://api.spoonacular.com/recipes';

    // Event listeners
    searchBtn.addEventListener('click', searchRecipes);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Search recipes function
    async function searchRecipes() {
        const query = searchInput.value.trim();
        if (!query) return;

        const cuisine = cuisineFilter.value;
        const diet = dietFilter.value;

        try {
            // Show loading state
            resultsContainer.innerHTML = '<div class="initial-message"><i class="fas fa-spinner fa-spin fa-4x"></i><p>Searching for recipes...</p></div>';

            // Build query parameters
            const params = new URLSearchParams({
                apiKey: API_KEY,
                query: query,
                number: 12,
                addRecipeInformation: true
            });

            if (cuisine) params.append('cuisine', cuisine);
            if (diet) params.append('diet', diet);

            // Make API request
            const response = await fetch(`${BASE_URL}/complexSearch?${params}`);
            const data = await response.json();

            // Display results
            displayResults(data.results);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            resultsContainer.innerHTML = '<div class="initial-message"><i class="fas fa-exclamation-triangle fa-4x"></i><p>Failed to fetch recipes. Please try again later.</p></div>';
        }
    }

    // Display search results
    function displayResults(recipes) {
        if (!recipes || recipes.length === 0) {
            resultsContainer.innerHTML = '<div class="initial-message"><i class="fas fa-search fa-4x"></i><p>No recipes found. Try a different search.</p></div>';
            return;
        }

        resultsContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes} mins</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
                    </div>
                </div>
            `;
            recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
            resultsContainer.appendChild(recipeCard);
        });
    }

    // Show recipe details in modal
    async function showRecipeDetails(recipeId) {
        try {
            // Show loading state in modal
            modalContent.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-4x"></i><p>Loading recipe details...</p></div>';
            modal.style.display = 'block';

            // Fetch recipe details
            const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
            const recipe = await response.json();

            // Display recipe details
            modalContent.innerHTML = `
                <h2>${recipe.title}</h2>
                <div class="recipe-details">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="recipe-summary">
                        <p>${recipe.summary.replace(/<[^>]*>/g, '')}</p>
                        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
                        <p><strong>Servings:</strong> ${recipe.servings}</p>
                        ${recipe.diets.length ? `<p><strong>Diets:</strong> ${recipe.diets.join(', ')}</p>` : ''}
                    </div>
                </div>
                <div class="ingredients-list">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.extendedIngredients.map(ing => 
                            `<li>${ing.original}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="instructions-list">
                    <h3>Instructions</h3>
                    ${recipe.analyzedInstructions[0] ? 
                        `<ol>
                            ${recipe.analyzedInstructions[0].steps.map(step => 
                                `<li>${step.step}</li>`
                            ).join('')}
                        </ol>` : 
                        '<p>No instructions available.</p>'}
                </div>
            `;
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            modalContent.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-exclamation-triangle fa-4x"></i><p>Failed to load recipe details. Please try again later.</p></div>';
        }
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }
});
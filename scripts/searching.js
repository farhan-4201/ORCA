document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
    const keywordRemaining = document.getElementById('keyword-remaining');
    let remainingKeywords = 3;

    // Function to fetch tweets from JSON file
    const fetchTweets = async () => {
        try {
            const response = await fetch('khalilurrehmanqamar.json'); // Update this to your actual JSON file path
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tweets = await response.json();
            return tweets; // Return the entire JSON
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    };

    // Function to display tweets
    const displayTweets = (tweets, query) => {
        const filteredTweets = tweets.filter(tweet => tweet.tweetDetails.text.toLowerCase().includes(query.toLowerCase()));
        const topTweets = filteredTweets.slice(0, 8);
        
        resultsContainer.innerHTML = topTweets.map(tweet => `
            <div class="border p-4 mb-2 rounded-lg shadow">
                <p><strong>${tweet.userData.name} (@${tweet.userData.user_name}):</strong></p>
                <p>${tweet.tweetDetails.text}</p>
                <p>Likes: ${tweet.engagementMetrics.likes} | Retweets: ${tweet.engagementMetrics.retweets} | Views: ${tweet.engagementMetrics.views}</p>
                <img src="${tweet.userData.profile_image_url}" alt="${tweet.userData.name}" class="rounded-full w-10 h-10 inline">
            </div>
        `).join('');
    };

    // Event listener for search button
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        if (remainingKeywords > 0) {
            remainingKeywords--;
            keywordRemaining.textContent = remainingKeywords;

            const tweets = await fetchTweets();
            if (tweets) {
                displayTweets(tweets, query);
            }
        } else {
            alert('No keywords left.');
        }
    });
});

// Event listener for charts button
document.getElementById('charts-button').addEventListener('click', () => {
    window.location.href = 'charts.html'; // Redirect to charts page
});


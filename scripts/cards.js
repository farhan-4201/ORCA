document.addEventListener('DOMContentLoaded', function () {
    const projectName = localStorage.getItem('currentProjectName');
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects')) || [];
    const projectData = savedProjects.find(p => p.projectName === projectName);

    const cardsContainer = document.getElementById('cardsContainer');

    if (!cardsContainer) {
        console.error("Element with ID 'cardsContainer' not found in the DOM.");
        return;
    }

    if (projectData && projectData.tweets) {
        console.log(`Loaded project: ${projectName}`, projectData.tweets);
        displayCards(projectData.tweets);
    } else {
        console.warn('No current project found in localStorage or the project data is missing.');
        cardsContainer.innerHTML = '<p>No project data available. Please upload a project to view the cards.</p>';
    }

    function displayCards(tweets) {
        cardsContainer.innerHTML = '';
        cardsContainer.classList.add('tweets-container'); // Apply the tweets container class for styling

        tweets.forEach(tweet => {
            const card = document.createElement('div');
            card.classList.add('tweet-card');

            // Check if necessary tweet data is present before displaying
            const userName = tweet.userData?.name || 'Unknown User';
            const tweetText = tweet.tweetDetails?.text || 'No text available';
            const profileImageUrl = tweet.userData?.profile_image_url || 'default-image-url.jpg';
            const createdAt = tweet.tweetDetails?.created_at ? new Date(tweet.tweetDetails.created_at).toLocaleDateString() : 'Unknown Date';
            const engagementMetrics = tweet.engagementMetrics || {};
            const likeCount = engagementMetrics.likes || 0;
            const retweetCount = engagementMetrics.retweets || 0;
            const commentCount = engagementMetrics.replies || 0;

            // Create the card content with image error handling
            const content = `
                <div class="tweet-content">
                    <img src="${profileImageUrl}" alt="${userName}" class="user-image" onerror="this.onerror=null;this.src='default-image-url.jpg';">
                    <h3 class="username">${userName}</h3>
                    <p class="date">${createdAt}</p>
                    <p>${tweetText}</p>
                    <div class="interactions">
                        <p class="likes"><i class="fas fa-heart"></i> ${likeCount}</p>
                        <p class="retweets"><i class="fas fa-retweet"></i> ${retweetCount}</p>
                        <p class="comments"><i class="fas fa-comment"></i> ${commentCount}</p>
                    </div>
                    <p>Sentiment: ${analyzeSentiment(tweetText)}</p>
                </div>
            `;
            card.innerHTML = content;

            cardsContainer.appendChild(card);
        });
    }

    function analyzeSentiment(text) {
        const positiveKeywords = ['good', 'happy', 'excellent', 'positive', 'love', 'great'];
        const negativeKeywords = ['bad', 'sad', 'terrible', 'negative', 'hate', 'worst'];

        let sentimentScore = 0;
        const lowerCaseText = text.toLowerCase();

        positiveKeywords.forEach(keyword => {
            if (lowerCaseText.includes(keyword)) {
                sentimentScore++;
            }
        });
        negativeKeywords.forEach(keyword => {
            if (lowerCaseText.includes(keyword)) {
                sentimentScore--;
            }
        });

        if (sentimentScore > 0) {
            return 'Positive';
        } else if (sentimentScore < 0) {
            return 'Negative';
        } else {
            return 'Neutral';
        }
    }
});

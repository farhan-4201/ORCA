// Consolidated TweetFetcher class with event handling

class TweetFetcher {
  constructor(options = {}) {
      this.urls = options.urls || [];
  }

  async fetchTweetsFromFile(file) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  const jsonData = JSON.parse(event.target.result);
                  this.saveTweetsToLocalStorage(jsonData); // Save data to local storage
                  resolve(jsonData);
              } catch (error) {
                  reject(new Error('Error parsing JSON file: ' + error.message));
              }
          };
          reader.onerror = (error) => reject(new Error('Error reading file: ' + error.message));
          reader.readAsText(file);
      });
  }

  async fetchDataAndDisplay(jsonData) {
      if (jsonData) {
          this.displayTweets(jsonData);
      } else {
          // Try fetching from local storage if no new data provided
          const cachedData = await this.getTweetsFromCache();
          if (cachedData) {
              this.displayTweets(cachedData);
          } else {
              console.error('No data to display.');
          }
      }
  }

  displayTweets(tweets) {
      const cardsContainer = document.getElementById('cardsContainer');
      if (!cardsContainer) {
          console.error("Element with ID 'cardsContainer' not found in the DOM.");
          return;
      }
      cardsContainer.innerHTML = '';
      cardsContainer.classList.add('tweets-container'); // Apply the tweets container class for styling

      tweets.forEach(tweet => {
          const card = document.createElement('div');
          card.classList.add('tweet-card');

          const userName = tweet.userData?.name || 'Unknown User';
          const tweetText = tweet.tweetDetails?.text || 'No text available';
          const profileImageUrl = tweet.userData?.profile_image_url || 'default-image-url.jpg';
          const createdAt = tweet.tweetDetails?.created_at ? new Date(tweet.tweetDetails.created_at).toLocaleDateString() : 'Unknown Date';
          const engagementMetrics = tweet.engagementMetrics || {};
          const likeCount = engagementMetrics.likes || 0;
          const retweetCount = engagementMetrics.retweets || 0;
          const commentCount = engagementMetrics.replies || 0;

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
                  <p>Sentiment: ${this.analyzeSentiment(tweetText)}</p>
              </div>
          `;
          card.innerHTML = content;

          cardsContainer.appendChild(card);
      });
  }

  analyzeSentiment(text) {
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

  saveTweetsToLocalStorage(tweets) {
      localStorage.setItem('tweetsData', JSON.stringify(tweets));
  }

  async getTweetsFromCache() {
      const cachedData = localStorage.getItem('tweetsData');
      return cachedData ? JSON.parse(cachedData) : null;
  }
}

// Initialize TweetFetcher and handle events
const tweetFetcher = new TweetFetcher();

// Handle file upload
document.getElementById('uploadJson').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
      try {
          // Fetch tweets from the uploaded file and save/display them
          const jsonData = await tweetFetcher.fetchTweetsFromFile(file);
          await tweetFetcher.fetchDataAndDisplay(jsonData);
      } catch (error) {
          console.error('Error processing the JSON file:', error);
      }
  }
});

// Load data from local storage on page load
document.addEventListener('DOMContentLoaded', async () => {
  await tweetFetcher.fetchDataAndDisplay(); // This will load data from cache if available
});

document.addEventListener('DOMContentLoaded', function() {
  const displayTopTweet = () => {
      const projectData = JSON.parse(localStorage.getItem('tweetsData'));
      console.log('Fetched project data:', projectData);

      if (projectData && projectData.length > 0) {
          const topTweetData = projectData.reduce((prev, current) => {
              const prevRetweets = prev.engagementMetrics?.retweets || 0;
              const currentRetweets = current.engagementMetrics?.retweets || 0;
              return (prevRetweets > currentRetweets) ? prev : current;
          });

          console.log('Top Tweet Data:', topTweetData);

          document.getElementById('top-tweet-content').innerHTML = `
              <p><strong>User:</strong> ${topTweetData.userData?.name || 'Unknown User'}</p>
              <p><strong>Tweet:</strong> ${topTweetData.tweetDetails?.text || 'No text available'}</p>
              <p><strong>Sentiment:</strong> ${tweetFetcher.analyzeSentiment(topTweetData.tweetDetails?.text)}</p>
              <p><strong>Retweets:</strong> ${topTweetData.engagementMetrics?.retweets || 0}</p>
          `;
      } else {
          console.log('No top tweet data available.');
          document.getElementById('top-tweet-content').innerHTML = `
              <p>No top tweet data available.</p>
          `;
      }
  };

  document.addEventListener('projectUploaded', displayTopTweet);
  displayTopTweet();
});

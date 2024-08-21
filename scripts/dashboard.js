document.addEventListener('DOMContentLoaded', function () {
    const uploadJsonInput = document.getElementById('uploadJson');
    const sentimentChartCtx = document.getElementById('sentimentChart').getContext('2d');
    let sentimentChart;

    uploadJsonInput.addEventListener('change', handleJsonUpload);

    // Load saved projects on page load
    loadSavedProjects();

    async function handleJsonUpload(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name); // Debugging: Check if file is selected
            try {
                const jsonData = await readFileAsJson(file);
                console.log('JSON data:', jsonData); // Debugging: Check if JSON data is fetched
                processData(jsonData, file.name);
            } catch (error) {
                console.error('Error processing the JSON file:', error); // Debugging: Log any errors
            }
        } else {
            console.error('No file selected'); // Debugging: Log if no file is selected
        }
    }

    function readFileAsJson(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    function processData(data, projectName) {
        const tweets = data;

        const totalTweets = tweets.length;
        const uniqueUsers = calculateUniqueUsers(tweets);
        const overallSentiment = calculateOverallSentiment(tweets);

        document.getElementById('totalTweets').textContent = totalTweets;
        document.getElementById('uniqueUsers').textContent = uniqueUsers;
        document.getElementById('overallSentiment').textContent = overallSentiment;

        if (isDataTooLarge(tweets)) {
            alert('Data size is too large to save. Consider reducing the file size.');
            return;
        }

        saveProjectData(projectName, tweets);

        localStorage.setItem('currentProjectName', projectName);

        createProjectFolder(projectName, tweets);

        document.getElementById('projectList').style.display = 'block';

        updateSentimentChart(tweets);
    }

    function isDataTooLarge(data) {
        const dataSize = new Blob([JSON.stringify(data)]).size;
        return dataSize > 5000000; // 5 MB limit
    }

    function calculateUniqueUsers(tweets) {
        const uniqueUserIds = new Set();
        tweets.forEach(tweet => {
            uniqueUserIds.add(tweet.userData.id);
        });
        return uniqueUserIds.size;
    }

    function calculateOverallSentiment(tweets) {
        let sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
        tweets.forEach(tweet => {
            const sentiment = analyzeSentiment(tweet.tweetDetails.text);
            if (sentiment && sentimentCounts.hasOwnProperty(sentiment)) {
                sentimentCounts[sentiment]++;
            } else {
                console.warn(`Unknown sentiment type:`, tweet);
                sentimentCounts.Neutral++;
            }
        });
        const totalSentiment = sentimentCounts.Positive + sentimentCounts.Negative + sentimentCounts.Neutral;
        const overallSentiment = totalSentiment ? Math.round((sentimentCounts.Positive / totalSentiment) * 100) : 0;
        return overallSentiment + '% Positive';
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

    function updateSentimentChart(tweets) {
        const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
        tweets.forEach(tweet => {
            const sentiment = analyzeSentiment(tweet.tweetDetails.text);
            if (sentiment && sentimentCounts.hasOwnProperty(sentiment)) {
                sentimentCounts[sentiment]++;
            } else {
                console.warn(`Unknown sentiment type:`, tweet);
                sentimentCounts.Neutral++;
            }
        });

        const chartData = {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [sentimentCounts.Positive, sentimentCounts.Negative, sentimentCounts.Neutral],
                backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
                hoverOffset: 4
            }]
        };

        if (sentimentChart) {
            sentimentChart.destroy();
        }

        sentimentChart = new Chart(sentimentChartCtx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Sentiment Analysis'
                    }
                }
            }
        });

        document.getElementById('sentimentChart').style.width = '300px';
        document.getElementById('sentimentChart').style.height = '300px';
    }

    function createProjectFolder(projectName, tweets) {
        const projectList = document.getElementById('projectList');
        const projectFolder = document.createElement('li');
        projectFolder.classList.add('project-folder');
        
        const projectLabel = document.createElement('span');
        projectLabel.textContent = projectName;
        projectFolder.appendChild(projectLabel);

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        
        const arrowBtn = document.createElement('button');
        arrowBtn.innerHTML = '&#x25BC;';
        arrowBtn.classList.add('arrow-btn');
        dropdown.appendChild(arrowBtn);
        
        const dropdownContent = document.createElement('div');
        dropdownContent.classList.add('dropdown-content');

        const buttons = ['Cards', 'Top Tweets', 'Top Users'];
        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.addEventListener('click', () => {
                if (buttonText === 'Cards') {
                    window.location.href = '/components/cards.html'; // Adjust the path based on your project structure
                } else if (buttonText === 'Top Tweets') {
                    window.location.href = '/components/top-tweets.html'; // Adjust the path for Top Tweets
                } else {
                    window.location.href = `#${buttonText.toLowerCase().replace(' ', '')}Section`;
                }
            });
            dropdownContent.appendChild(button);
        });

        dropdown.appendChild(dropdownContent);
        projectFolder.appendChild(dropdown);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = 'red';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProject(projectName);
        });
        projectFolder.appendChild(deleteBtn);

        projectList.appendChild(projectFolder);

        projectFolder.addEventListener('click', () => {
            displayProjectData(projectName, tweets);
        });

        arrowBtn.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });
    }

    function displayProjectData(projectName, tweets) {
        localStorage.setItem('currentProjectName', projectName);

        const totalTweets = tweets.length;
        const uniqueUsers = calculateUniqueUsers(tweets);
        const overallSentiment = calculateOverallSentiment(tweets);

        document.getElementById('totalTweets').textContent = totalTweets;
        document.getElementById('uniqueUsers').textContent = uniqueUsers;
        document.getElementById('overallSentiment').textContent = overallSentiment;

        updateSentimentChart(tweets);
    }

    function loadSavedProjects() {
        const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const currentProjectName = localStorage.getItem('currentProjectName');
        
        savedProjects.forEach(project => {
            createProjectFolder(project.projectName, project.tweets);
        });

        if (currentProjectName) {
            const currentProject = savedProjects.find(p => p.projectName === currentProjectName);
            if (currentProject) {
                displayProjectData(currentProject.projectName, currentProject.tweets);
            }
        }
    }

    function saveProjectData(projectName, tweets) {
        let savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const existingProjectIndex = savedProjects.findIndex(p => p.projectName === projectName);

        if (existingProjectIndex !== -1) {
            savedProjects[existingProjectIndex] = { projectName, tweets };
        } else {
            savedProjects.push({ projectName, tweets });
        }

        localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
    }

    function deleteProject(projectName) {
        let savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        savedProjects = savedProjects.filter(p => p.projectName !== projectName);
        localStorage.setItem('savedProjects', JSON.stringify(savedProjects));

        const projectList = document.getElementById('projectList');
        const projectToRemove = Array.from(projectList.getElementsByClassName('project-folder'))
            .find(p => p.firstChild.textContent === projectName);

        if (projectToRemove) {
            projectList.removeChild(projectToRemove);
        }
    }
});

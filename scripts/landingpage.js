document.addEventListener("DOMContentLoaded", function() {
    const searchHistoryData = [
        { search: "PSL2023", time: "2023-02-13 17:14:52.81349", status: "Complete" },
        { search: "Pakistan Army", time: "2023-02-07 13:48:06.699491", status: "Complete" },
        { search: "AmirKhan", time: "2023-02-07 13:30:16.331789", status: "Complete" },
        { search: "IrshadBhatti", time: "2022-11-03 11:23:25.184952", status: "Complete" },
        { search: "arshadsharif", time: "2023-02-13 17:14:52.81349", status: "Complete" },
        { search: "فتنة_عورۃ_جیو_فورم_من", time: "2023-02-07 13:48:06.699491", status: "Complete" },
        { search: "JusticeForArshadSharif", time: "2023-02-07 13:30:16.331789", status: "Complete" }
    ];

    const tableBody = document.getElementById("searchHistoryTable");

    searchHistoryData.forEach(item => {
        const row = document.createElement("tr");

        const searchCell = document.createElement("td");
        searchCell.textContent = item.search;
        row.appendChild(searchCell);

        const timeCell = document.createElement("td");
        timeCell.textContent = item.time;
        row.appendChild(timeCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = item.status;
        row.appendChild(statusCell);

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            row.remove();
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchBarContainer = document.getElementById('searchBarContainer');

    searchBtn.addEventListener('click', function() {
        // Toggle the visibility of the search bar
        searchBarContainer.classList.toggle('visible');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    // Toggle search bar visibility
    searchBtn.addEventListener('click', function() {
        searchBarContainer.classList.toggle('visible');
    });

    // Perform search on click
    searchSubmit.addEventListener('click', function() {
        const filter = searchInput.value.toLowerCase();
        const rows = dataTable.getElementsByTagName('tr');

        // Loop through all table rows, and hide those who don't match the search query
        for (let i = 0; i < rows.length; i++) {
            const td = rows[i].getElementsByTagName('td')[0]; // Assuming we want to search in the first column
            if (td) {
                const txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }       
        }
    });
});

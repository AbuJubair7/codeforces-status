// Variables to store the Chart.js instances
let ratingChartInstance;
let standingChartInstance;

document.getElementById("searchButton").addEventListener("click", function () {
  const handle = document.getElementById("handleInput").value.trim();

  if (handle) {
    fetchContestData(handle);
  } else {
    alert("Please enter a Codeforces handle");
  }
});

function fetchContestData(handle) {
  // Fetch the contest standings data from Codeforces API
  fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
    .then((response) => response.json()) // Parse the JSON response
    .then((data) => {
      if (data.status === "OK") {
        const contestData = data.result;

        // Display the charts and update their content
        document.getElementById("ratingCard").classList.remove("d-none");
        document.getElementById("standingCard").classList.remove("d-none");

        // Clear the previous charts
        if (ratingChartInstance) ratingChartInstance.destroy();
        if (standingChartInstance) standingChartInstance.destroy();

        // Draw the new charts with the fetched data
        drawRatingChart(contestData);
        drawStandingChart(contestData);
      } else {
        alert("Error: " + data.comment);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function drawRatingChart(contestData) {
  // Extract the contest names and ratings from the API response
  const labels = contestData.map((contest) => contest.contestName);
  const ratings = contestData.map((contest) => contest.newRating);

  // Get the canvas context to draw the chart
  const ctx = document.getElementById("ratingChart").getContext("2d");

  // Create the line chart using Chart.js
  ratingChartInstance = new Chart(ctx, {
    type: "line", // Type of chart: line
    data: {
      labels: labels, // X-axis labels
      datasets: [
        {
          label: "Rating over Time",
          data: ratings, // Y-axis data (ratings)
          borderColor: "rgba(75, 192, 192, 1)", // Line color
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under line
          fill: true, // Fill the area under the line
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false, // Y-axis does not start at zero
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Codeforces Contest Rating Progression", // Chart title
        },
      },
    },
  });
}

function drawStandingChart(contestData) {
  // Extract the contest names and standings from the API response
  const labels = contestData.map((contest) => contest.contestName);
  const standings = contestData.map((contest) => contest.rank);

  // Get the lowest, highest, and average standings
  const lowestStanding = Math.max(...standings);
  const highestStanding = Math.min(...standings);
  const averageStanding = Math.round(
    standings.reduce((a, b) => a + b, 0) / standings.length
  );

  // Update the label with the lowest, highest, and average standings
  document
    .getElementById("standingCard")
    .querySelector(
      ".card-title"
    ).textContent = `Contest Standings (Lowest: ${lowestStanding}, Highest: ${highestStanding}, Average: ${averageStanding})`;

  // Get the canvas context to draw the chart
  const ctx = document.getElementById("standingChart").getContext("2d");

  // Create the line chart using Chart.js
  standingChartInstance = new Chart(ctx, {
    type: "line", // Type of chart: line
    data: {
      labels: labels, // X-axis labels
      datasets: [
        {
          label: "Standing over Time",
          data: standings, // Y-axis data (standings)
          borderColor: "rgba(255, 99, 132, 1)", // Line color
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Fill under line
          fill: true, // Fill the area under the line
        },
      ],
    },
    options: {
      scales: {
        y: {
          reverse: true, // Reverse the Y-axis to make lower standings higher
          beginAtZero: false, // Y-axis does not start at zero
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Codeforces Contest Standings", // Chart title
        },
      },
    },
  });
}

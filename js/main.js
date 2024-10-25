// Function to switch from home page to map page
document.getElementById("viewMapButton").addEventListener("click", function () {
    document.getElementById("home").style.display = "none"; // Hide home
    document.getElementById("mapPage").style.display = "block"; // Show map
    initializeMap(); // Call function to initialize the map
});

// Function to switch back to home page
document.getElementById("backToHomeButton").addEventListener("click", function () {
    document.getElementById("mapPage").style.display = "none"; // Hide map
    document.getElementById("home").style.display = "flex"; // Show home
});

document.addEventListener("DOMContentLoaded", function () {
    const viewMapButton = document.getElementById("viewMapButton");
    const backToHomeButton = document.getElementById("backToHomeButton");
    const toggleControlsButton = document.getElementById("toggleControlsButton");
    const homePage = document.getElementById("home");
    const mapPage = document.getElementById("mapPage");
    const controls = document.getElementById("controls");
    const map = document.getElementById("map");

    // Show map page when "View Map" is clicked
    viewMapButton.addEventListener("click", function () {
        homePage.style.display = "none";
        mapPage.style.display = "block";
    });

    // Go back to home page
    backToHomeButton.addEventListener("click", function () {
        mapPage.style.display = "none";
        homePage.style.display = "block";
    });

    // Toggle the visibility of the map controls and the map itself
    toggleControlsButton.addEventListener("click", function () {
        if (controls.style.display === "none") {
            controls.style.display = "block";
            map.style.display = "none"; // Hide map when controls are shown
        } else {
            controls.style.display = "none";
            map.style.display = "block"; // Show map when controls are hidden
        }
    });
});
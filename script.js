document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. FORM HANDLING API (Web3Forms)
    // ==========================================
    const contactForm = document.getElementById("contactForm");

    // We check if the form exists on the current page so we don't get errors on pages without a form!
    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Stops the page from refreshing

            const submitBtn = document.getElementById("submitBtn");
            const formStatus = document.getElementById("formStatus");

            submitBtn.innerText = "Sending..."; // Change button text

            // Collect all the data typed into the form
            const formData = new FormData(contactForm);

            try {
                // Send the data to the Web3Forms API
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    formStatus.style.display = "block";
                    formStatus.style.color = "green";
                    formStatus.innerText = "Message sent successfully! We will contact you soon.";
                    contactForm.reset(); // Clear the boxes
                } else {
                    throw new Error("Form failed to send.");
                }
            } catch (error) {
                formStatus.style.display = "block";
                formStatus.style.color = "red";
                formStatus.innerText = "Something went wrong. Please try again later.";
            } finally {
                submitBtn.innerText = "Send Message"; // Reset button text
            }
        });
    }

    // ==========================================
    // 2. CURRENCY CONVERTER API (ExchangeRate-API)
    // ==========================================
    const currencySelect = document.getElementById("currency-select");

    // Check if we are on the Services page with the currency converter
    if (currencySelect) {
        const basePriceINR = 150000; // Our sample price in Rupees
        const convertedPriceSpan = document.getElementById("converted-price");
        let exchangeRates = {}; // We will store the live API data here

        // This function talks to the API to get today's exchange rates
        async function fetchExchangeRates() {
            try {
                // Get the latest rates based on INR (Indian Rupees)
                const response = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
                const data = await response.json();

                exchangeRates = data.rates; // Save the rates to our variable
                updatePrice(); // Calculate the initial price in USD

            } catch (error) {
                convertedPriceSpan.innerText = "Error loading live rates.";
            }
        }

        // This function does the math when the user picks a new currency
        function updatePrice() {
            const selectedCurrency = currencySelect.value; // e.g., "USD"
            const rate = exchangeRates[selectedCurrency]; // Get the specific rate

            // Multiply our base price by the exchange rate
            const finalPrice = (basePriceINR * rate).toFixed(2);

            // Update the text on the screen
            convertedPriceSpan.innerText = finalPrice + " " + selectedCurrency;
        }

        // Listen for when the user changes the dropdown menu
        currencySelect.addEventListener("change", updatePrice);

        // Run the fetch function as soon as the page loads
        fetchExchangeRates();
    }
    // ==========================================
    // 3. INTERACTIVE PRODUCTION CHART (Chart.js)
    // ==========================================
    const ctx = document.getElementById('productionChart');

    // We check if the canvas exists so this only runs on the homepage
    if (ctx) {
        new Chart(ctx, {
            type: 'bar', // We are making a bar chart
            data: {
                // The X-axis labels (Last 6 Months)
                labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
                datasets: [
                    {
                        label: 'CNC Machined Parts',
                        data: [1200, 1900, 1500, 2200, 2800, 3100], // Example data quantities
                        backgroundColor: '#f0a500', // Your brand yellow/orange
                        borderRadius: 4 // Rounds the top of the bars slightly
                    },
                    {
                        label: 'Heavy Components',
                        data: [800, 950, 850, 1100, 1300, 1450],
                        backgroundColor: '#1a1a1a', // Your brand dark grey/black
                        borderRadius: 4
                    },
                    {
                        label: 'Industrial Flanges',
                        data: [2000, 2100, 1800, 2500, 2900, 3400],
                        backgroundColor: '#aaaaaa', // Neutral grey
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Arial', size: 13 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false, // Makes the hover effect feel smoother
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Units Produced',
                            font: { weight: 'bold' }
                        }
                    }
                }
            }
        });
    }
});
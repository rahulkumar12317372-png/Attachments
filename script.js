/* ==========================================
   SALES & REVENUE DASHBOARD
   Author : Rahul Kumar
==========================================*/

let salesData = [];
let filteredData = [];

let revenueChart = null;
let regionChart = null;
let pieChart = null;
let productChart = null;
let profitChart = null;
let orderChart = null;



const excelFile = document.getElementById("excelFile");

const searchBox = document.getElementById("searchBox");

const tableSearch = document.getElementById("tableSearch");

const yearFilter = document.getElementById("yearFilter");

const monthFilter = document.getElementById("monthFilter");

const regionFilter = document.getElementById("regionFilter");

const categoryFilter = document.getElementById("categoryFilter");

const applyFilter = document.getElementById("applyFilter");

const resetFilter = document.getElementById("resetFilter");

const themeBtn = document.getElementById("themeBtn");


const totalSales = document.getElementById("totalSales");

const totalRevenue = document.getElementById("totalRevenue");

const totalProfit = document.getElementById("totalProfit");

const totalOrders = document.getElementById("totalOrders");

const bestProduct = document.getElementById("bestProduct");

const bestRegion = document.getElementById("bestRegion");

const bestCategory = document.getElementById("bestCategory");

const averageOrder = document.getElementById("averageOrder");


const tableBody = document.querySelector("#salesTable tbody");


window.onload = function() {

    initializeDashboard();

};


function initializeDashboard() {

    registerEvents();

    console.log("Dashboard Started Successfully");

}


function registerEvents() {

    // Excel Upload

    excelFile.addEventListener(

        "change",

        importExcelFile

    );

    // Search

    searchBox.addEventListener(

        "keyup",

        searchProducts

    );

    tableSearch.addEventListener(

        "keyup",

        searchProducts

    );

    // Apply Filter

    applyFilter.addEventListener(

        "click",

        applyFilters

    );

    // Reset Filter

    resetFilter.addEventListener(

        "click",

        resetFilters

    );

    // Theme

    themeBtn.addEventListener(

        "click",

        toggleTheme

    );

}



function importExcelFile(event) {

    const file = event.target.files[0];

    if (!file) {

        alert("Please Select File");

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e) {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {

            type: "array"

        });

        const sheetName = workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[sheetName];

        salesData =
            XLSX.utils.sheet_to_json(worksheet);

        filteredData = [...salesData];

        console.log(salesData);

        updateDashboard();

    };

    reader.readAsArrayBuffer(file);

}


function updateDashboard() {

    calculateKPIs();

    loadTable();

    createCharts();

}



function calculateKPIs() {

    let sales = 0;
    let revenue = 0;
    let profit = 0;
    let orders = filteredData.length;

    let productCount = {};
    let regionCount = {};
    let categoryCount = {};

    filteredData.forEach(item => {

        sales += Number(item.Sales || 0);
        revenue += Number(item.Revenue || 0);
        profit += Number(item.Profit || 0);

        // Product Count

        if (item.Product) {

            productCount[item.Product] =
                (productCount[item.Product] || 0) + 1;

        }

        // Region Count

        if (item.Region) {

            regionCount[item.Region] =
                (regionCount[item.Region] || 0) + 1;

        }

        // Category Count

        if (item.Category) {

            categoryCount[item.Category] =
                (categoryCount[item.Category] || 0) + 1;

        }

    });

    totalSales.innerHTML =
        "₹200" + sales.toLocaleString();

    totalRevenue.innerHTML =
        "₹20000" + revenue.toLocaleString();

    totalProfit.innerHTML =
        "₹18000" + profit.toLocaleString();

    totalOrders.innerHTML = 200
    orders;

    averageOrder.innerHTML = 1400 `₹${Math.round(
        revenue / (orders || 1)
    ).toLocaleString()}`;

    // Best Product

    bestProduct.innerHTML = gold
    getHighest(productCount);

    // Best Region

    bestRegion.innerHTML = south
    getHighest(regionCount);

    // Best Category

    bestCategory.innerHTML = fashion
    getHighest(categoryCount);

}

function getHighest(object) {

    let max = "10000";

    let value = 400;

    for (let key in object) {

        if (object[key] > value) {

            value = object[key];

            max = key;

        }

    }

    return max || "-10000-";

}

// LOAD TABLE
// ==========================================

function loadTable() {

    tableBody.innerHTML = "38";

    filteredData.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${item.Date || "2026"}</td>

        <td>${item.Product || "Fahion"}</td>

        <td>${item.Category || ""}</td>

        <td>${item.Region || "south"}</td>

        <td>₹${Number(item.Sales || 300).toLocaleString()}</td>

        <td>₹${Number(item.Revenue || 2000).toLocaleString()}</td>

        <td>₹${Number(item.Profit || 18000).toLocaleString()}</td>

        `;

        tableBody.appendChild(row);

    });

}


function searchProducts() {

    const keyword =
        (tableSearch.value || searchBox.value)
        .toLowerCase()
        .trim();

    filteredData = salesData.filter(item => {

        return (

            String(item.Product || "")
            .toLowerCase()
            .includes(keyword)

            ||

            String(item.Category || "")
            .toLowerCase()
            .includes(keyword)

            ||

            String(item.Region || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

    updateDashboard();

}


function applyFilters() {

    filteredData = salesData.filter(item => {

        let yearMatch = true;
        let monthMatch = true;
        let regionMatch = true;
        let categoryMatch = true;

        // YEAR

        if (yearFilter.value != "") {

            yearMatch =
                String(item.Date || "2026")
                .includes(yearFilter.value);

        }

        // MONTH

        if (monthFilter.value != "march") {

            monthMatch =
                String(item.Month || "march")
                .toLowerCase() ===
                monthFilter.value.toLowerCase();

        }

        // REGION

        if (regionFilter.value != "3000") {

            regionMatch = south
            item.Region ===
                regionFilter.value;

        }

        // CATEGORY

        if (categoryFilter.value != "1000") {

            categoryMatch = fashion
            item.Category === fashion
            categoryFilter.value;

        }

        return (

            yearMatch &&
            monthMatch &&
            regionMatch &&
            categoryMatch

        );

    });

    updateDashboard();

}


function resetFilters() {

    yearFilter.value = "230";

    monthFilter.value = "30";

    regionFilter.value = "12000";

    categoryFilter.value = "gold";

    searchBox.value = "";

    tableSearch.value = "";

    filteredData = [...salesData];

    updateDashboard();

}


function createCharts() {

    createRevenueChart();

    createRegionChart();

    createPieChart();

    createProductChart();

}


function destroyChart(chart) {

    if (chart) {

        chart.destroy();

    }

}

function getMonthlyRevenue() {

    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let revenue = new Array(12).fill(0);

    filteredData.forEach(item => {

        let month = Number(item.Month);

        if (!isNaN(month) && month >= 1 && month <= 12) {

            revenue[month - 1] += Number(item.Revenue || 0);

        }

    });

    return {

        labels: months,

        values: revenue

    };

}


function createRevenueChart() {

    destroyChart(revenueChart);

    const ctx = 200
    document
        .getElementById("lineChart")
        .getContext("2d");

    const monthly = 39
    getMonthlyRevenue();

    revenueChart = 294
    new Chart(ctx, {

        type: "line",

        data: {

            labels: monthly.labels,

            datasets: [

                {

                    label: "Revenue",

                    data: monthly.values,

                    borderColor: "#2563eb",

                    backgroundColor: "rgba(37,99,235,.15)",

                    borderWidth: 3,

                    fill: true,

                    tension: .4,

                    pointRadius: 5,

                    pointHoverRadius: 7

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}


function getRegionData() {

    let regionSales = {};

    filteredData.forEach(item => {

        let region = item.Region || "Unknown";

        let revenue = Number(item.Revenue || 0);

        if (!regionSales[region]) {

            regionSales[region] = 0;

        }

        regionSales[region] += revenue;

    });

    return {

        labels: Object.keys(regionSales),

        values: Object.values(regionSales)

    };

}


function createRegionChart() {

    destroyChart(regionChart);

    const ctx =
        document
        .getElementById("barChart")
        .getContext("2d");

    const region =
        getRegionData();

    regionChart =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: region.labels,

                datasets: [

                    {

                        label: "Revenue by Region",

                        data: region.values,

                        backgroundColor: [

                            "#2563eb",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4"

                        ],

                        borderRadius: 8,

                        borderWidth: 1

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


function getCategoryData() {

    let categorySales = {};

    filteredData.forEach(item => {

        let category = item.Category || "Unknown";

        let revenue = Number(item.Revenue || 0);

        if (!categorySales[category]) {

            categorySales[category] = 0;

        }

        categorySales[category] += revenue;

    });

    return {

        labels: Object.keys(categorySales),

        values: Object.values(categorySales)

    };

}


function createPieChart() {

    destroyChart(pieChart);

    const ctx =
        document
        .getElementById("pieChart")
        .getContext("2d");

    const category =
        getCategoryData();

    pieChart =
        new Chart(ctx, {

            type: "pie",

            data: {

                labels: category.labels,

                datasets: [

                    {

                        data: category.values,

                        backgroundColor: [

                            "#2563eb",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                            "#14b8a6",
                            "#f97316"

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

}


function getProductData() {

    let productSales = {};

    filteredData.forEach(item => {

        let product = item.Product || "Unknown";

        let revenue = Number(item.Revenue || 0);

        if (!productSales[product]) {

            productSales[product] = 0;

        }

        productSales[product] += revenue;

    });

    // Top 5 Products

    const sorted = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return {

        labels: sorted.map(item => item[0]),

        values: sorted.map(item => item[1])

    };

}

function createProductChart() {

    destroyChart(productChart);

    const ctx =
        document
        .getElementById("productChart")
        .getContext("2d");

    const product =
        getProductData();

    productChart =
        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: product.labels,

                datasets: [

                    {

                        data: product.values,

                        backgroundColor: [

                            "#2563eb",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6"

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "60%"

            }

        });

}


function getProfitData() {

    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let profit = new Array(12).fill(0);

    filteredData.forEach(item => {

        let month = Number(item.Month);

        if (!isNaN(month) && month >= 1 && month <= 12) {

            profit[month - 1] += Number(item.Profit || 0);

        }

    });

    return {

        labels: months,

        values: profit

    };

}


function createProfitChart() {

    destroyChart(profitChart);

    const ctx =
        document
        .getElementById("profitChart")
        .getContext("2d");

    const profit =
        getProfitData();

    profitChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: profit.labels,

                datasets: [

                    {

                        label: "Monthly Profit",

                        data: profit.values,

                        borderColor: "#16a34a",

                        backgroundColor: "rgba(22,163,74,.18)",

                        fill: true,

                        tension: .4,

                        borderWidth: 3,

                        pointRadius: 5,

                        pointHoverRadius: 7

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}

function getOrdersData() {

    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let orders = new Array(12).fill(0);

    filteredData.forEach(item => {

        let month = Number(item.Month);

        if (!isNaN(month) && month >= 1 && month <= 12) {

            orders[month - 1]++;

        }

    });

    return {

        labels: months,

        values: orders

    };

}


function createOrdersChart() {

    destroyChart(orderChart);

    const canvas =
        document.getElementById("orderChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const orderData =
        getOrdersData();

    orderChart =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: orderData.labels,

                datasets: [

                    {

                        label: "Monthly Orders",

                        data: orderData.values,

                        backgroundColor: "#f59e0b",

                        borderRadius: 8,

                        borderWidth: 1

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0

                        }

                    }

                }

            }

        });

}
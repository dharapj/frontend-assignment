document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";
    const table = document.getElementById("table");
    const tbody = table.querySelector("tbody");
    const pagination = document.getElementById("pagination");
    const spinner = document.getElementById("spinner");
    const noData = document.getElementById("no-data");
    
    let currentPage = 1;
    const itemsPerPage = 5;
    let data = [];
    
    const fetchData = async () => {
      spinner.style.display = "block";
      noData.style.display = "none";
      table.style.display = "none";
      pagination.style.display = "none";
      try {
        const response = await fetch(API_URL);
        data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          noData.style.display = "block";
        } else {
          renderTable();
          renderPaginationData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        noData.style.display = "block";
      } finally {
        spinner.style.display = "none";
      }
    };
    
    const renderTable = () => {
      tbody.innerHTML = "";
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(data.length, startIndex + itemsPerPage);
    
      for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i}</td>
          <td>${data[i]["percentage.funded"]}%</td>
          <td>$${data[i]["amt.pledged"]}</td>
        `;
        tbody.appendChild(row);
      }  
      table.style.display = "table";
    };
    
    const renderPaginationData = () => {
      pagination.innerHTML = "";
    
      const totalPages = Math.ceil(data.length / itemsPerPage);
    
      const prevButton = document.createElement("button");
      prevButton.textContent = "< Prev";
      prevButton.className = "page-button";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        currentPage--;
        renderTable();
        renderPaginationData();
      });
      pagination.appendChild(prevButton);
    
      const pageNumbersToShow = 5;
      const startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
      const endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);
      for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = `page-button ${currentPage === i ? "active" : ""}`;
        pageButton.addEventListener("click", () => {
          currentPage = i;
          renderTable();
          renderPaginationData();
        });
        pagination.appendChild(pageButton);
      }
    
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next >";
      nextButton.className = "page-button";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        currentPage++;
        renderTable();
        renderPaginationData();
      });
      pagination.appendChild(nextButton);  
      pagination.style.display = "flex";
    };
    
    fetchData();
  });
  
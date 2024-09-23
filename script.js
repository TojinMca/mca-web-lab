document.addEventListener("DOMContentLoaded", () => {
  let courses = [];
  const coursesPerPage = 10;
  let currentPage = 1;

  const coursesListElement = document.getElementById("courses-list");
  const paginationElement = document.getElementById("pagination");

  // Fetch courses data from JSON file when "Fetch Courses" button is clicked
  document.getElementById("fetch-courses").addEventListener("click", async () => {
      try {
          const response = await fetch('https://raw.githubusercontent.com/TojinMca/Lab-3-web/exam-lab/courses.json');
          courses = await response.json();
          renderCourses();
          renderPagination();
      } catch (error) {
          console.error("Failed to fetch courses data:", error);
      }
  });

  function renderCourses(page = 1) {
      currentPage = page;
      const start = (currentPage - 1) * coursesPerPage;
      const end = start + coursesPerPage;
      const paginatedCourses = courses.slice(start, end);

      coursesListElement.innerHTML = paginatedCourses.map(course => `
          <div class="course">
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <p>Duration: ${course.duration}</p>
            <p>Rating: ${course.rating}</p>
            <p>Category: ${course.category}</p>
            <p>Price: ${course.price}</p>
            <p>Enrolled: ${course.enrolled}</p>
          </div>
      `).join("");
  }

  function renderPagination() {
      const totalPages = Math.ceil(courses.length / coursesPerPage);
      paginationElement.innerHTML = "";

      const createButton = (page, text, disabled = false) => `
          <button class="${disabled ? 'disabled' : ''}" ${disabled ? '' : `data-page="${page}"`}>${text}</button>
      `;

      paginationElement.innerHTML += createButton(currentPage - 1, 'Previous', currentPage === 1);
      
      for (let i = 1; i <= totalPages; i++) {
          paginationElement.innerHTML += createButton(i, i);
      }

      paginationElement.innerHTML += createButton(currentPage + 1, 'Next', currentPage === totalPages);

      paginationElement.querySelectorAll('button').forEach(button => {
          button.addEventListener('click', (event) => {
              const page = parseInt(event.target.getAttribute('data-page'));
              if (page) {
                  renderCourses(page);
                  renderPagination();
              }
          });
      });
  }

  // Handle sorting
  document.getElementById("sort").addEventListener("change", (event) => {
      const sortBy = event.target.value;
      courses.sort((a, b) => {
          if (sortBy === "title") return a.title.localeCompare(b.title);
          if (sortBy === "rating") return b.rating - a.rating;
          if (sortBy === "price") return parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1));
      });
      renderCourses();
      renderPagination();
  });

  // Handle search functionality
  document.getElementById("search").addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredCourses = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm) || 
          course.instructor.toLowerCase().includes(searchTerm)
      );
      renderFilteredCourses(filteredCourses);
  });

  function renderFilteredCourses(filteredCourses) {
      coursesListElement.innerHTML = filteredCourses.map(course => `
          <div class="course">
            <h3>${course.title}</h3>
            <p>Instructor: ${course.instructor}</p>
            <p>Duration: ${course.duration}</p>
            <p>Rating: ${course.rating}</p>
            <p>Category: ${course.category}</p>
            <p>Price: ${course.price}</p>
            <p>Enrolled: ${course.enrolled}</p>
          </div>
      `).join("");
      renderPagination();
  }

  // Handle API button click
  document.getElementById("api-button").addEventListener("click", () => {
      window.location.href = 'API-index.html';
  });
});

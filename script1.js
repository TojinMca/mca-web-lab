let courses = [];
let currentPage = 1;
const itemsPerPage = 5;

// URL of the API with a CORS proxy
const apiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.coursera.org/api/courses.v1');

async function fetchCourses() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Log the entire data structure to understand it
        console.log('Fetched Data:', data);

        // Assuming 'elements' contains the course data
        courses = data.elements || []; // Ensure elements is an array

        // Log courses to check their structure
        console.log('Courses Data:', courses);

        displayCourses();
    } catch (error) {
        console.error('Error fetching course data:', error);
    }
}

function displayCourses() {
    const filteredCourses = filterCourses();
    const sortedCourses = sortCourses(filteredCourses);
    const paginatedCourses = paginateCourses(sortedCourses);

    const courseList = document.getElementById('courseList');
    const pageNumbersContainer = document.getElementById('pageNumbers');

    courseList.innerHTML = '';
    pageNumbersContainer.innerHTML = '';

    if (filteredCourses.length === 0 || paginatedCourses.length === 0) {
        courseList.innerHTML = '<p class="no-results">No Results Found</p>';
    } else {
        paginatedCourses.forEach(course => {
            const listItem = document.createElement('li');
            listItem.classList.add('course-item');

            // Log each course to check available fields
            console.log('Course:', course);

            // Extract details from the course object
            const courseName = course.name || 'No name available';
            const courseSlug = course.slug ? `Slug: ${course.slug}` : 'No slug available'; // Display slug if available
            const courseDescription = course.description || 'No description available'; // Handle missing description

            // Add the course item to the list
            listItem.innerHTML = `
                <h3>${courseName}</h3>
                <p>${courseSlug}</p>
                <p>${courseDescription}</p>
            `;
            courseList.appendChild(listItem);
        });

        // Add page number buttons
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('div');
            pageButton.classList.add('page-number');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayCourses();
            });
            pageNumbersContainer.appendChild(pageButton);
        }
    }

    updatePaginationControls();
}

function filterCourses() {
    const filterText = document.getElementById('filter').value.toLowerCase();
    return courses.filter(course => course.name && course.name.toLowerCase().includes(filterText));
}

function sortCourses(courses) {
    const sortOption = document.getElementById('sort').value;
    return courses.sort((a, b) => {
        if (sortOption === 'name-asc') {
            return (a.name || '').localeCompare(b.name || '');
        } else {
            return (b.name || '').localeCompare(a.name || '');
        }
    });
}

function paginateCourses(courses) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return courses.slice(startIndex, endIndex);
}

function updatePaginationControls() {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage * itemsPerPage >= courses.length;
}

document.getElementById('filter').addEventListener('input', () => {
    currentPage = 1; // Reset to the first page when searching
    displayCourses();
});
document.getElementById('sort').addEventListener('change', () => {
    currentPage = 1; // Reset to the first page when sorting
    displayCourses();
});
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayCourses();
    }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * itemsPerPage < courses.length) {
        currentPage++;
        displayCourses();
    }
});

// Add back button functionality if it's included in your HTML
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

fetchCourses();

const API_KEY = "PASTE-YOUR-API-KEY"; // Replace with your valid Pexels API key
const API_URL = "https://api.pexels.com/v1/search";
let currentPage = 1;
let currentQuery = "";

const galleryContainer = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-bar input");
const loadMoreButton = document.querySelector(".load-more");

// Fetch images from Pexels API
async function fetchImages(query, page = 1) {
  try {
    const response = await fetch(`${API_URL}?query=${query}&per_page=15&page=${page}`, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (data.photos.length === 0) {
      alert("No images found for your search query. Try another keyword.");
      return [];
    }

    return data.photos;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    alert(`Failed to load images! Check API key, network, or CORS issues.`);
    return [];
  }
}

// Render images to the gallery
function renderImages(images) {
  images.forEach((image) => {
    const imgElement = document.createElement("div");
    imgElement.classList.add("image");
    imgElement.innerHTML = `
      <img src="${image.src.medium}" alt="${image.alt}" />
      <div class="details">
        <a href="${image.src.original}" target="_blank" class="download">Download</a>
      </div>
    `;
    galleryContainer.appendChild(imgElement);
  });
}

// Handle search input
async function handleSearch(event) {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    galleryContainer.innerHTML = ""; // Clear existing images

    const images = await fetchImages(query, currentPage);
    renderImages(images);
  }
}

// Load more images
async function loadMoreImages() {
  currentPage++;
  const images = await fetchImages(currentQuery, currentPage);
  renderImages(images);
}

searchInput.addEventListener("keydown", handleSearch);
loadMoreButton.addEventListener("click", loadMoreImages);

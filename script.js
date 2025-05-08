  // Play button click
  document.getElementById('heroPlayBtn').addEventListener('click', function () {
    const videoUrl = "https://www.youtube.com/embed/b9EkMc79ZSU?autoplay=1"; // Change this if needed
    document.getElementById('heroVideo').src = videoUrl;
    document.getElementById('heroVideoContainer').classList.remove('d-none');
  });

  // Close button click
  document.getElementById('closeHeroVideo').addEventListener('click', function () {
    document.getElementById('heroVideo').src = ""; // Stop video
    document.getElementById('heroVideoContainer').classList.add('d-none');
  });

document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayMovieRows(data);
            setupModal();
        })
        .catch(error => console.error('Error loading data:', error));

    
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        } 
    });
});

function displayMovieRows(data) {
    const movieRowsContainer = document.getElementById('movieRows');
    
    data.categories.forEach(category => {
        const rowHTML = `
            <div class="row-container">
                <h2 class="row-title">${category.name}</h2>
                <div class="movie-row">
                    ${category.movies.map(movie => `
                        <div class="movie-card" data-movie-id="${movie.id}">
                            <img src="${movie.poster}" alt="${movie.title}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        movieRowsContainer.innerHTML += rowHTML;
    });
}

function setupModal() {
    const movieCards = document.querySelectorAll('.movie-card');
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    
    movieCards.forEach(card => {
        card.addEventListener('click', function() {
            const movieId = this.getAttribute('data-movie-id');
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const allMovies = data.categories.flatMap(cat => cat.movies);
                    const movie = allMovies.find(m => m.id == movieId);
                    if (movie) {
                        displayMovieModal(movie);
                        modal.show();
                    }
                });
        });
    });
}

function displayMovieModal(movie) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${movie.poster}" class="img-fluid" alt="${movie.title}">
            </div>
            <div class="col-md-8 movie-info">
                <h2>${movie.title}</h2>
                <div class="movie-meta">
                    <span>${movie.rating}% Match</span>
                    <span>${movie.year}</span>
                    <span>${movie.runtime}</span>
                </div>
                <p>${movie.description}</p>
                <div>
                    <button class="btn btn-danger me-2" id="playButton"><i class="fas fa-play"></i> Play</button>
                </div>
                <div id="videoContainer" class="d-none mt-3" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);">
                    <iframe id="movieVideo" src="${movie.youtubeUrl}?autoplay=1" frameborder="0" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    `;

    const playButton = document.getElementById('playButton');
    const videoContainer = document.getElementById('videoContainer');

    playButton.addEventListener('click', function() {
        playButton.style.display = 'none'; // Hide the play button
        videoContainer.classList.remove('d-none'); // Show the video container
    });
}


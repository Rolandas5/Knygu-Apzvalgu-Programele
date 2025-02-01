// json-server – yra skirta sukurti netikrą API serverio prieigą. Galėsime pasiekti su GET, POST, PUT, PATCH, DELETE
// json-server --version – pasitikrinti ar yra instaliuotas json-server ir ar grąžina versiją
// json-server --watch path_iki_failo.json – paleidžia serverį ir nustato kelią iki failo kuris taps duomenų baze

// Užduotis: sukurti atsiliepimų puslapį, kuriame būtų galima peržiūrėti, pridėti, redaguoti ir ištrinti atsiliepimus apie knygas
// 1. Reikia panaudoti POST, PATCH, DELETE ir GET metodus. (GET metodas jau panaudotas)
// 2. Reikia panaudoti json-server, kad būtų galima saugoti atsiliepimus. (db.json failas jau duotas su pavyzdžiu)

const apiUrl = 'http://localhost:3000/reviews';
const reviewList = document.getElementById('reviewList');
const reviewForm = document.getElementById('reviewForm');
let editingReviewId = null;

// POST – requestas (užklausa) (sukurti naujus įrašus)
async function addReview(review) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    await response.json();
    fetchReviews();
  } catch (error) {
    console.log(error);
    alert('Įvyko klaida pridedant naują atsiliepimą!');
  }
}

// DELETE – requestas (užklausa) ištrinti įrašą
async function deleteReview(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    await response.json();
    fetchReviews();
  } catch (error) {
    console.error(error);
    alert('Nepavyko ištrinti atsiliepimo, pamėginkite vėliau!');
  }
}

// Edit funkcija
async function editReview(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const data = await response.json();
    document.getElementById('bookTitle').value = data.title;
    document.getElementById('bookGenre').value = data.genre;
    document.getElementById('rating').value = data.rating;
    document.getElementById('reviewText').value = data.reviewText;
    document.querySelector('button').textContent = 'Atnaujinti duomenis';
    editingReviewId = id;
  } catch (error) {
    console.error(error);
    alert('Nepavyko gauti atsiliepimo duomenų, pamėginkite vėliau!');
  }
}

// PATCH – atnaujinti duomenis
async function updateReview(id, updatedReview) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReview),
    });

    await response.json();
    fetchReviews();
  } catch (error) {
    console.error(error);
    alert('Nepavyko atnaujinti atsiliepimo, pamėginkite vėliau!');
  }
}

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('bookTitle').value;
  const genre = document.getElementById('bookGenre').value;
  const rating = document.getElementById('rating').value;
  const reviewText = document.getElementById('reviewText').value;

  const newReview = { title, genre, rating, reviewText };

  if (editingReviewId) {
    updateReview(editingReviewId, newReview);
  } else {
    addReview(newReview);
  }

  reviewForm.reset();
  editingReviewId = null;
  reviewForm.querySelector('button').textContent = 'Pridėti apžvalgą';
});

// GET – metodas (gražina duomenis iš API)
async function fetchReviews() {
  try {
    const response = await fetch(apiUrl);
    const reviews = await response.json();
    reviewList.innerHTML = '';
    reviews.forEach((review) => {
      const reviewItem = document.createElement('li');
      reviewItem.innerHTML = `
        <div class="review-item">
          <strong>${review.title}</strong>
          <div>Žanras: <b>${review.genre}</b></div>
          <div>Reitingas: <b>${review.rating}</b> / 5</div>
          <p>${review.reviewText}</p>
        </div>
        <div class="review-actions">
          <button onclick="editReview('${review.id}')">Edit</button>
          <button onclick="deleteReview('${review.id}')">Delete</button>
        </div>
      `;
      reviewList.appendChild(reviewItem);
    });
  } catch (error) {
    console.error(error);
    alert('Klaida gaunant atsiliepimus!');
  }
}

// Kai dokumentas užkrautas, iškviečiamas fetchReviews
document.addEventListener('DOMContentLoaded', fetchReviews);

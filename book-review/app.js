// Užduotis: sukurti atsiliepimų puslapį, kuriame būtų galima peržiūrėti, pridėti, redaguoti ir ištrinti atsiliepimus apie knygas.
// 1. Reikia panaudoti POST, PATCH, DELETE ir GET metodus. (GET metodas jau panaudotas)
// 2. Reikia panaudoti json-server, kad būtų galima saugoti atsiliepimus. (db.json failas jau duotas su pavyzdžiu)

const apiUrl = 'http://localhost:3000/reviews';
const reviewList = document.getElementById('reviewList');

// GET metodas
async function fetchReviews() {
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
        <button onclick="editReview('${review.id}','${review.title}','${review.genre}','${review.rating}','${review.reviewText}')">Edit</button>
        <button onclick="deleteReview('${review.id}')">Delete</button>
      </div>
    `;
    reviewList.appendChild(reviewItem);
  });
}

// Kai dokumentas užkrautas, iškviečiamas fetchReviews funkcija
document.addEventListener('DOMContentLoaded', fetchReviews);

//------------------------------------------------------------------
// POST - sukurti nauja irasa

document
  .getElementById('reviewForm')
  .addEventListener('submit', async (event) => {
    // PreventDefault - neleidzia puslapiui persikrauti
    event.preventDefault();
    const bookTitle = document.getElementById('bookTitle').value;
    const bookGenre = document.getElementById('bookGenre').value;
    const rating = document.getElementById('rating').value;
    const reviewText = document.getElementById('reviewText').value;

    console.log(bookTitle, bookGenre, rating, reviewText);

    try {
      const response = await fetch(apiUrl, {
        // Nurodau, kad siunciu POST request kuris sukuria nauja irasa
        method: 'POST',
        // Nurodome kad siunciame JSON tipo duomenis i serveri
        headers: {
          'Content-Type': 'application/json',
        },
        // Nurodau kokius duomenis siunciu i serveri, siuo atveju title ir genre objektus
        body: JSON.stringify({
          title: bookTitle,
          genre: bookGenre,
          rating,
          reviewText,
        }),
      });

      fetchReviews();
      if (!response.ok) {
        throw new Error('Nepavyko sukuri naujo review!');
      }
    } catch (error) {
      console.error('Klaida kuriant nauja review!');
      alert('Klaida kuriant nauja review!');
    }
  });

// PATCH - atnaujinti irasa

async function editReview(id, title, genre, rating, reviewText) {
  const newTitle = prompt('Naujas bookTitle', title);
  const newGenre = prompt('Naujas bookGenre', genre);
  const newRating = prompt('Naujas rating', rating);
  const newReviewText = prompt('Naujas reviewText', reviewText);

  if (newTitle && newGenre && newRating && newReviewText) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          genre: newGenre,
          rating: newRating,
          reviewText: newReviewText,
        }),
      });
      fetchReviews();
      if (!response.ok) {
        throw new Error('Nepavyko redaguoti review!');
      }
    } catch (error) {
      console.error('Klaida redaguojant review!');
      alert('Klaida redaguojant review!');
    }
  }
}

// DELETE - istrinti irasa

async function deleteReview(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Nepavyko istrinti review');
    }

    fetchReviews();
  } catch (error) {
    console.error('Klaida istrinant review!');
    alert('Klaida trinant review!');
  }
}

fetchReviews();

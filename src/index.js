import axios from '../node_modules/axios';
import Notiflix from '../node_modules/notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
Notiflix.Notify.init({
  width: '280px',
  position: 'right-top',
  distance: '50px',
  opacity: 1,
});

const MAIN_URL = 'https://pixabay.com/api/';
const KEY = '29244852-b91e3d5198a9840c92a9dad06';
const galleryItem = document.querySelector('.gallery');

const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  const queryString = event.target.searchQuery.value.trim();
  form.reset();

  await fetchQuery(queryString)
    .then(response => {
      addLayout(response);
    })
    .catch(err => console.log(err));
}
async function fetchQuery(queryString) {
  const params = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };
  const axInstance = await axios(
    `${MAIN_URL}?key=${KEY}&q=${queryString}&${params}`
  );
  return axInstance;
}

function addLayout(response) {
  if (!response.data.total) {
    form.reset();
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    createLayout(response.data);
  }
}

function createLayout({ total, hits }) {
  const res = hits
    .map(item => {
      return `<a href="${item.largeImageURL}" class="link">
      <div class="photo-card">
        <img
          src="${item.webformatURL}"
          alt="${item.tags}"
          loading="lazy"
          class="cardImage gallery__image"
        />
        <div class="info">
          <p class="info-item">
            <b>Likes ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${item.views}</b>
          </p>
          <p class="info-item"><b>Comments ${item.comments}</b></p>
          <p class="info-item">
            <b>Downloads ${item.downloads}</b>
          </p>
        </div>
      </div>
    </a> `;
    })
    .join('');

  galleryItem.innerHTML = res;

  let gallery = new SimpleLightbox('.gallery a');
}

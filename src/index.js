import axios from '../node_modules/axios';
import Notiflix from '../node_modules/notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  width: '500px',
  position: 'center-top',
  distance: '150px',
  opacity: 1,
  timeout: 3500,
});

let options = {
  root: null,
  rootMargin: '250px',
};

let observer = new IntersectionObserver(onLastItem, options);
let queryString = '';
let page = 1;

const MAIN_URL = 'https://pixabay.com/api/';
const KEY = '29244852-b91e3d5198a9840c92a9dad06';
const galleryItem = document.querySelector('.gallery');
const upperBtn = document.querySelector('.upper');
// upperBtn.addEventListener('click', onclick);
const target = document.querySelector('.js-guard');

const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);

function onLastItem(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchQuery(queryString)
        .then(response => {
          // gallery.refresh();
          addLayout(response);
        })
        .catch(err => console.log(err));
    }
  });
}

function smoothScroll(galleryItem, scrollPercentage) {
  const { height: cardHeight } =
    galleryItem.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * scrollPercentage,
    behavior: 'smooth',
  });
}

async function onSubmit(event) {
  event.preventDefault();
  galleryItem.innerHTML = '';
  queryString = '';
  queryString = event.target.searchQuery.value
    .trim()
    .toLowerCase()
    .replaceAll(' ', '+');

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
    per_page: 40,
  };
  const axInstance = await axios(
    `${MAIN_URL}?key=${KEY}&q=${queryString}&image_type=${params.image_type}&orientation=${params.orientation}&safesearch=${params.safesearch}&per_page=${params.per_page}&page=${page}`
  );
  return axInstance;
}

function addLayout(response) {
  if (!response.data.total) {
    form.reset();
    galleryItem.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    createLayout(response.data);
  }
}

function createLayout({ hits }) {
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
                        <b class="info-title">Likes</b>${item.likes}
                      </p>
                      <p class="info-item">
                        <b class="info-title">Views</b>${item.views}
                      </p>
                      <p class="info-item"><b class="info-title">Comments</b>${item.comments}</p>
                      <p class="info-item">
                        <b class="info-title">Downloads</b>${item.downloads}
                      </p>
                    </div>
               </div>
             </a> `;
    })
    .join('');

  galleryItem.insertAdjacentHTML('beforeend', res);
  let gallery = new SimpleLightbox('.gallery a');

  smoothScroll(galleryItem, 0.25);

  observer.observe(target);

  upperBtn.removeAttribute('disabled');
  upperBtn.style.fillOpacity = 1;
  upperBtn.style.cursor = 'pointer';

  upperBtn.onclick = () => {
    window.scrollTo(0, 0);
  };
}

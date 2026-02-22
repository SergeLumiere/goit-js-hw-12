import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;

let endMessageShown = false;

hideLoadMoreButton();

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  query = event.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  totalHits = 0;
  endMessageShown = false;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    iziToast.success({
      message: `Hooray! We found ${totalHits} images.`,
      position: 'topRight',
    });

    updateLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    formEl.reset();
  }
}

async function onLoadMore() {
  hideLoadMoreButton();
  loadMoreBtn.disabled = true;

  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);
    smoothScroll();

    updateLoadMoreVisibility();
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
  }
}

function updateLoadMoreVisibility() {
  const loaded = page * PER_PAGE;

  if (loaded >= totalHits) {
    hideLoadMoreButton();

    if (!endMessageShown) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      endMessageShown = true;
    }
    return;
  }

  showLoadMoreButton();
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

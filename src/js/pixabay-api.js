import axios from 'axios';

const PER_PAGE = 15;

const pixabayApi = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '54679610-8cb3c8a86ad83c3b54957649e',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  },
});

export async function getImagesByQuery(query, page = 1) {
  const response = await pixabayApi.get('', {
    params: {
      q: query,
      page,
    },
  });

  return response.data;
}

export { PER_PAGE };

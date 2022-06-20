/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request');
const { exec } = require('child_process');

const cconfURL = new URL(
  'https://msapi.template.net/conf/datalayer/getDatalayer',
);
cconfURL.searchParams.append('filter', 'categories');
request({ url: cconfURL.toString(), json: true }, (err, response) => {
  if (err) {
    console.error('can not get categories list', err);
    throw new Error('can not get categories list');
  }
  const categories = response.body || {};
  const REACT_APP_CATEGORIES = {};
  const REACT_APP_DOCS_LIST_CATEGORY_ID = [];
  Object.keys(categories).forEach(categoryId => {
    const { slug } = categories[categoryId];
    const { name } = categories[categoryId];
    const { type } = categories[categoryId];
    REACT_APP_CATEGORIES[slug] = categories[categoryId];
    REACT_APP_CATEGORIES[slug].value = parseInt(categoryId, 10);
    REACT_APP_CATEGORIES[slug].label = name;
    REACT_APP_CATEGORIES[slug].editor = slug;
    if (type === 'docs') {
      REACT_APP_DOCS_LIST_CATEGORY_ID.push(parseInt(categoryId, 10));
    }
  });
  process.env.REACT_APP_CATEGORIES = JSON.stringify(REACT_APP_CATEGORIES);
  process.env.REACT_APP_DOCS_LIST_CATEGORY_ID = JSON.stringify(
    REACT_APP_DOCS_LIST_CATEGORY_ID,
  );
  // trace env
  exec('react-scripts build', (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      console.log(stdout);
      console.log(stderr);
      throw error;
    }
    console.log('DONE', stdout);
  });
});

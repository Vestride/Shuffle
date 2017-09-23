var Shuffle = window.Shuffle;
var currentPage = 1;
var totalPages;
var gridContainerElement = document.getElementById('grid');
var loadMoreButton = document.getElementById('load-more-button');
var shuffleInstance;

// Fetch first page of results from the API.
// You should probably polyfill `fetch` if you're going to copy this demo.
// https://github.com/github/fetch
fetch('https://reqres.in/api/users?page=' + currentPage)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    // Store the total number of pages so we know when to disable the "load more" button.
    totalPages = response.total_pages;

    // Create and insert the markup.
    var markup = getItemMarkup(response.data);
    appendMarkupToGrid(markup);

    // Add click listener to button to load the next page.
    loadMoreButton.addEventListener('click', fetchNextPage);

    // Initialize Shuffle now that there are items.
    shuffleInstance = new Shuffle(gridContainerElement, {
      itemSelector: '.js-item',
      sizer: '.my-sizer-element',
    });
  });

function fetchNextPage() {
  currentPage += 1;
  fetch('https://reqres.in/api/users?page=' + currentPage)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      // Create and insert the markup.
      var markup = getItemMarkup(response.data);
      appendMarkupToGrid(markup);

      // Check if there are any more pages to load.
      if (currentPage === totalPages) {
        replaceLoadMoreButton();
      }

      // Save the total number of new items returned from the API.
      var itemsFromResponse = response.data.length;
      // Get an array of elements that were just added to the grid above.
      var allItemsInGrid = Array.from(gridContainerElement.children);
      // Use negative beginning index to extract items from the end of the array.
      var newItems = allItemsInGrid.slice(-itemsFromResponse);

      // Notify the shuffle instance that new items were added.
      shuffleInstance.add(newItems);
    });
}

/**
 * Convert an object to HTML markup for an item.
 * @param {object} dataForSingleItem Data object.
 * @return {string}
 */
function getMarkupFromData(dataForSingleItem) {
  var name = dataForSingleItem.first_name + ' ' + dataForSingleItem.last_name;
  // https://www.paulirish.com/2009/random-hex-color-code-snippets/
  var randomColor = ('000000' + Math.random().toString(16).slice(2, 8)).slice(-6);
  return [
    '<div class="js-item col-3@xs col-3@sm person-item" data-id="' + dataForSingleItem.id + '">',
    '<div class="person-item__inner" style="background-color:#' + randomColor + '">',
    '<span>' + name + '</span>',
    '</div>',
    '</div>',
  ].join('');
}

/**
 * Convert an array of item objects to HTML markup.
 * @param {object[]} items Items array.
 * @return {string}
 */
function getItemMarkup(items) {
  return items.reduce(function (str, item) {
    return str + getMarkupFromData(item);
  }, '');
}

/**
 * Append HTML markup to the main Shuffle element.
 * @param {string} markup A string of HTML.
 */
function appendMarkupToGrid(markup) {
  gridContainerElement.insertAdjacentHTML('beforeend', markup);
}

/**
 * Remove the load more button so that the user cannot click it again.
 */
function replaceLoadMoreButton() {
  var text = document.createTextNode('All users loaded');
  var replacement = document.createElement('p');
  replacement.appendChild(text);
  loadMoreButton.parentNode.replaceChild(replacement, loadMoreButton);
}

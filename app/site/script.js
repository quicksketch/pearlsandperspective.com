"use strict"

window.addEventListener('load', init);

const QUOTE_ALL = '- all -';
let quoteData = {

  /**
   * @type {{quote: String, name: String, image: String}[]}
   */
  quotes: [],

  /**
   * @type {String[]}
   */
  images: [],

  /**
   * @type {String[]}
   */
  tags: [QUOTE_ALL],

  /**
   * @type {quote: String, name: String, image: String}
   */
  currentQuote: undefined,

  /**
   * @type {quote: String, name: String, image: String}
   */
  nextQuote: undefined,
};

/**
 * @type {string}
 */
let activeTag = QUOTE_ALL;

async function init() {
  // Get the list of quotes.
  const quotesResponse = await fetch('quotes.json');
  quoteData.quotes = await quotesResponse.json();

  // Get the list of images.
  const imagesResponse = await fetch('images.json');
  quoteData.images = await imagesResponse.json();

  // Assemble the list of tags from all quotes.
  quoteData.quotes.forEach((quote) => {
    if (typeof quote.tags === 'undefined') {
      return;
    }
    quote.tags.forEach((tag) => {
      if (!quoteData.tags.includes(tag)) {
        quoteData.tags.push(tag);
      }
    });
  });

  // Sort alphabetically.
  quoteData.tags.sort((a, b) => {
    return a.localeCompare(b);
  });

  bindTagSelector();
  bindRefreshLink();

  // Set initial quotes.
  const currentQuote = getRandomQuote();
  setCurrentQuote(currentQuote);
  setNextQuote(getRandomQuote());

  // Set initial background image.
  document.getElementById('background-image-current').style.backgroundImage = 'url(images/' + currentQuote.image + ')';

  // Fade in the initial quote.
  document.getElementById('quote-text').classList.remove('fade-out');
  document.getElementById('quote-attribution').classList.remove('fade-out');
}

/**
 * Populate the tag list and bind the click handler to show/hide the tag list.
 */
function bindTagSelector() {
  const tagList = document.getElementById('tag-list');
  const tagTemplate = document.getElementById('tag-template');

  // Clone the tag template and append the dynamic list of tags.
  tagTemplate.remove();
  tagTemplate.removeAttribute('id');
  quoteData.tags.forEach((tag, tagNumber) => {
    const newTagElement = tagTemplate.cloneNode(true);
    const tagLink = newTagElement.firstChild;
    tagLink.innerText = tag;
    tagLink.href = '#' + tag;
    newTagElement.style.transitionDelay = ((quoteData.tags.length - tagNumber) * 100) + 'ms';

    if (activeTag === tag) {
      newTagElement.classList.add('active');
    }

    // On click, update the active tag and refresh.
    newTagElement.addEventListener('click', async (e) => {
      e.preventDefault();

      // Remove the active class.
      const activeLinks = document.getElementsByClassName('tag active');
      for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
      }

      // Set the new active class and tag.
      newTagElement.classList.add('active');
      activeTag = tag;
      await showRandomQuote();
    });
    tagList.append(newTagElement);
  });

  // Bind the hide/show behavior of the tag list selector (gear icon).
  const toggleLink = document.getElementById('tag-selector-toggle');
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (tagList.classList.contains('tag-list--closed')) {
      tagList.classList.remove('tag-list--closed');
      tagList.classList.add('tag-list--open');
    }
    else {
      tagList.classList.remove('tag-list--open');
      tagList.classList.add('tag-list--closed');
    }
  });
}

/**
 * Add the click handler to the refresh link.
 */
function bindRefreshLink() {
  const refreshLink = document.getElementById('refresh');
  refreshLink.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await showRandomQuote();
  });
}

/**
 * Rotate to the next quote.
 */
async function showRandomQuote() {
  const quoteElement = document.getElementById('quote-text');
  const attrElement = document.getElementById('quote-attribution');
  const currentImgElement = document.getElementById('background-image-current');
  const nextImgElement = document.getElementById('background-image-next');
  const nextQuote = getRandomQuote();

  // Transition between the current and next image.
  currentImgElement.style.opacity = '0%';
  nextImgElement.style.opacity = '100%';

  // Fade-out the previous quote.
  quoteElement.classList.add('fade-out');
  attrElement.classList.add('fade-out');

  // Wait while previous quote is fading.
  await sleep(2000);

  // Swap the IDs of the background images so that the next image will be
  // replaced with the next quote's image.
  currentImgElement.id = 'background-image-next';
  nextImgElement.id = 'background-image-current';

  // Change the quote while the element is fully hidden.
  setCurrentQuote(quoteData.nextQuote);
  setNextQuote(nextQuote);

  // Remove the class to fade it in.
  quoteElement.classList.remove('fade-out');
  attrElement.classList.remove('fade-out');
}

function getRandomQuote() {
  // Create a filtered quote list based on the current tag.
  let filteredQuotes = quoteData.quotes;
  if (activeTag !== QUOTE_ALL) {
    filteredQuotes = quoteData.quotes.filter((item) => {
      return typeof item.tags !== 'undefined' && item.tags.includes(activeTag);
    });
  }

  // Select the next random quote.
  const quoteNumber = Math.floor(Math.random() * filteredQuotes.length);
  const imageNumber = Math.floor(Math.random() * quoteData.images.length);
  const quote = filteredQuotes[quoteNumber];
  quote.image = quoteData.images[imageNumber];
  return quote;
}

function setCurrentQuote(quote) {
  const quoteElement = document.getElementById('quote-text');
  const attrElement = document.getElementById('quote-attribution');

  quoteElement.innerHTML = escapeQuote(quote.quote);
  attrElement.innerText = quote.name;

  quoteData.currentQuote = quote;
}

function setNextQuote(quote) {
  const imageElement = document.getElementById('background-image-next');
  imageElement.style.backgroundImage = 'url(images/' + quote.image + ')';
  quoteData.nextQuote = quote;
}

function escapeQuote(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/**
 * Utility function to pause execution for transitions to complete.
 * @param {Number} ms
 */
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

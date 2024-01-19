"use strict"

window.addEventListener('load', init);

let quoteData = {

  /**
   * @type {{quote: String, name: String, image: String}[]}
   */
  quotes: [],

  /**
   * @type {String[]}
   */
  images: []
}

async function init() {
  const quotesResponse = await fetch('quotes.json');
  quoteData.quotes = await quotesResponse.json();

  const imagesResponse = await fetch('images.json');
  quoteData.images = await imagesResponse.json();

  await showRandomQuote();
}

async function showRandomQuote() {
  const quoteNumber = Math.floor(Math.random() * quoteData.quotes.length);
  const imageNumber = Math.floor(Math.random() * quoteData.images.length);
  const quote = quoteData.quotes[quoteNumber];
  const image = quoteData.images[imageNumber];

  const quoteElement = document.getElementById('quote-text');
  const attrElement = document.getElementById('quote-attribution');
  const imageElement = document.getElementById('background-image');
  const elements = {
    quote: quoteElement,
    attribution: attrElement,
    image: imageElement,
  }

  imageElement.style.backgroundImage = 'url(images/' + image + ')';
  quoteElement.innerHTML = escapeQuote(quote.quote);
  attrElement.innerText = quote.name;

  elements.quote.classList.remove('fade-in');
  elements.attribution.classList.remove('fade-in');
}

function escapeQuote(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

async function fadeOutQuote(elements) {
  return new Promise((resolve) => {
    setTimeout(() => {
      elements.quote.classList.add('fade-out');
      elements.attribution.classList.add('fade-out');
      resolve(elements);
    }, 1000);
  });
}

async function fadeInQuote(elements) {
  return new Promise((resolve) => {
    elements.quote.classList.replace('fade-out', 'fade-in');
    elements.attribution.classList.replace('fade-out', 'fade-in');
    elements.quote.classList.add('fade-in');
    elements.attribution.classList.add('fade-in');
    setTimeout(() => {
      elements.quote.classList.remove('fade-in');
      elements.attribution.classList.remove('fade-in');
      resolve(elements);
    }, 3000);
  });
}
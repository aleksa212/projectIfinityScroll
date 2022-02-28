const dropdown = document.getElementById("dropdown");
const dropdownContent = document.getElementById("dropdown-content");
const content = document.querySelector('.content');
const container = document.querySelector('.container');
const selectBtn = document.getElementById('select-btn');
const loader = document.querySelector('.lds-hourglass');

const orientationOptions = ['none', 'landscape', 'portrait', 'squarish'];
const count = 30;
const apiKey = 'L54QlQj0RYbTYgXGl1uAlQ6APatLa_bX-HDqCZSyOCQ';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

let photos = [];
let selectedOrientation = '';
let imagesLoaded = 0;
let ready = false;

function activateLoader() {
  loader.classList.add('loader-active');
}

function removeLoader() {
  loader.classList.remove('loader-active');
}

function toggleItem(event) {
  event.stopPropagation();
  if (dropdownContent.classList.contains("submenu-active")) {
    dropdownContent.classList.remove("submenu-active");
  }else{
    dropdownContent.classList.add("submenu-active");
  }
}

function addOrientationOptions() {
  orientationOptions.forEach(option => {
    const li = document.createElement('li');
    li.classList.add('subitem');
    const a = document.createElement('a');
    a.setAttribute('id', option);
    a.textContent = option.charAt(0).toUpperCase() + option.slice(1);;
    li.appendChild(a);
    dropdownContent.appendChild(li);
    a.addEventListener('click', onSelectedOrientation);
  })
}

async function getPhotos() {
  try {
      activateLoader();
      let finalUrl = apiUrl;
      if(!selectedOrientation || selectedOrientation !== 'none'){
        finalUrl = finalUrl + `&orientation=${selectedOrientation}`;
      }
      const response = await fetch(finalUrl);
      photos = await response.json();
      displayPhotos();
      removeLoader();
  }catch (error) {

  }
}

function displayPhotos() {
    for (let photo of photos) {
        const img = document.createElement('img');
        const desc = photo.alt_description || photo.description ||'no description'
        img.setAttribute('src', photo.urls.small);
        img.setAttribute('alt', desc);
        img.setAttribute('title', desc);
        img.addEventListener('load', imageLoaded);
        content.appendChild(img);
    }    
}

function imageLoaded() {
  imagesLoaded++;
  if(imagesLoaded >= count) {
    ready = true;
  }
}
 
function onSelectedOrientation(event) {
  const target = event.target;
  selectBtn.textContent = target.textContent;
  selectedOrientation = target.id;
  content.innerHTML = '';
  container.scrollTop = 0;
  getPhotos();
}

addOrientationOptions();
getPhotos();
 
dropdown.addEventListener('click', toggleItem);
window.addEventListener('click', () => {
  if (dropdownContent.classList.contains("submenu-active")) {
    dropdownContent.classList.remove("submenu-active");
  }
})

container.addEventListener('scroll', () => {
    if (container.scrollTop + container.clientHeight > container.scrollHeight - container.clientHeight && ready) {
      ready = false;
      getPhotos();
    }
    
});

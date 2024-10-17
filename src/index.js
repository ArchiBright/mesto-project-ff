import './pages/index.css';

// Initial card data
const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  }
];

// Profile section DOM elements
const profileImage = document.querySelector('.profile__image');
const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

// Popup DOM elements
const imagePopup = document.querySelector('.popup_type_image');
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

// Popup content elements
const imageElement = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');

// Forms
const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const addCardForm = document.querySelector('.popup__form[name="new-place"]');

// Card list
const cardList = document.querySelector('.places__list');

// Initialize profile image
profileImage.style.backgroundImage = `url(${require('./images/avatar.jpg')})`;

// Create a card element
function createCard(cardData, deleteCallback) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const cardElement = template.querySelector('.card');
  const cardImage = template.querySelector('.card__image');
  const cardTitle = template.querySelector('.card__title');
  const deleteButton = template.querySelector('.card__delete-button');
  const likeButton = template.querySelector('.card__like-button');
  
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardImage.addEventListener('click', () => openImagePopup(cardData.link, cardData.name));
  deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  likeButton.addEventListener('click', () => likeButton.classList.toggle('card__like-button_is-active'));

  return cardElement;
}

// Remove a card from DOM
function removeCard(cardElement) {
  cardElement.remove();
}

// Render initial cards
function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, removeCard);
    cardList.appendChild(cardElement);
  });
}

// Open a popup
function openPopup(popup) {
  popup.style.display = 'flex';
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closePopupOnEsc);
}

// Close a popup
function closePopup(popup) {
  popup.style.display = 'none';
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupOnEsc);
}

// Close popup when "Escape" key is pressed
function closePopupOnEsc(event) {
  if (event.key === 'Escape') {
    const openPopup = document.querySelector('.popup_is-opened');
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}

// Open image popup with the clicked image
function openImagePopup(imageSrc, captionText) {
  imageElement.src = imageSrc;
  imageElement.alt = captionText;
  imageCaption.textContent = captionText;
  openPopup(imagePopup);
}

// Edit profile event handler
function handleEditProfile() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  openPopup(editPopup);
}

// Submit edit profile form
function handleProfileFormSubmit(event) {
  event.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  closePopup(editPopup);
}

// Add a new card to the list
function addNewCard(cardData) {
  const newCard = createCard(cardData, removeCard);
  cardList.prepend(newCard);
}

// Submit new card form
function handleAddCardFormSubmit(event) {
  event.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  addNewCard(newCardData);
  addCardForm.reset();
  closePopup(addPopup);
}

// Close popup when clicking outside the content area
function closePopupOnOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closePopup(event.currentTarget);
  }
}

// Event listeners for buttons and forms
document.querySelector('.profile__edit-button').addEventListener('click', handleEditProfile);
document.querySelector('.profile__add-button').addEventListener('click', () => openPopup(addPopup));
editForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
popups.forEach(popup => popup.addEventListener('click', closePopupOnOverlayClick));
closeButtons.forEach(button => button.addEventListener('click', (event) => closePopup(event.target.closest('.popup'))));

// Render initial cards
renderCards(initialCards);
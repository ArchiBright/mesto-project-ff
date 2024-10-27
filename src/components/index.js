import '../pages/index.css';
import { createCard, removeCard, handleToggleLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateProfilePicture } from './api.js';  // Импорт валидации


let currentUserId;
// DOM elements
const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${require('../images/avatar.jpg')})`;

const cardList = document.querySelector('.places__list');

// Image popup handling
const imagePopup = document.querySelector('.popup_type_image');
const imageElement = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');

// Function to open the image popup
function openImagePopup(imageSrc, imageAlt, captionText) {
  imageElement.src = imageSrc;
  imageElement.alt = imageAlt;
  imageCaption.textContent = captionText;
  openModal(imagePopup);
}

// Rendering initial cards
function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, removeCard, openImagePopup, handleToggleLike, currentUserId);
    cardList.appendChild(cardElement);
  });
}

getUserInfo()
  .then(userData => {
    currentUserId = userData._id;
    document.querySelector('.profile__title').textContent = userData.name;
    document.querySelector('.profile__description').textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch(err => console.log(err));

getInitialCards()
  .then(cards => {
    renderCards(cards);
  })
  .catch(err => console.log(err));

// Opening and closing modals
const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');
const closeButtons = document.querySelectorAll('.popup__close');
const popupButton = document.querySelector('.popup__button');

// Opening modals with validation reset
editButton.addEventListener('click', () => {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  clearValidation(editForm, validationConfig);  // Очистка ошибок валидации
  openModal(editPopup);
});

addButton.addEventListener('click', () => {
  addCardForm.reset();  // Сброс формы
  clearValidation(addCardForm, validationConfig);  // Очистка ошибок валидации
  openModal(addPopup);
});

profileImage.addEventListener('click', () => {
  addCardForm.reset();  // Сброс формы
  clearValidation(addCardForm, validationConfig);  // Очистка ошибок валидации
  openModal(avatarPopup);
});

// Closing modals
closeButtons.forEach(button => { 
  const popup = button.closest('.popup');     
  button.addEventListener('click', () => { 
    closeModal(popup); 
  }); 
}); 

// Form handling for editing profile
const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');

editForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateUserInfo(nameInput.value, descriptionInput.value)
    .then(userData => {
      document.querySelector('.profile__title').textContent = userData.name;
      document.querySelector('.profile__description').textContent = userData.about;
      renderLoading(true);
      closeModal(editPopup);
    })
    .catch(err => console.log(err));
});

// Form handling for adding new cards
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');

addCardForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then(cardData => {
      const newCard = createCard(cardData, removeCard, openImagePopup, toggleLikeState, currentUserId);
      cardList.prepend(newCard);
      addCardForm.reset();
      renderLoading(true);
      closeModal(addPopup);
    })
    .catch(err => console.log(err));
});

// Form handling for updating profile picture
const avatarForm = document.querySelector('.popup__form[name="avatar"]');
const avatarLinkInput = document.querySelector('.popup__input_type_url-avatar');

avatarForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateProfilePicture(avatarLinkInput.value)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      renderLoading(true);
      closeModal(avatarPopup);
    })
    .catch(err => console.log(err));
});

// Close popups on overlay click
const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closeModal(popup);
    }
  });
});

function renderLoading(isLoading) {
  popupButton.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}

// Конфиг для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации для всех форм
enableValidation(validationConfig);
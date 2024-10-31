import '../pages/index.css';
import { createCard, removeCard, handleToggleLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateProfilePicture, deleteCard } from './api.js';

let currentUserId;

// Profile Elements
const profileImage = document.querySelector('.profile__image');
profileImage.style.backgroundImage = `url(${require('../images/avatar.jpg')})`;
const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

// Card List
const cardList = document.querySelector('.places__list');

// Popup Buttons
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Image Popup
const imagePopup = document.querySelector('.popup_type_image');
const imageElement = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');

// Delete Confirmation Popup
const deletePopup = document.querySelector('.popup_type_delete');
const deleteConfirmButton = deletePopup.querySelector('.popup__button_type_confirm');

// Form Popups
const editPopup = document.querySelector('.popup_type_edit');
const addPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');

// Forms and Inputs
const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
const avatarForm = document.querySelector('.popup__form[name="avatar"]');
const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');
const avatarLinkInput = document.querySelector('.popup__input_type_url-avatar');

const popupButton = document.querySelector('.popup__button');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Image popup handler
function openImagePopup(imageSrc, imageAlt, captionText) {
  imageElement.src = imageSrc;
  imageElement.alt = imageAlt;
  imageCaption.textContent = captionText;
  openModal(imagePopup);
}

// Delete card setup
let cardIdForDelete;
let cardElementForDelete;
function setupDeleteButton(cardId, cardElement) {
  cardIdForDelete = cardId;
  cardElementForDelete = cardElement;
  openModal(deletePopup);
}

// Confirm delete card
deleteConfirmButton.addEventListener('click', () => {
  if (cardIdForDelete && cardElementForDelete) {
    deleteCard(cardIdForDelete)
      .then(() => {
        removeCard(cardElementForDelete);
        closeModal(deletePopup);
      })
      .catch(err => console.log("Failed to delete card:", err))
      .finally(() => {
        cardIdForDelete = null;
        cardElementForDelete = null;
      });
  }
});

// Render initial cards
function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(cardData, setupDeleteButton, openImagePopup, handleToggleLike, currentUserId);
    cardList.appendChild(cardElement);
  });
}

// Fetch initial data (user info and cards)
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    renderCards(cards);
  })
  .catch(err => console.log("Error loading initial data:", err));

// Event Listeners

// Open edit profile popup
editButton.addEventListener('click', () => {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editPopup);
});

// Open add card popup
addButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addPopup);
});

// Open avatar update popup
profileImage.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Close popup when clicking outside of it
const popups = document.querySelectorAll('.popup');
popups.forEach(popup => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closeModal(popup);
    }
  });
});

// Close popup buttons
closeButtons.forEach(button => { 
  const popup = button.closest('.popup');     
  button.addEventListener('click', () => { 
    closeModal(popup); 
  }); 
}); 

// Form submission handlers

// Update profile information
editForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateUserInfo(nameInput.value, descriptionInput.value)
    .then(userData => {
      profileNameElement.textContent = userData.name;
      profileDescriptionElement.textContent = userData.about;
      renderLoading(true);
      closeModal(editPopup);
    })
    .catch(err => console.log("Error updating profile:", err));
});

// Add new card
addCardForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then(cardData => {
      const newCard = createCard(cardData, setupDeleteButton, openImagePopup, handleToggleLike, currentUserId);
      cardList.prepend(newCard);
      addCardForm.reset();
      renderLoading(true);
      closeModal(addPopup);
    })
    .catch(err => console.log("Error adding new card:", err));
});

// Update profile avatar
avatarForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateProfilePicture(avatarLinkInput.value)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      renderLoading(true);
      closeModal(avatarPopup);
    })
    .catch(err => console.log("Error updating avatar:", err));
});

// Render loading state during data submission
function renderLoading(isLoading) {
  popupButton.textContent = isLoading ? 'Saving...' : 'Save';
}

// Enable validation on all forms
enableValidation(validationConfig);
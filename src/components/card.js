import { getUserInfo, deleteCard, toggleLike as apiToggleLike } from "./api";
import { openModal, closeModal } from "./modal";

// Universal like toggle function
export function handleToggleLike(cardData, currentUserId, likeCounter, likeButton) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  apiToggleLike(cardData._id, isLiked)
    .then(cardInfo => {
      likeCounter.textContent = cardInfo.likes.length;
      
      if (cardInfo.likes.some(like => like._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
      } else {
        likeButton.classList.remove('card__like-button_is-active');
      }
    })
    .catch(err => {
      console.log("Failed to toggle like:", err);
    });
}

// Function to create a card
export function createCard(cardData, deleteCallback, openImagePopup, toggleLikeCallback) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const cardElement = template.querySelector('.card');
  const cardImage = template.querySelector('.card__image');
  const cardTitle = template.querySelector('.card__title');
  const deleteButton = template.querySelector('.card__delete-button');
  const likeButton = template.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const deletePopup = document.querySelector('.popup_type_delete');
  const deleteConfirmButton = deletePopup.querySelector('.popup__button_type_confirm');

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  // Event listener for image click to open image popup
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name, cardData.name); 
  });

  // Adding the click callback to the card element if provided

  getUserInfo()
    .then(userData => {
      const currentUserId = userData._id;

      if (cardData.owner._id !== currentUserId) {
        deleteButton.remove();
      } else {
        deleteButton.addEventListener('click', () => {
          openModal(deletePopup);
          deleteConfirmButton.addEventListener('click', () => {
            deleteCard(cardData._id)
              .then(() => {
                deleteCallback(cardElement);
                closeModal(deletePopup);
              })
              .catch(err => {
                console.log("Failed to delete card:", err);
              });
          });
        });
      }

      const userHasLiked = cardData.likes.some(like => like._id === currentUserId);
      likeCounter.textContent = cardData.likes.length;

      if (userHasLiked) {
        likeButton.classList.add('card__like-button_is-active');
      }

      // Using handleToggleLike as a universal callback for the like button
      likeButton.addEventListener('click', () => {
        toggleLikeCallback(cardData, currentUserId, likeCounter, likeButton);
      });
    })
    .catch(err => {
      console.log("Failed to get user info:", err);
    });

  return cardElement;
}

// Function to remove a card
export function removeCard(cardElement) { 
  cardElement.remove();
}
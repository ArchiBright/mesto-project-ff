import { getUserInfo, deleteCard, toggleLike } from "./api";
import { openModal, closeModal } from "./modal";

// Function to toggle like state
export function toggleLikeState(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

// Function to create a card
export function createCard(cardData, deleteCallback, openImagePopup, likeCallback) {
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
  likeCounter.textContent = cardData.likes.length;

  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  getUserInfo()
    .then(userData => {
      const currentUserId = userData._id;

      // Show or hide delete button based on ownership
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
              .catch(err => console.log(err));
          });
        });
      }

      // Initialize like button state based on whether the user has liked the card
      const userHasLiked = cardData.likes.some(like => like._id === currentUserId);
      if (userHasLiked) {
        likeButton.classList.add('card__like-button_is-active');
      }

      // Event listener for like button to toggle like state
      likeButton.addEventListener('click', () => {
        toggleLike(cardData._id, userHasLiked)
          .then(cardInfo => {
            likeCounter.textContent = cardInfo.likes.length;

            // Update button state based on new likes
            if (cardInfo.likes.some(like => like._id === currentUserId)) {
              likeButton.classList.add('card__like-button_is-active');
            } else {
              likeButton.classList.remove('card__like-button_is-active');
            }
          })
          .catch(err => console.log("Failed to toggle like:", err));
      });
    })
    .catch(err => console.log("Failed to get user info:", err));

  return cardElement;
}

// Function to remove a card
export function removeCard(cardElement) { 
  cardElement.remove();
}
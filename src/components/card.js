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
  // likeCounter.textContent = cardData.likes.length;

  // Event listener for image click to open image popup
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name, cardData.name); 
  });

  // Fetch current user info and only after that decide whether to show the delete button
  getUserInfo()
  .then(userData => {
    const currentUserId = userData._id;

    // Check if the current user is the owner of the card
    if (cardData.owner._id !== currentUserId) {
      deleteButton.remove(); // Remove delete button if the current user is not the owner
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
              console.log(err);
            });
        });
      });
    }

    // Check if the current user has liked the card
    const userHasLiked = cardData.likes.some(like => like._id === currentUserId);

    // Call toggleLike function with card ID and userHasLiked status
    toggleLike(cardData._id, userHasLiked)
      .then(cardInfo => {
        likeCounter.textContent = cardInfo.likes.length;

        // Update like button state based on new data
        if (cardInfo.likes.some(like => like._id === currentUserId)) {
          likeButton.classList.add('card__like-button_is-active');
        } else {
          likeButton.classList.remove('card__like-button_is-active');
        }
      })
      .catch(err => {
        console.log("Failed to toggle like:", err);
      });
  })
  .catch(err => {
    console.log("Failed to get user info:", err);
  });

  // Event listener for liking a card
  likeButton.addEventListener('click', () => {
    likeCallback(likeButton);
  });

  return cardElement;
}

// Function to remove a card
export function removeCard(cardElement) { 
  cardElement.remove();
}
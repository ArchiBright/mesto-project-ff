import { getUserInfo, deleteCard, toggleLike } from "./api";
import { openModal, closeModal } from "./modal";

// Function to create a card
export function createCard(cardData, deleteCallback, openImagePopup) {
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
                console.log("Failed to delete card:", err);
              });
          });
        });
      }

      // Check if the current user has liked the card and set the initial like state
      const userHasLiked = cardData.likes.some(like => like._id === currentUserId);
      likeCounter.textContent = cardData.likes.length;
      
      if (userHasLiked) {
        likeButton.classList.add('card__like-button_is-active');
      }

      // Event listener for toggling like state
      likeButton.addEventListener('click', () => {
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        
        toggleLike(cardData._id, isLiked)
          .then(cardInfo => {
            // Update like counter and like button state based on new data
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
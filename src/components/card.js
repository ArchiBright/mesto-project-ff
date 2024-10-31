import { toggleLike as apiToggleLike } from './api.js';

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
    .catch(err => console.log("Failed to toggle like:", err));
}

export function createCard(cardData, deleteCallback, openImagePopup, toggleLikeCallback, currentUserId) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const cardElement = template.querySelector('.card');
  const cardImage = template.querySelector('.card__image');
  const cardTitle = template.querySelector('.card__title');
  const deleteButton = template.querySelector('.card__delete-button');
  const likeButton = template.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name, cardData.name); 
  });

  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardData._id, cardElement);
    });
  }

  const userHasLiked = cardData.likes.some(like => like._id === currentUserId);
  likeCounter.textContent = cardData.likes.length;

  if (userHasLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    toggleLikeCallback(cardData, currentUserId, likeCounter, likeButton);
  });

  return cardElement;
}

export function removeCard(cardElement) { 
  cardElement.remove();
}
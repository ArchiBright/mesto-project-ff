// Function to open a modal window
export function openModal(modal) {
    modal.style.display = 'flex';
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupOnEsc);
  }
  
  // Function to close a modal window
  export function closeModal(modal) {
    modal.style.display = 'none';
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupOnEsc);
  }
  
  // Close modal by pressing "Escape"
  function closePopupOnEsc(event) {
    if (event.key === 'Escape') {
      const openPopup = document.querySelector('.popup[style="display: flex;"]');
      if (openPopup) {
        closeModal(openPopup);
      }
    }
  }
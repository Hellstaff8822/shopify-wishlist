document.addEventListener('DOMContentLoaded', () => {
  // ===== Кнопка "Нагору" =====
  const backToTopButton = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Ініціалізація вішліста =====
  const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
  const wishlistContainer = document.querySelector('#wishlist-items');
  const emptyWishlist = document.querySelector('#empty-wishlist');
  const wishlistIcon = document.querySelector('.header__icon--wishlist');
  const wishlistContent = document.querySelector('#wishlist-content');
  const wishlistTitle = document.querySelector('.wishlist-title');

  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // ===== Функції для роботи з вішлістом =====
  const saveWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  // ===== Функції для роботи з алертами =====
  const showCustomAlert = (message, type = 'add') => {
    const existingAlert = document.querySelector('#custom-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const customAlert = document.createElement('div');
    customAlert.id = 'custom-alert';
    customAlert.className = 'custom-alert';
    customAlert.setAttribute('data-type', type);

    const messageSpan = document.createElement('span');
    messageSpan.id = 'custom-alert-message';
    messageSpan.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.id = 'custom-alert-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      customAlert.remove();
    });

    customAlert.appendChild(messageSpan);
    customAlert.appendChild(closeButton);
    document.body.appendChild(customAlert);

    setTimeout(() => {
      customAlert.classList.add('active');
    }, 10);

    setTimeout(() => {
      customAlert.classList.remove('active');
      setTimeout(() => {
        customAlert.remove();
      }, 300);
    }, 3000);
  };

  // ===== Функції для оновлення UI вішліста =====
  const updateWishlistCount = () => {
    if (wishlistIcon) {
      wishlistIcon.style.setProperty(
        '--wishlist-count',
        `"${wishlist.length}"`
      );
      if (wishlist.length > 0) {
        wishlistIcon.classList.add('has-items');
      } else {
        wishlistIcon.classList.remove('has-items');
      }
    }
  };

  const renderWishlist = () => {
    if (wishlistContainer) {
      wishlistContainer.innerHTML = wishlist
        .map(
          (item) => `
        <div class="wishlist-item">
          <div class="product-info">
            <img src="${item.image}" alt="${item.title}">
            <div class="product-details">
              <h3><a href="/products/${item.handle}" class="product-title">${item.title}</a></h3>
              <span class="price">${item.price}</span>
            </div>
          </div>
          <button class="remove-btn" data-id="${item.id}">
            <img src="${window.deleteIconUrl}" alt="Remove">
          </button>
        </div>
      `
        )
        .join('');

      if (wishlist.length === 0) {
        wishlistContainer.style.display = 'none';
        emptyWishlist.style.display = 'block';
        if (wishlistTitle) wishlistTitle.classList.add('hidden');
      } else {
        wishlistContainer.style.display = 'block';
        emptyWishlist.style.display = 'none';
        if (wishlistTitle) wishlistTitle.classList.remove('hidden');
      }
      wishlistContent.style.display = 'block';
    }
    updateWishlistCount();
  };

  // ===== Обробники подій вішліста =====
  addToWishlistButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const product = {
        id: button.dataset.id,
        title: button.dataset.title,
        image: button.dataset.image,
        price: button.dataset.price,
        handle: button.dataset.handle,
      };
      if (!wishlist.some((item) => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist();
        showCustomAlert('Added to Wishlist!', 'add');
      } else {
        showCustomAlert('This product is already in your Wishlist!', 'add');
      }
      renderWishlist();
    });
  });

  if (wishlistContainer) {
    wishlistContainer.addEventListener('click', (e) => {
      const removeButton = e.target.closest('.remove-btn');
      if (removeButton) {
        const id = removeButton.dataset.id;
        const removedItem = wishlist.find((item) => item.id === id);
        wishlist = wishlist.filter((item) => item.id !== id);
        saveWishlist();
        renderWishlist();
        if (removedItem) {
          showCustomAlert(` Removed from Wishlist!`, 'remove');
        }
      }
    });
  }

  // ===== Початкове відображення вішліста =====
  renderWishlist();
});

// Init Scroll
const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1100,
  offset: 55
});

// Init Rellax
const rellax = new Rellax('.hero', {
  speed: -5,
  center: true,
  round: true,
  vertical: true,
  horizontal: false
});

// Fade Out
if (window.innerWidth > 992) {
  window.onscroll = () => {
    const elementsToFade = document.querySelectorAll('.fade-on-scroll');
    let height = window.innerHeight;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    height = height / 2.2;
    elementsToFade.forEach(elm => elm.style.opacity = (height - scrollTop) / height);
  };
}

// Create Contact Card
const overlay = document.querySelector('.overlay');
const products = document.querySelector('.products');

products.onclick = e => {
  if (e.target.classList.contains('product')) {
    const selectedProduct = e.target;
    // Product Data
    const productData = {
      id: selectedProduct.getAttribute('data-id'),
      name: selectedProduct.getAttribute('data-name'),
      price: selectedProduct.getAttribute('data-price'),
      desc: selectedProduct.getAttribute('data-desc'),
      img: selectedProduct.querySelector('img'),
      images: selectedProduct.getAttribute('data-images'),
      position: {
        x: selectedProduct.getBoundingClientRect().left,
        y: selectedProduct.getBoundingClientRect().top
      }
    };

    // Product Dimensions
    const dimensions = {
      height: productData.img.getBoundingClientRect().height,
      width: productData.img.getBoundingClientRect().width
    }

    // Create Contact Card
    const contactCard = document.createElement('div');
    contactCard.className = 'contact-card';
    contactCard.style = `
      position: fixed;
      height: ${dimensions.height}px;
      width: ${dimensions.width}px;
      left: ${productData.position.x}px;
      top: ${productData.position.y}px;
      transform: translate3d(0, 0, 0);
      z-index: 4;
      will-change: top, left, width;
    `;

    // Set Structure
    contactCard.innerHTML = `
      <div>
        <img class="contact-card__img" style="max-width: ${dimensions.width}px;" src="${productData.img.src}">
      </div>
      <div class="contact-card__info">
        <div class="contact-card__info--contact-us"><i class="fas fa-envelope"></i>&nbsp; ליצירת קשר</div>
        <div class="contact-card__logo">NOSH</div>
        <div class="contact-card__info--name"><span>שם השרשרת: </span> ${productData.name}</div>
        <div class="contact-card__info--price"><span>מחיר: </span> ₪${productData.price}</div>
        <div class="contact-card__info--desc">${productData.desc}</div>
      </div>
    `;

    // Append Contact Card
    document.body.appendChild(contactCard);

    // Set Contact Card Dimensions
    const newDimensions = {
      height: window.innerWidth > 768 ? dimensions.height : dimensions.height + 265,
      width: window.innerWidth > 768 ? dimensions.width + 370 : dimensions.width,
    }

    // Animate Contact Card
    window.requestAnimationFrame(() => {
      selectedProduct.style.opacity = '0';
      contactCard.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translate3d(0, 0, 0);
        width: ${newDimensions.width}px;
        height: ${newDimensions.height}px;
        z-index: 4;
        will-change: top, left, width;
      `;
      overlay.classList.add('show');
    });

    // Slide Show
    const images = JSON.parse(productData.images);
    const newImg = contactCard.querySelector('img');
    const hiddenImg = document.querySelector('.hidden');
    let timeoutInit;
    let timeoutNext;
    let currentImg = 0;
    function initSlideShow() {
      if (images.length > 1) {
        newImg.style.opacity = 1;
        newImg.src = images[currentImg % images.length];
        timeoutNext = setTimeout(next, 3000);
      }

      function next() {
        newImg.style.opacity = 0;
        currentImg++;
        hiddenImg.src = images[currentImg % images.length];
        timeoutInit = setTimeout(initSlideShow, 800);
      }
    };
    initSlideShow();

    function closeContactCard() {
      contactCard.style = `
        height: ${dimensions.height}px;
        width: ${dimensions.width}px;
        left: ${selectedProduct.getBoundingClientRect().left}px;
        top: ${selectedProduct.getBoundingClientRect().top}px;
        transform: translate(0, 0) translate3d(0, 0, 0);
        border-radius: 0;
        position: fixed;
        z-index: 4;
        will-change: top, left, width;
    `;
      overlay.classList.remove('show');

      setTimeout(() => requestAnimationFrame(() => {
        selectedProduct.style.opacity = '1';
        contactCard.remove();
        clearTimeout(timeoutNext);
        clearTimeout(timeoutInit);
      }), 1000);
    }

    const infoSection = contactCard.querySelector('.contact-card__info');
    const contactBtn = document.querySelector('.contact-card__info--contact-us');
    const contactFormStruct = `
      <div class="form-container">
        <div class="heading">
          <i class="far fa-gem fa-5x"></i>
          <h2>${productData.name}</h3>
        </div>
        <form name="newOrder">
          <div class="row">
            <input type="text" id="client" class="input" required name="client"/>
            <label class="text-label" for="client">שם מלא</label>
            <i class="fas fa-user icon"></i>
          </div>
          <div class="row">
            <input name="email" id="email" class="input" required>
            <label class="text-label" for="email"> כתובת דואר אלקטרוני</label>
            <i class="fas fa-envelope-open icon"></i>
          </div>
          <div class="row">
            <textarea id="body" class="input" name="body" required></textarea>
            <label class="text-label" for="body">יש לי שאלה...</label>
            <i class="fas fa-question-circle icon"></i>
          </div>
          
          <button class="submit" type="submit" formnovalidate>שליחה</button>
        </form>
      </div>
    `

    // Show Order Form
    contactBtn.onclick = () => {
      infoSection.innerHTML = contactFormStruct;

      // Handle Order Form Submit
      const orderForm = document.forms.newOrder;
      const submitBtn = orderForm.querySelector('.submit');
      orderForm.onsubmit = e => {
        e.preventDefault();
        const { client, email, body } = orderForm;
        if (!client.length || !email.length) {
          toast('err', 'לא ניתן לבצע הזמנה ללא שם מלא וכתובת דואר אלקטרוני');
        } else {
          submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin loading"></i>&nbsp שולח...';
          submitBtn.setAttribute('disabled', 'disabled');
          fetch('/orders', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ productId: productData.id, client, email, body })
          })
          .then(res => res.json())
          .then(data => {
            if (data === 200) {
              closeContactCard();
              toast('success', 'פנייתך נרשמה בהצלחה');
            } else {
              submitBtn.innerHTML = 'שליחה';
              submitBtn.removeAttribute('disabled');
              toast('err', data);
            }
          });
        }
      }
    }

    // Close Contact Card
    overlay.onclick = e => {
      e.stopPropagation();
      closeContactCard();
    }
  }
}
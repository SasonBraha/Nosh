const view = document.querySelector('.view');
const products = document.querySelector('#products');
const orders = document.querySelector('#orders');
const users = document.querySelector('#users');
const modal = document.querySelector('.modal');
const alert = document.querySelector('.alert');

// Set Moment To Hebrew
moment.locale('he');

// Truncate String For Product Description
const truncate = (str, len) => {
  return str.length > len ? `${str.substr(0, len)}...` : str;
}

// Router
const Router = () => {
  switch (window.location.pathname) {
    case '/manage/allProducts':
      fetchProducts();
      document.title = 'ניהול מוצרים';
      break;

    case '/manage/allOrders':
      fetchOrders('ההזמנה בטיפול');
      document.title = 'ניהול הזמנות';
      break;

    case '/manage/allUsers':
      fetchUsers();
      document.title = 'ניהול משתמשים';
      break;
  }
}

// Display Content
Router();

// Close Lightbox
const lightbox = document.querySelector(".lightbox");
const lightBoxImg = document.querySelector("img.lightbox-img");
const closeBtn = document.querySelector(".close-btn");
closeBtn.onclick = () => {
  lightbox.style.transform = "translateY(-30%)";
  setTimeout(() => lightbox.style.transform = "translateY(100%)", 250);
}

// Settings
config.onclick = () => {
  fetch('/manage/config', {
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(config => {
      const configStruct = `
        <div class="close"><i class="fas fa-times"></i></div>
        <div class="form-container">
          <div class="heading">
            <i class="fas fa-cog fa-5x"></i>
            <h3>הגדרות</h3>
          </div>
          <form name="config">
            <div class="row">
              <input value="${config.sendEmailTo}" type="text" id="sendEmailTo" name="sendEmailTo" required/>
              <label class="text-label" for="sendEmailTo">מייל לעדכון על הזמנות חדשות</label>
              <i class="fas fa-envelope-open icon"></i>
            </div>
            <div class="row">
              <input value="${config.logoText}" type="text" id="logoText" name="logoText" required/>
              <label class="text-label" for="logoText">כיתוב הלוגו</label>
              <i class="fab fa-google icon"></i>
            </div>
            <div class="row">
              <input value="${config.indexHeader}" name="indexHeader" id="indexHeader" required>
              <label class="text-label" for="indexHeader">כותרת ראשית</label>
              <i class="fas fa-heading icon"></i>
            </div>
            <div class="row">
              <textarea id="indexDesc" name="indexDesc" required>${config.indexDesc}</textarea>
              <label class="text-label" for="indexDesc">כותרת משנית</label>
              <i class="fas fa-align-right icon"></i>
            </div>
            
            <button type="submit" class="submit">עדכון</button>
          </form>
        </div>
      `
      alert.innerHTML = configStruct;
      modal.classList.add('show');

      const closeModalBtn = document.querySelector('.close');
      closeModalBtn.onclick = () => {
        modal.classList.remove('show')
      };

      // Handle Config Form Submit
      const configForm = document.forms.config;
      const submitBtn = configForm.querySelector('.submit');
      const sendEmailTo = configForm.querySelector('#sendEmailTo');
      const logoText = configForm.querySelector('#logoText');
      const indexHeader = configForm.querySelector('#indexHeader');
      const indexDesc = configForm.querySelector('#indexDesc');

      configForm.onsubmit = (e) => {
        e.preventDefault();
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin loading"></i>&nbsp מעדכן...';
        submitBtn.setAttribute('disabled', 'disabled');
        fetch('/manage/config', {
          method: 'post',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            sendEmailTo: sendEmailTo.value.trim(),
            logoText: logoText.value.trim(),
            indexHeader: indexHeader.value.trim(),
            indexDesc: indexDesc.value.trim()
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data !== 200) {
            toast('err', 'data');
            submitBtn.innerHTML = 'עדכון';
            submitBtn.removeAttribute('disabled');
          } else {
            toast('success', 'השינויים עודכנו בהצלחה');
            modal.classList.remove('show');
          }
        });
      }
    });
}

function fetchProducts() {
  let productsViewHeader = `
    <div class="view__header">
      <div class="view__current">ניהול מוצרים</div>
      <div class="view__action">
        <button id="add-product"><i class="fas fa-plus-circle"></i> הוספת מוצר חדש</button>
      </div>
    </div>
    <div class="loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
      </svg>
    </div>
  `

  // Show Header
  view.innerHTML = productsViewHeader;

  fetch('/manage/products', {
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(data => {
      let productTableStrcut = `
        <table class="view__table">
          <thead>
            <tr>
              <th><i class="far fa-gem"></i>&nbsp; שם המוצר</th>
              <th><i class="far fa-image"></i>&nbsp; תמונה</th>
              <th><i class="fas fa-shekel-sign"></i>&nbsp; מחיר</th>
              <th><i class="far fa-calendar-alt"></i>&nbsp; נוסף בתאריך</th>
              <th><i class="fas fa-file-alt"></i>&nbsp; תיאור</th>
              <th><i class="fas fa-trash"></i>&nbsp; מחיקה</th>
            </tr>
          </thead>

          <tbody id="list">
            ${
              data.map(product => {
                return (`
                  <tr class="product-row" data-images=${product.images}>
                    <td>${product.name}</td>
                    <td><img class="td-img" src="${product.images[0]}"></td>
                    <td>₪${product.price}</td>
                    <td>${moment(product.createdAt).calendar()}</td>
                    <td class="desc" title="${product.desc}">${truncate(product.desc, 15)}</td>
                    <td><button data-id="${product._id}" class="delete del-pro"><i class="fas ico fa-trash icon"></i> הסרה</button></td>
                  </tr>
                `)
            }).join('')
          }
          </tbody>
        </table>
      `
      // Show Struct
      view.innerHTML += productTableStrcut;

      // Remove Loader
      const loader = document.querySelector('.loader');
      loader.remove();

      // Init Product Description Tooltip
      tippy(document.querySelectorAll('.desc'), {
        followCursor: true,
        arrow: true
      });

      // Open Add Product Modal @Onclick
      const addProductBtn = document.querySelector('#add-product');
      addProductBtn.onclick = () => {
        // Set Modal To Add Product Form
        alert.innerHTML = `
          <div class="close"><i class="fas fa-times"></i></div>
          <div class="form-container">
            <div class="heading">
              <i class="far fa-gem fa-5x"></i>
              <h3>הוספת מוצר חדש</h3>
            </div>

            <form name="addProduct" enctype="multipart/form-data">
              <div class="row">
                <input type="text" id="name" required name="name"/>
                <label class="text-label" for="name">שם המוצר</label>
                <i class="far fa-gem icon"></i>
              </div>
              <div class="row">
                <input type="file" id="img" name="img" accept="image/*" multiple required/>
                <label class="file-label" for="img"><i class="fas fa-image"></i> תמונות</label>
                <div class="preview"></div>
              </div>
              <div class="row">
                <input type="text" id="price" name="price" required/>
                <label class="text-label" for="price">מחיר המוצר</label>
                <i class="fas fa-shekel-sign icon"></i>
              </div>
              <div class="row">
                <textarea name="desc" id="desc" required></textarea>
                <label class="text-label" for="desc">תיאור</label>
                <i class="fas fa-info-circle icon"></i>
              </div>
              <button class="submit" type="submit">הוספה</button>
            </form>
          </div>
        `;
        modal.classList.add('show');

        // Show Image Preview
        const fileInput = document.querySelector('#img');
        const preview = document.querySelector('.preview');

        fileInput.onchange = e => {
          preview.innerHTML = '';
          const imagesToPreview = Array.from(e.target.files);
          if (imagesToPreview) {
            imagesToPreview.forEach(image => {
              const imageEl = document.createElement('img');
              imageEl.height = 100;
              imageEl.src = URL.createObjectURL(image);
              preview.appendChild(imageEl);
            });
          }
        }

        // Hnadle Add Product @Submit
        const productForm = document.forms.addProduct;
        const submitBtn = document.querySelector('.submit');
        productForm.onsubmit = (e) => {
          submitBtn.innerHTML = '<i class="fas fa-cog fa-spin loading"></i>&nbsp מוסיף...';
          submitBtn.setAttribute('disabled', 'disabled');
          e.preventDefault();
          fetch('/manage/products', {
            method: 'post',
            credentials: 'same-origin',
            body: new FormData(productForm)
          })
          .then(res => res.json())
          .then(data => {
            if (data.status !== 200) {
              toast('err', 'הייתה בעיה בהוספת המוצר, אנא נסי שנית');
              submitBtn.innerHTML = 'הוספה';
              submitBtn.removeAttribute('disabled');
            } else {
              modal.classList.remove('show');
              productForm.reset();
              preview.innerHTML = '';
              toast('success', 'המוצר נוסף בהצלחה');
              fetchProducts();
            }
          });
        }

        // Close Modal
        const closeModalBtn = document.querySelector('.close');
        closeModalBtn.onclick = () => {
          modal.classList.remove('show')
          productForm.reset();
          preview.innerHTML = '';
        };
      }

      const table = document.querySelector('tbody');
      table.onclick = (e) => {
        if (e.target.classList.contains('delete')) {
          // Confirm Delete
          swal({
            title: "את בטוחה שברצונך להסיר מוצר זה?",
            text: "לא יהיה ניתן לשחזר מוצר זה לאחר המחיקה",
            icon: "warning",
            buttons: {
              cancel: 'ביטול',
              confirm: 'מחיקה'
            },
            dangerMode: true
          })
            .then(willDelete => {
              if (willDelete) {
                fetch('/manage/prodcuts', {
                  method: 'delete',
                  credentials: 'same-origin',
                  headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify({ id: e.target.getAttribute('data-id') })
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data == 200) {
                      e.target.closest('tr').remove();
                      swal("המוצר הוסר בהצלחה", {
                        icon: "success",
                        button: false
                      });
                    } else {
                      toast('err', data)
                    }
                  });
              }
            });
        }

        // LightBox
        if (e.target.classList.contains('td-img')) {
          lightBoxImg.src = e.target.src;
          lightbox.style.transform = "translateY(0%)";
        }
      }
    });
}

function fetchOrders(by) {
  let ordersHeader = `
    <div class="view__header">
      <div class="view__current">ניהול הזמנות</div>
      <div class="view__search">
        <div class="view__search-container">
          <input type="text" name="search" id="search" placeholder="חיפוש..."/>
          <i class="fas fa-search icon"></i>
        </div>
        <select id="view__search-option">
          <option selected disabled>שדה לחיפוש</option>
          <option value="name">מאת</option>
          <option value="email">דואר אלקטרוני</option>
          <option value="ip">כתובת IP</option>
        </select>
      </div>
      <div class="view__action">
        <button class="sort" data-sort="ההזמנה בטיפול"><i class="fas fa-tasks"></i> הזמנות בטיפול</button>
        <button class="sort" data-sort="ההזמנה טופלה"><i class="far fa-check-circle"></i> הזמנות שטופלו</button>
        <button class="sort" data-sort="ההזמנה בוטלה"><i class="fas fa-ban"></i> הזמנות שבוטלו</button>
      </div>
    </div>
    <div class="loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
      </svg>
    </div>
  `
  view.innerHTML = ordersHeader;

  fetch(`/manage/orders/${by}`, {
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(data => {
      let requestTableStrcut = `
        <table class="view__table">
          <thead>
            <tr>
              <th><i class="fas fa-user"></i>&nbsp; מאת</th>
              <th><i class="far fa-envelope-open"></i>&nbsp; דואר אלקטרוני</th>
              <th><i class="fas fa-desktop"></i> כתובת IP</th>
              <th><i class="fas fa-info-circle"></i>&nbsp; בנוגע למוצר</th>
              <th><i class="fas fa-comment-alt"></i>&nbsp; תוכן ההודעה</th>
              <th><i class="far fa-calendar-alt"></i>&nbsp; התקבלה בתאריך</th>
              <th><i class="far fa-check-circle"></i>&nbsp; קיים במלאי הנוכחי</th>
              <th><i class="far fa-question-circle"></i> סטטוס</th>
              <th><i class="fas fa-cog"></i>&nbsp; שינוי סטטוס</th>
            </tr>
          </thead>

          <tbody>
            ${
            data.map(order => {
              let available = !order.productRef ? false : true;
              return (`
                <tr class="order-row">
                  <td class="name">${order.from}</td>
                  <td class="email">${order.email}</td>
                  <td class="ip">${order.fromIP}</td>
                  <td class="product-info" 
                  title='
                    <div class="tippy-product-info">
                      <img style="max-width: 100%" src="${order.forProduct.img}">
                    </div>
                  '>
                  ${order.forProduct.name}
                  </td>
                  <td class="order-body" title="${order.body}">${order.body.length ? truncate(order.body, 10) : 'ללא'}</td>
                  <td>${moment(order.createdAt).calendar()}</td>
                  <td class="${!available ? 'not-available' : 'available'}">${!available ? '<i class="fas fa-times-circle"></i>' : '<i class="fas fa-check-circle"></i>'}</td>
                  <td>${order.status}</td>
                  <td>
                    <select data-id="${order._id}" class="status">
                      <option selected disabled>שינוי סטטוס</option>
                      <option value="ההזמנה בטיפול">ההזמנה בטיפול</option>
                      <option value="ההזמנה טופלה">ההזמנה טופלה</option>
                      <option value="ההזמנה בוטלה">ההזמנה בוטלה</option>
                    </select>
                  </td>
                </tr>
              `)
            }).join('')
          } 
            </tbody>
          </table>
        `
      // Show Struct
      view.innerHTML += requestTableStrcut;

      // Remove Loader
      const loader = document.querySelector('.loader');
      loader.remove();

      // Init Product Info Tooltip
      tippy(document.querySelectorAll('.product-info'), {
        allowTitleHTML: true,
        followCursor: true,
        arrow: true
      });

      // Init Order Body Tooltip
      tippy(document.querySelectorAll('.order-body'), {
        followCursor: true,
        arrow: true
      });

      // Handle Order Status Change
      const orderStatus = document.querySelectorAll('.status');
      const orderRow = document.querySelectorAll('.order-row');
      orderStatus.forEach((order, i) => {
        order.onchange = () => {
          fetch('/manage/orders', {
            method: 'put',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ id: order.getAttribute('data-id'), status: order.value.trim() })
          })
            .then(res => res.json())
            .then(data => {
              if (data !== 200) return toast('err', 'הייתה בעיה בעדכון הסטטוס, אנא נסי שנית');
              orderRow[i].remove();
              toast('success', 'הסטטוס שונה בהצלחה');
            })
        }
      });

      // Handle Search
      const searchInput = document.querySelector('#search');
      const searchOption = document.querySelector('#view__search-option');
      const name = document.querySelectorAll('.order-row .name');
      const email = document.querySelectorAll('.order-row .email');
      const ip = document.querySelectorAll('.order-row .ip');

      const fields = {
        name: name,
        email: email,
        ip: ip
      };

      searchInput.onkeyup = (e) => {
        const value = e.target.value.trim();
        if (value.length && searchOption.value === 'שדה לחיפוש') return toast('err', 'אנא בחרי שדה לחיפוש');
        fields[searchOption.value].forEach((field, i) => {
          orderRow[i].style.display = field.innerText.includes(value) ? '' : 'none';
        });
      }


      // Handle Orders Sort
      const sort = document.querySelectorAll('.sort');
      sort.forEach(btn => {
        btn.onclick = () => fetchOrders(btn.getAttribute('data-sort'));
      });
    });
}

// Fetch Users
function fetchUsers() {
  const usersHeaderStruct = `
    <div class="view__header">
      <div class="view__current">ניהול משתמשים</div>
      <div class="view__action">
        <button id="add-user"><i class="fas fa-user-plus"></i> הוספת משתמש חדש</button>
      </div>
    </div>
    <div class="loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
      </svg>
    </div>
  `;

  // Show Header
  view.innerHTML = usersHeaderStruct;

  // Fetch Users
  fetch('/manage/users', {
    credentials: 'same-origin'
  })
    .then(res => res.json())
    .then(data => {
      let usersTableStruct = `
        <table class="view__table">
          <thead>
            <tr>
              <th><i class="fas fa-user"></i>&nbsp; שם משתמש</th>
              <th><i class="far fa-image"></i>&nbsp; תמונת פרופיל</th>
              <th><i class="fas fa-envelope-open"></i>&nbsp; דואר אלקטרוני</th>
              <th><i class="fas fa-trash"></i>&nbsp; מחיקה</th>
            </tr>
          </thead>
          
          <tbody id="list">
            ${
              data.map(user => ( 
                `
                  <tr class="product-row">
                    <td>${user.username}</td>
                    <td><img class="td-img" src="${user.avatar}"/></td>
                    <td>${user.email}</td>
                    <td><button data-id="${user._id}" class="delete"><i class="fas fa-trash icon"></i> הסרה</button></td>
                  </tr>
                `
            )).join('')
          }
          </tbody>
        </table>
      `;

      // Show Struct
      view.innerHTML += usersTableStruct;

      // Remove Loader
      const loader = document.querySelector('.loader');
      loader.remove();

      // Open Add User Modal
      const addUserBtn = document.querySelector('#add-user');
      addUserBtn.onclick = () => {
        // Set Modal To Add User Form
        alert.innerHTML = `
          <div class="close"><i class="fas fa-times"></i></div>
          <div class="form-container">
            <div class="heading">
              <i class="fas fa-user-plus fa-5x"></i>
              <h3>הוספת משתמש חדש</h3>
            </div>

            <form name="addUser" enctype="multipart/form-data">
              <div class="row">
                <input type="text" id="username" required name="username"/>
                <label class="text-label" for="username">שם משתמש</label>
                <i class="fas fa-user icon"></i>
              </div>
              <div class="row">
                <input type="file" id="avatar" name="img" required/>
                <label class="file-label" for="avatar"><i class="fas fa-image"></i> תמונת פרופיל</label>
                <img class="preview" />
              </div>
              <div class="row">
                <input name="email" id="email" required>
                <label class="text-label" for="email"> כתובת דואר אלקטרוני</label>
                <i class="fas fa-envelope-open icon"></i>
              </div>
              <div class="row">
                <input type="password" id="password" name="password" autocomplete="new-password" required/>
                <label class="text-label" for="password">סיסמה</label>
                <i class="fas fa-lock icon"></i>
              </div>
              
              <button class="submit" type="submit">הוספה</button>
            </form>
          </div>
        `;
        modal.classList.add('show');

        // Show Image Preview
        const preview = document.querySelector('.preview');
        const fileInput = document.querySelector('#avatar');
        fileInput.onchange = function () {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
          }
          reader.readAsDataURL(this.files[0]);
        }

        // Handle Add User Form Submit
        const userForm = document.forms.addUser;
        const submitBtn = userForm.querySelector('.submit');
        userForm.onsubmit = (e) => {
          submitBtn.innerHTML = '<i class="fas fa-cog fa-spin loading"></i>&nbsp מוסיף...';
          submitBtn.setAttribute('disabled', 'disabled');
          e.preventDefault();
          fetch('/manage/users', {
            method: 'post',
            credentials: 'same-origin',
            body: new FormData(userForm)
          })
          .then(res => res.json())
          .then(data => {
            if (data.status !== 200) {
              toast('err', data);
              submitBtn.innerHTML = 'הוספה';
              submitBtn.removeAttribute('disabled');
            } else {
              modal.classList.remove('show');
              userForm.reset();
              preview.src = '';
              toast('success', 'המשתמש נוסף בהצלחה');
              fetchUsers();
            }
          });
        }

        // Close Modal
        const closeModalBtn = document.querySelector('.close');
        closeModalBtn.onclick = () => {
          modal.classList.remove('show')
          userForm.reset();
          preview.src = '';
        };
      }

      const table = document.querySelector('tbody');
      table.onclick = (e) => {
        if (e.target.classList.contains('delete')) {
          // Confirm Delete
          swal({
            title: "את בטוחה שברצונך למחוק משתמש זה?",
            text: "לא יהיה ניתן לשחזר משתמש זה לאחר המחיקה",
            icon: "warning",
            buttons: {
              cancel: 'ביטול',
              confirm: 'מחיקה'
            },
            dangerMode: true
          })
          .then(willDelete => {
            if (willDelete) {
              fetch('/manage/users', {
                method: 'delete',
                credentials: 'same-origin',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({ id: e.target.getAttribute('data-id') })
              })
              .then(res => res.json())
              .then(data => {
                if (data == 200) {
                  e.target.closest('tr').remove();
                  swal("המשתמש הוסר בהצלחה", {
                    icon: "success",
                    button: false
                  });
                } else {
                  toast('err', data);
                }
              });
            }
          });
        }
        // LightBox
        if (e.target.classList.contains('td-img')) {
          lightBoxImg.src = e.target.src;
          lightbox.style.transform = "translateY(0%)";
        }
      }
    });
}

// Fetch All Products
products.onclick = () => {
  history.replaceState({}, '', '/manage/allProducts');
  Router();
}

// Fetch All Orders
orders.onclick = () => {
  history.replaceState({}, '', '/manage/allOrders');
  Router();
}

// Fetch All Users
users.onclick = () => {
  history.replaceState({}, '', '/manage/allUsers');
  Router();
}
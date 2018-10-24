const view=document.querySelector(".view"),products=document.querySelector("#products"),orders=document.querySelector("#orders"),users=document.querySelector("#users"),modal=document.querySelector(".modal"),alert=document.querySelector(".alert");moment.locale("he");// Truncate String For Product Description
const truncate=(a,b)=>a.length>b?`${a.substr(0,b)}...`:a,Router=()=>{switch(window.location.pathname){case"/manage/allProducts":fetchProducts(),document.title="\u05E0\u05D9\u05D4\u05D5\u05DC \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD";break;case"/manage/allOrders":fetchOrders("\u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D1\u05D8\u05D9\u05E4\u05D5\u05DC"),document.title="\u05E0\u05D9\u05D4\u05D5\u05DC \u05D4\u05D6\u05DE\u05E0\u05D5\u05EA";break;case"/manage/allUsers":fetchUsers(),document.title="\u05E0\u05D9\u05D4\u05D5\u05DC \u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD";}};// Router
Router();// Close Lightbox
const lightbox=document.querySelector(".lightbox"),lightBoxImg=document.querySelector("img.lightbox-img"),closeBtn=document.querySelector(".close-btn");closeBtn.onclick=()=>{lightbox.style.transform="translateY(-30%)",setTimeout(()=>lightbox.style.transform="translateY(100%)",250)},config.onclick=()=>{fetch("/manage/config",{credentials:"same-origin"}).then(a=>a.json()).then(a=>{const b=`
        <div class="close"><i class="fas fa-times"></i></div>
        <div class="form-container">
          <div class="heading">
            <i class="fas fa-cog fa-5x"></i>
            <h3>הגדרות</h3>
          </div>
          <form name="config">
            <div class="row">
              <input value="${a.sendEmailTo}" type="text" id="sendEmailTo" name="sendEmailTo" required/>
              <label class="text-label" for="sendEmailTo">מייל לעדכון על הזמנות חדשות</label>
              <i class="fas fa-envelope-open icon"></i>
            </div>
            <div class="row">
              <input value="${a.logoText}" type="text" id="logoText" name="logoText" required/>
              <label class="text-label" for="logoText">כיתוב הלוגו</label>
              <i class="fab fa-google icon"></i>
            </div>
            <div class="row">
              <input value="${a.indexHeader}" name="indexHeader" id="indexHeader" required>
              <label class="text-label" for="indexHeader">כותרת ראשית</label>
              <i class="fas fa-heading icon"></i>
            </div>
            <div class="row">
              <textarea id="indexDesc" name="indexDesc" required>${a.indexDesc}</textarea>
              <label class="text-label" for="indexDesc">כותרת משנית</label>
              <i class="fas fa-align-right icon"></i>
            </div>
            
            <button type="submit" class="submit">עדכון</button>
          </form>
        </div>
      `;alert.innerHTML=b,modal.classList.add("show");const c=document.querySelector(".close");c.onclick=()=>{modal.classList.remove("show")};// Handle Config Form Submit
const d=document.forms.config,f=d.querySelector(".submit"),g=d.querySelector("#sendEmailTo"),h=d.querySelector("#logoText"),i=d.querySelector("#indexHeader"),j=d.querySelector("#indexDesc");d.onsubmit=a=>{a.preventDefault(),f.innerHTML="<i class=\"fas fa-circle-notch fa-spin loading\"></i>&nbsp \u05DE\u05E2\u05D3\u05DB\u05DF...",f.setAttribute("disabled","disabled"),fetch("/manage/config",{method:"post",credentials:"same-origin",headers:{Accept:"application/json, text/plain, */*","Content-type":"application/json"},body:JSON.stringify({sendEmailTo:g.value.trim(),logoText:h.value.trim(),indexHeader:i.value.trim(),indexDesc:j.value.trim()})}).then(a=>a.json()).then(a=>{200===a?(toast("success","\u05D4\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05E2\u05D5\u05D3\u05DB\u05E0\u05D5 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4"),modal.classList.remove("show")):(toast("err","data"),f.innerHTML="\u05E2\u05D3\u05DB\u05D5\u05DF",f.removeAttribute("disabled"))})}})};function fetchProducts(){// Show Header
view.innerHTML="\n    <div class=\"view__header\">\n      <div class=\"view__current\">\u05E0\u05D9\u05D4\u05D5\u05DC \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD</div>\n      <div class=\"view__action\">\n        <button id=\"add-product\"><i class=\"fas fa-plus-circle\"></i> \u05D4\u05D5\u05E1\u05E4\u05EA \u05DE\u05D5\u05E6\u05E8 \u05D7\u05D3\u05E9</button>\n      </div>\n    </div>\n    <div class=\"loader\">\n      <svg class=\"circular\" viewBox=\"25 25 50 50\">\n        <circle class=\"path\" cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" stroke-width=\"4\" stroke-miterlimit=\"10\"/>\n      </svg>\n    </div>\n  ",fetch("/manage/products",{credentials:"same-origin"}).then(a=>a.json()).then(a=>{let b=`
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
            ${a.map(a=>`
                  <tr class="product-row" data-images=${a.images}>
                    <td>${a.name}</td>
                    <td><img class="td-img" src="${a.images[0]}"></td>
                    <td>₪${a.price}</td>
                    <td>${moment(a.createdAt).calendar()}</td>
                    <td class="desc" title="${a.desc}">${truncate(a.desc,15)}</td>
                    <td><button data-id="${a._id}" class="delete del-pro"><i class="fas ico fa-trash icon"></i> הסרה</button></td>
                  </tr>
                `).join("")}
          </tbody>
        </table>
      `;// Show Struct
view.innerHTML+=b;// Remove Loader
const c=document.querySelector(".loader");c.remove(),tippy(document.querySelectorAll(".desc"),{followCursor:!0,arrow:!0});// Open Add Product Modal @Onclick
const d=document.querySelector("#add-product");d.onclick=()=>{alert.innerHTML=`
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
        `,modal.classList.add("show");// Show Image Preview
const a=document.querySelector("#img"),b=document.querySelector(".preview");a.onchange=a=>{b.innerHTML="";const c=Array.from(a.target.files);c&&c.forEach(a=>{const c=document.createElement("img");c.height=100,c.src=URL.createObjectURL(a),b.appendChild(c)})};// Hnadle Add Product @Submit
const c=document.forms.addProduct,d=document.querySelector(".submit");c.onsubmit=a=>{d.innerHTML="<i class=\"fas fa-cog fa-spin loading\"></i>&nbsp \u05DE\u05D5\u05E1\u05D9\u05E3...",d.setAttribute("disabled","disabled"),a.preventDefault(),fetch("/manage/products",{method:"post",credentials:"same-origin",body:new FormData(c)}).then(a=>a.json()).then(a=>{200===a.status?(modal.classList.remove("show"),c.reset(),b.innerHTML="",toast("success","\u05D4\u05DE\u05D5\u05E6\u05E8 \u05E0\u05D5\u05E1\u05E3 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4"),fetchProducts()):(toast("err","\u05D4\u05D9\u05D9\u05EA\u05D4 \u05D1\u05E2\u05D9\u05D4 \u05D1\u05D4\u05D5\u05E1\u05E4\u05EA \u05D4\u05DE\u05D5\u05E6\u05E8, \u05D0\u05E0\u05D0 \u05E0\u05E1\u05D9 \u05E9\u05E0\u05D9\u05EA"),d.innerHTML="\u05D4\u05D5\u05E1\u05E4\u05D4",d.removeAttribute("disabled"))})};// Close Modal
const e=document.querySelector(".close");e.onclick=()=>{modal.classList.remove("show"),c.reset(),b.innerHTML=""}};const e=document.querySelector("tbody");e.onclick=a=>{a.target.classList.contains("delete")&&swal({title:"\u05D0\u05EA \u05D1\u05D8\u05D5\u05D7\u05D4 \u05E9\u05D1\u05E8\u05E6\u05D5\u05E0\u05DA \u05DC\u05D4\u05E1\u05D9\u05E8 \u05DE\u05D5\u05E6\u05E8 \u05D6\u05D4?",text:"\u05DC\u05D0 \u05D9\u05D4\u05D9\u05D4 \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05D7\u05D6\u05E8 \u05DE\u05D5\u05E6\u05E8 \u05D6\u05D4 \u05DC\u05D0\u05D7\u05E8 \u05D4\u05DE\u05D7\u05D9\u05E7\u05D4",icon:"warning",buttons:{cancel:"\u05D1\u05D9\u05D8\u05D5\u05DC",confirm:"\u05DE\u05D7\u05D9\u05E7\u05D4"},dangerMode:!0}).then(b=>{b&&fetch("/manage/prodcuts",{method:"delete",credentials:"same-origin",headers:{Accept:"application/json, text/plain, */*","Content-type":"application/json"},body:JSON.stringify({id:a.target.getAttribute("data-id")})}).then(a=>a.json()).then(b=>{200==b?(a.target.closest("tr").remove(),swal("\u05D4\u05DE\u05D5\u05E6\u05E8 \u05D4\u05D5\u05E1\u05E8 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4",{icon:"success",button:!1})):toast("err",b)})}),a.target.classList.contains("td-img")&&(lightBoxImg.src=a.target.src,lightbox.style.transform="translateY(0%)")}})}function fetchOrders(a){view.innerHTML="\n    <div class=\"view__header\">\n      <div class=\"view__current\">\u05E0\u05D9\u05D4\u05D5\u05DC \u05D4\u05D6\u05DE\u05E0\u05D5\u05EA</div>\n      <div class=\"view__search\">\n        <div class=\"view__search-container\">\n          <input type=\"text\" name=\"search\" id=\"search\" placeholder=\"\u05D7\u05D9\u05E4\u05D5\u05E9...\"/>\n          <i class=\"fas fa-search icon\"></i>\n        </div>\n        <select id=\"view__search-option\">\n          <option selected disabled>\u05E9\u05D3\u05D4 \u05DC\u05D7\u05D9\u05E4\u05D5\u05E9</option>\n          <option value=\"name\">\u05DE\u05D0\u05EA</option>\n          <option value=\"email\">\u05D3\u05D5\u05D0\u05E8 \u05D0\u05DC\u05E7\u05D8\u05E8\u05D5\u05E0\u05D9</option>\n          <option value=\"ip\">\u05DB\u05EA\u05D5\u05D1\u05EA IP</option>\n        </select>\n      </div>\n      <div class=\"view__action\">\n        <button class=\"sort\" data-sort=\"\u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D1\u05D8\u05D9\u05E4\u05D5\u05DC\"><i class=\"fas fa-tasks\"></i> \u05D4\u05D6\u05DE\u05E0\u05D5\u05EA \u05D1\u05D8\u05D9\u05E4\u05D5\u05DC</button>\n        <button class=\"sort\" data-sort=\"\u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D8\u05D5\u05E4\u05DC\u05D4\"><i class=\"far fa-check-circle\"></i> \u05D4\u05D6\u05DE\u05E0\u05D5\u05EA \u05E9\u05D8\u05D5\u05E4\u05DC\u05D5</button>\n        <button class=\"sort\" data-sort=\"\u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05D1\u05D5\u05D8\u05DC\u05D4\"><i class=\"fas fa-ban\"></i> \u05D4\u05D6\u05DE\u05E0\u05D5\u05EA \u05E9\u05D1\u05D5\u05D8\u05DC\u05D5</button>\n      </div>\n    </div>\n    <div class=\"loader\">\n      <svg class=\"circular\" viewBox=\"25 25 50 50\">\n        <circle class=\"path\" cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" stroke-width=\"4\" stroke-miterlimit=\"10\"/>\n      </svg>\n    </div>\n  ",fetch(`/manage/orders/${a}`,{credentials:"same-origin"}).then(a=>a.json()).then(a=>{let b=`
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
            ${a.map(a=>{let b=!!a.productRef;return`
                <tr class="order-row">
                  <td class="name">${a.from}</td>
                  <td class="email">${a.email}</td>
                  <td class="ip">${a.fromIP}</td>
                  <td class="product-info" 
                  title='
                    <div class="tippy-product-info">
                      <img style="max-width: 100%" src="${a.forProduct.img}">
                    </div>
                  '>
                  ${a.forProduct.name}
                  </td>
                  <td class="order-body" title="${a.body}">${a.body.length?truncate(a.body,10):"\u05DC\u05DC\u05D0"}</td>
                  <td>${moment(a.createdAt).calendar()}</td>
                  <td class="${b?"available":"not-available"}">${b?"<i class=\"fas fa-check-circle\"></i>":"<i class=\"fas fa-times-circle\"></i>"}</td>
                  <td>${a.status}</td>
                  <td>
                    <select data-id="${a._id}" class="status">
                      <option selected disabled>שינוי סטטוס</option>
                      <option value="ההזמנה בטיפול">ההזמנה בטיפול</option>
                      <option value="ההזמנה טופלה">ההזמנה טופלה</option>
                      <option value="ההזמנה בוטלה">ההזמנה בוטלה</option>
                    </select>
                  </td>
                </tr>
              `}).join("")} 
            </tbody>
          </table>
        `;// Show Struct
view.innerHTML+=b;// Remove Loader
const c=document.querySelector(".loader");c.remove(),tippy(document.querySelectorAll(".product-info"),{allowTitleHTML:!0,followCursor:!0,arrow:!0}),tippy(document.querySelectorAll(".order-body"),{followCursor:!0,arrow:!0});// Handle Order Status Change
const d=document.querySelectorAll(".status"),e=document.querySelectorAll(".order-row");d.forEach((a,b)=>{a.onchange=()=>{fetch("/manage/orders",{method:"put",credentials:"same-origin",headers:{Accept:"application/json, text/plain, */*","Content-type":"application/json"},body:JSON.stringify({id:a.getAttribute("data-id"),status:a.value.trim()})}).then(a=>a.json()).then(a=>200===a?void(e[b].remove(),toast("success","\u05D4\u05E1\u05D8\u05D8\u05D5\u05E1 \u05E9\u05D5\u05E0\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4")):toast("err","\u05D4\u05D9\u05D9\u05EA\u05D4 \u05D1\u05E2\u05D9\u05D4 \u05D1\u05E2\u05D3\u05DB\u05D5\u05DF \u05D4\u05E1\u05D8\u05D8\u05D5\u05E1, \u05D0\u05E0\u05D0 \u05E0\u05E1\u05D9 \u05E9\u05E0\u05D9\u05EA"))}});// Handle Search
const f=document.querySelector("#search"),g=document.querySelector("#view__search-option"),h=document.querySelectorAll(".order-row .name"),i=document.querySelectorAll(".order-row .email"),j=document.querySelectorAll(".order-row .ip"),k={name:h,email:i,ip:j};f.onkeyup=a=>{const b=a.target.value.trim();return b.length&&"\u05E9\u05D3\u05D4 \u05DC\u05D7\u05D9\u05E4\u05D5\u05E9"===g.value?toast("err","\u05D0\u05E0\u05D0 \u05D1\u05D7\u05E8\u05D9 \u05E9\u05D3\u05D4 \u05DC\u05D7\u05D9\u05E4\u05D5\u05E9"):void k[g.value].forEach((a,c)=>{e[c].style.display=a.innerText.includes(b)?"":"none"})};// Handle Orders Sort
const l=document.querySelectorAll(".sort");l.forEach(a=>{a.onclick=()=>fetchOrders(a.getAttribute("data-sort"))})})}// Fetch Users
function fetchUsers(){// Show Header
// Fetch Users
view.innerHTML="\n    <div class=\"view__header\">\n      <div class=\"view__current\">\u05E0\u05D9\u05D4\u05D5\u05DC \u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD</div>\n      <div class=\"view__action\">\n        <button id=\"add-user\"><i class=\"fas fa-user-plus\"></i> \u05D4\u05D5\u05E1\u05E4\u05EA \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D7\u05D3\u05E9</button>\n      </div>\n    </div>\n    <div class=\"loader\">\n      <svg class=\"circular\" viewBox=\"25 25 50 50\">\n        <circle class=\"path\" cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\" stroke-width=\"4\" stroke-miterlimit=\"10\"/>\n      </svg>\n    </div>\n  ",fetch("/manage/users",{credentials:"same-origin"}).then(a=>a.json()).then(a=>{let b=`
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
            ${a.map(a=>`
                  <tr class="product-row">
                    <td>${a.username}</td>
                    <td><img class="td-img" src="${a.avatar}"/></td>
                    <td>${a.email}</td>
                    <td><button data-id="${a._id}" class="delete"><i class="fas fa-trash icon"></i> הסרה</button></td>
                  </tr>
                `).join("")}
          </tbody>
        </table>
      `;// Show Struct
view.innerHTML+=b;// Remove Loader
const c=document.querySelector(".loader");c.remove();// Open Add User Modal
const d=document.querySelector("#add-user");d.onclick=()=>{alert.innerHTML=`
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
        `,modal.classList.add("show");// Show Image Preview
const a=document.querySelector(".preview"),b=document.querySelector("#avatar");b.onchange=function(){const b=new FileReader;b.onload=b=>{a.src=b.target.result},b.readAsDataURL(this.files[0])};// Handle Add User Form Submit
const c=document.forms.addUser,d=c.querySelector(".submit");c.onsubmit=b=>{d.innerHTML="<i class=\"fas fa-cog fa-spin loading\"></i>&nbsp \u05DE\u05D5\u05E1\u05D9\u05E3...",d.setAttribute("disabled","disabled"),b.preventDefault(),fetch("/manage/users",{method:"post",credentials:"same-origin",body:new FormData(c)}).then(a=>a.json()).then(b=>{200===b.status?(modal.classList.remove("show"),c.reset(),a.src="",toast("success","\u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05E0\u05D5\u05E1\u05E3 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4"),fetchUsers()):(toast("err",b),d.innerHTML="\u05D4\u05D5\u05E1\u05E4\u05D4",d.removeAttribute("disabled"))})};// Close Modal
const e=document.querySelector(".close");e.onclick=()=>{modal.classList.remove("show"),c.reset(),a.src=""}};const e=document.querySelector("tbody");e.onclick=a=>{a.target.classList.contains("delete")&&swal({title:"\u05D0\u05EA \u05D1\u05D8\u05D5\u05D7\u05D4 \u05E9\u05D1\u05E8\u05E6\u05D5\u05E0\u05DA \u05DC\u05DE\u05D7\u05D5\u05E7 \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D6\u05D4?",text:"\u05DC\u05D0 \u05D9\u05D4\u05D9\u05D4 \u05E0\u05D9\u05EA\u05DF \u05DC\u05E9\u05D7\u05D6\u05E8 \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D6\u05D4 \u05DC\u05D0\u05D7\u05E8 \u05D4\u05DE\u05D7\u05D9\u05E7\u05D4",icon:"warning",buttons:{cancel:"\u05D1\u05D9\u05D8\u05D5\u05DC",confirm:"\u05DE\u05D7\u05D9\u05E7\u05D4"},dangerMode:!0}).then(b=>{b&&fetch("/manage/users",{method:"delete",credentials:"same-origin",headers:{Accept:"application/json, text/plain, */*","Content-type":"application/json"},body:JSON.stringify({id:a.target.getAttribute("data-id")})}).then(a=>a.json()).then(b=>{200==b?(a.target.closest("tr").remove(),swal("\u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05D4\u05D5\u05E1\u05E8 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4",{icon:"success",button:!1})):toast("err",b)})}),a.target.classList.contains("td-img")&&(lightBoxImg.src=a.target.src,lightbox.style.transform="translateY(0%)")}})}// Fetch All Products
// Fetch All Orders
// Fetch All Users
products.onclick=()=>{history.replaceState({},"","/manage/allProducts"),Router()},orders.onclick=()=>{history.replaceState({},"","/manage/allOrders"),Router()},users.onclick=()=>{history.replaceState({},"","/manage/allUsers"),Router()};
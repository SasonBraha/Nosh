// Init Scroll
const scroll=new SmoothScroll("a[href*=\"#\"]",{speed:1100,offset:55}),rellax=new Rellax(".hero",{speed:-5,center:!0,round:!0,vertical:!0,horizontal:!1});// Init Rellax
992<window.innerWidth&&(window.onscroll=()=>{const a=document.querySelectorAll(".fade-on-scroll");let b=window.innerHeight;const c=window.pageYOffset===void 0?(document.documentElement||document.body.parentNode||document.body).scrollTop:window.pageYOffset;b/=2.2,a.forEach(a=>a.style.opacity=(b-c)/b)});// Create Contact Card
const overlay=document.querySelector(".overlay"),products=document.querySelector(".products");products.onclick=a=>{if(a.target.classList.contains("product")){function b(){function a(){k.style.opacity=0,o++,l.src=j[o%j.length],m=setTimeout(b,800)}1<j.length&&(k.style.opacity=1,k.src=j[o%j.length],n=setTimeout(a,3e3))}function c(){h.style=`
        height: ${g.height}px;
        width: ${g.width}px;
        left: ${d.getBoundingClientRect().left}px;
        top: ${d.getBoundingClientRect().top}px;
        transform: translate(0, 0) translate3d(0, 0, 0);
        border-radius: 0;
        position: fixed;
        z-index: 4;
        will-change: top, left, width;
    `,overlay.classList.remove("show"),setTimeout(()=>requestAnimationFrame(()=>{d.style.opacity="1",h.remove(),clearTimeout(n),clearTimeout(m)}),1e3)}const d=a.target,f={id:d.getAttribute("data-id"),name:d.getAttribute("data-name"),price:d.getAttribute("data-price"),desc:d.getAttribute("data-desc"),img:d.querySelector("img"),images:d.getAttribute("data-images"),position:{x:d.getBoundingClientRect().left,y:d.getBoundingClientRect().top}},g={height:f.img.getBoundingClientRect().height,width:f.img.getBoundingClientRect().width// Create Contact Card
},h=document.createElement("div");// Product Data
h.className="contact-card",h.style=`
      position: fixed;
      height: ${g.height}px;
      width: ${g.width}px;
      left: ${f.position.x}px;
      top: ${f.position.y}px;
      transform: translate3d(0, 0, 0);
      z-index: 4;
      will-change: top, left, width;
    `,h.innerHTML=`
      <div>
        <img class="contact-card__img" style="max-width: ${g.width}px;" src="${f.img.src}">
      </div>
      <div class="contact-card__info">
        <div class="contact-card__info--contact-us"><i class="fas fa-envelope"></i>&nbsp; ליצירת קשר</div>
        <div class="contact-card__logo">NOSH</div>
        <div class="contact-card__info--name"><span>שם השרשרת: </span> ${f.name}</div>
        <div class="contact-card__info--price"><span>מחיר: </span> ₪${f.price}</div>
        <div class="contact-card__info--desc">${f.desc}</div>
      </div>
    `,document.body.appendChild(h);// Set Contact Card Dimensions
const i={height:768<window.innerWidth?g.height:g.height+265,width:768<window.innerWidth?g.width+370:g.width// Animate Contact Card
};window.requestAnimationFrame(()=>{d.style.opacity="0",h.style=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translate3d(0, 0, 0);
        width: ${i.width}px;
        height: ${i.height}px;
        z-index: 4;
        will-change: top, left, width;
      `,overlay.classList.add("show")});// Slide Show
const j=JSON.parse(f.images),k=h.querySelector("img"),l=document.querySelector(".hidden");let m,n,o=0;b();const p=h.querySelector(".contact-card__info"),q=document.querySelector(".contact-card__info--contact-us"),r=`
      <div class="form-container">
        <div class="heading">
          <i class="far fa-gem fa-5x"></i>
          <h2>${f.name}</h3>
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
    `;// Show Order Form
// Close Contact Card
q.onclick=()=>{p.innerHTML=r;// Handle Order Form Submit
const a=document.forms.newOrder,b=a.querySelector(".submit");a.onsubmit=d=>{d.preventDefault();const{client:e,email:g,body:h}=a;e.length&&g.length?(b.innerHTML="<i class=\"fas fa-circle-notch fa-spin loading\"></i>&nbsp \u05E9\u05D5\u05DC\u05D7...",b.setAttribute("disabled","disabled"),fetch("/orders",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-type":"application/json"},body:JSON.stringify({productId:f.id,client:e,email:g,body:h})}).then(a=>a.json()).then(a=>{200===a?(c(),toast("success","\u05E4\u05E0\u05D9\u05D9\u05EA\u05DA \u05E0\u05E8\u05E9\u05DE\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4")):(b.innerHTML="\u05E9\u05DC\u05D9\u05D7\u05D4",b.removeAttribute("disabled"),toast("err",a))})):toast("err","\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05D1\u05E6\u05E2 \u05D4\u05D6\u05DE\u05E0\u05D4 \u05DC\u05DC\u05D0 \u05E9\u05DD \u05DE\u05DC\u05D0 \u05D5\u05DB\u05EA\u05D5\u05D1\u05EA \u05D3\u05D5\u05D0\u05E8 \u05D0\u05DC\u05E7\u05D8\u05E8\u05D5\u05E0\u05D9")}},overlay.onclick=a=>{a.stopPropagation(),c()}}};
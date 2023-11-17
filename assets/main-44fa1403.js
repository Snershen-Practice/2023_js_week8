import{u as o}from"./apis-4fb50ab2.js";const y=document.querySelector(".productWrap"),g=document.querySelector(".productSelect"),C=document.querySelector(".shoppingCart-table"),s=document.querySelector(".orderInfo-form"),B=document.querySelectorAll("input.orderInfo-input");let f=[],i=[],S=0;const m=Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timerProgressBar:!0,timer:2e3,showCloseButton:!0,showClass:{popup:"animate__animated animate__fadeInRight"},hideClass:{popup:"animate__animated animate__fadeOutRight"},didOpen:t=>{t.addEventListener("mouseenter",Swal.stopTimer),t.addEventListener("mouseleave",Swal.resumeTimer)}});function I(){w(),b()}function w(){o.getProduct().then(t=>{f=t.data.products,q(f)})}function b(){o.getCart().then(t=>{c(t),l(i),v()})}function q(t){let e="";t.forEach(r=>{e+=`<li class="productCard" >
    <h4 class="productType">新品</h4>
    <img
      src= ${r.images}
      alt=""
    />
    <a href="#" class="addCardBtn" data-id=${r.id}>加入購物車</a>
    <h3>${r.title}</h3>
    <del class="originPrice">NT${r.origin_price}</del>
    <p class="nowPrice">NT${r.price}</p>
  </li>`}),y.innerHTML=e}function x(t){let e=f.filter(a=>a.category===t.target.value);const r=t.target.value==="全部"?f:e;q(r)}function l(t){let e="";t.forEach(a=>{let n=a.product;e+=`<tr>
    <td>
     <img src="${n.images}" alt="${n.title}" height="100px" class="w-100 object-fit-cover" >
    </td>
    <td>
      <div class="cardItem-title">
        <p>${n.title}</p>
      </div>
    </td>
    <td>NT$${n.price}</td>
    
    <td class="cart-count">
    <div class="d-flex align-items-center">
    <a href="#" class="material-icons cart-btn cart-btn-remove" data-id="${a.id}">remove</a>${a.quantity}<a href="#" class="material-icons cart-btn cart-btn-add" data-id="${a.id}">add</a>
    </div>
  </td>
    <td>NT$${a.quantity*n.price}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${a.id}" data-btn="deleteItem"> clear </a>
    </td>
  </tr>`}),t.length===0&&(e='<tr><td colspan="6" class="text-center text-secondary">購物車是空的<a href="#" class="btn btn-dark px-3 ms-3" data-btn="goProductList">前往選購商品</a></td></tr>');let r=`<tr>
  <th>品項</th>
  <th></th>
  <th>單價</th>
  <th>數量</th>
  <th>金額</th>
  <th></th>
</tr>
${e}
<tr>
  <td>
    <a href="#" class="discardAllBtn text-nowrap" data-btn="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td class="text-end fs-2">NT$${S}</td>
</tr>`;C.innerHTML=r}function c(t){i=t.data.carts,S=t.data.finalTotal}function E(t){let e=t.target.dataset.id;if(!i.every(a=>a.product.id!==e))m.fire({icon:"info",title:"商品已在購物車"});else{const a=y.querySelectorAll(".addCardBtn");a.forEach(n=>{n.classList.add("disabled"),n.dataset.id===t.target.dataset.id&&(n.innerHTML=`加入購物車<div class="spinner-border text-light ms-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`)}),o.postCart({data:{productId:e,quantity:1}}).then(n=>{a.forEach(d=>{d.classList.remove("disabled"),d.textContent="加入購物車"}),m.fire({icon:"success",title:"已加入購物車"}),c(n),l(i)})}}function v(){i.length<=0&&(C.querySelector(".discardAllBtn").style.display="none")}function T(t){let e=0,r=[...t.target.classList],a="";if(r.includes("cart-btn-add")||r.includes("cart-btn-remove")){a=t.target.dataset.id;const n=i.filter(p=>p.id===a);if(r.includes("cart-btn-add"))e=n[0].quantity+1;else if(r.includes("cart-btn-remove")&&(e=n[0].quantity-1,e<=0)){m.fire({icon:"warning",title:"商品數量必須大於 1"});return}const d={data:{id:a,quantity:e}};o.patchCart(d).then(p=>{c(p),l(i)})}}function L(t){let e=t.target.dataset.id;o.delCart(e).then(r=>{c(r),l(i),v(),m.fire({icon:"info",title:"已移除商品"})})}function P(){Swal.fire({title:"確定刪除所有商品？",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確認",cancelButtonText:"取消"}).then(t=>{t.isConfirmed&&(Swal.fire({title:"已清空購物車",icon:"success",timer:2500,showCloseButton:!0,showConfirmButton:!1,timerProgressBar:!0}),o.delAllCart().then(e=>{c(e),l(i),v()}))})}function A(){const t={data:{user:{name:s.querySelector("#customerName").value,tel:s.querySelector("#customerPhone").value,email:s.querySelector("#customerEmail").value,address:s.querySelector("#customerAddress").value,payment:s.querySelector("#tradeWay").value}}};s.reset(),o.postOrder(t).then(e=>{b()})}let h={姓名:{presence:{message:"^姓名是必填欄位"}},電話:{presence:{message:"^電話是必填欄位"},numericality:{message:"^請填入正確格式"}},Email:{presence:{message:"^信箱是必填欄位"},email:{message:"^請輸入正確的信箱格式"}},寄送地址:{presence:{message:"^地址是必填欄位"}}};function $(){let t=validate(s,h);if(t){const e=Object.keys(t);e.forEach(r=>{let n=s.querySelector(`input[name="${r}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");n.textContent=t[r][0]}),Object.keys(h).forEach((r,a)=>{if(e.indexOf(r)===-1){let d=s.querySelector(`input[name="${r}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");d.textContent=""}})}else if(!t)return Object.keys(h).forEach((e,r)=>{let n=s.querySelector(`input[name="${e}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");n.textContent=""}),!0}I();let u=!1;B.forEach(t=>{t.addEventListener("input",e=>{u&&$()})});s.addEventListener("submit",t=>{t.preventDefault(),$()?i.length<=0?(Swal.fire({title:"購物車裡沒有商品",icon:"info",confirmButtonColor:"#3085d6"}),u=!0):(A(),u=!1,Swal.fire({title:"已送出訂單",icon:"success",confirmButtonColor:"#3085d6"})):u=!0});g.addEventListener("change",t=>{x(t)});y.addEventListener("click",t=>{t.preventDefault(),t.target.nodeName==="A"&&E(t)});C.addEventListener("click",t=>{t.preventDefault(),T(t),t.target.dataset.btn==="deleteItem"?L(t):t.target.dataset.btn==="discardAllBtn"&&i.length>0&&P(),t.target.dataset.btn==="goProductList"&&g&&g.scrollIntoView({behavior:"smooth"})});

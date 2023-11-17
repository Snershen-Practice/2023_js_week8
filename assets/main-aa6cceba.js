import{u as d,T as f}from"./alert-1130b6eb.js";const y=document.querySelector(".productWrap"),g=document.querySelector(".productSelect"),C=document.querySelector(".shoppingCart-table"),s=document.querySelector(".orderInfo-form"),I=document.querySelectorAll("input.orderInfo-input");let m=[],i=[],b=0;function B(){x(),S()}function x(){d.getProduct().then(t=>{m=t.data.products,q(m)})}function S(){d.getCart().then(t=>{l(t),o(i),v()})}function q(t){let e="";t.forEach(r=>{e+=`<li class="productCard" >
    <h4 class="productType">新品</h4>
    <img
      src= ${r.images}
      alt=""
    />
    <a href="#" class="addCardBtn" data-id=${r.id}>加入購物車</a>
    <h3>${r.title}</h3>
    <del class="originPrice">NT${r.origin_price}</del>
    <p class="nowPrice">NT${r.price}</p>
  </li>`}),y.innerHTML=e}function T(t){let e=m.filter(a=>a.category===t.target.value);const r=t.target.value==="全部"?m:e;q(r)}function o(t){let e="";t.forEach(a=>{let n=a.product;e+=`<tr>
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
  <td class="text-end fs-2">NT$${b}</td>
</tr>`;C.innerHTML=r}function l(t){i=t.data.carts,b=t.data.finalTotal}function E(t){let e=t.target.dataset.id;if(!i.every(a=>a.product.id!==e))f.fire({icon:"info",title:"商品已在購物車"});else{const a=y.querySelectorAll(".addCardBtn");a.forEach(n=>{n.classList.add("disabled"),n.dataset.id===t.target.dataset.id&&(n.innerHTML=`加入購物車<div class="spinner-border text-light ms-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`)}),d.postCart({data:{productId:e,quantity:1}}).then(n=>{a.forEach(c=>{c.classList.remove("disabled"),c.textContent="加入購物車"}),f.fire({icon:"success",title:"已加入購物車"}),l(n),o(i)})}}function v(){i.length<=0&&(C.querySelector(".discardAllBtn").style.display="none")}function L(t){let e=0,r=[...t.target.classList],a="";if(r.includes("cart-btn-add")||r.includes("cart-btn-remove")){a=t.target.dataset.id;const n=i.filter(p=>p.id===a);if(r.includes("cart-btn-add"))e=n[0].quantity+1;else if(r.includes("cart-btn-remove")&&(e=n[0].quantity-1,e<=0)){f.fire({icon:"warning",title:"商品數量必須大於 1"});return}const c={data:{id:a,quantity:e}};d.patchCart(c).then(p=>{l(p),o(i)})}}function w(t){let e=t.target.dataset.id;d.delCart(e).then(r=>{l(r),o(i),v(),f.fire({icon:"info",title:"已移除商品"})})}function A(){Swal.fire({title:"確定刪除所有商品？",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確認",cancelButtonText:"取消"}).then(t=>{t.isConfirmed&&(Swal.fire({title:"已清空購物車",icon:"success",timer:2500,showCloseButton:!0,showConfirmButton:!1,timerProgressBar:!0}),d.delAllCart().then(e=>{l(e),o(i),v()}))})}function P(){const t={data:{user:{name:s.querySelector("#customerName").value,tel:s.querySelector("#customerPhone").value,email:s.querySelector("#customerEmail").value,address:s.querySelector("#customerAddress").value,payment:s.querySelector("#tradeWay").value}}};s.reset(),d.postOrder(t).then(e=>{S()})}let h={姓名:{presence:{message:"^姓名是必填欄位"}},電話:{presence:{message:"^電話是必填欄位"},numericality:{message:"^請填入正確格式"}},Email:{presence:{message:"^信箱是必填欄位"},email:{message:"^請輸入正確的信箱格式"}},寄送地址:{presence:{message:"^地址是必填欄位"}}};function $(){let t=validate(s,h);if(t){const e=Object.keys(t);e.forEach(r=>{let n=s.querySelector(`input[name="${r}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");n.textContent=t[r][0]}),Object.keys(h).forEach((r,a)=>{if(e.indexOf(r)===-1){let c=s.querySelector(`input[name="${r}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");c.textContent=""}})}else if(!t)return Object.keys(h).forEach((e,r)=>{let n=s.querySelector(`input[name="${e}"]`).closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");n.textContent=""}),!0}B();let u=!1;I.forEach(t=>{t.addEventListener("input",e=>{u&&$()})});s.addEventListener("submit",t=>{t.preventDefault(),$()?i.length<=0?(Swal.fire({title:"購物車裡沒有商品",icon:"info",confirmButtonColor:"#3085d6"}),u=!0):(P(),u=!1,Swal.fire({title:"已送出訂單",icon:"success",confirmButtonColor:"#3085d6"})):u=!0});g.addEventListener("change",t=>{T(t)});y.addEventListener("click",t=>{t.preventDefault(),t.target.nodeName==="A"&&E(t)});C.addEventListener("click",t=>{t.preventDefault(),L(t),t.target.dataset.btn==="deleteItem"?w(t):t.target.dataset.btn==="discardAllBtn"&&i.length>0&&A(),t.target.dataset.btn==="goProductList"&&g&&g.scrollIntoView({behavior:"smooth"})});

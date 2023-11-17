import{a as c}from"./apis-4fb50ab2.js";const u=document.querySelector(".orderPage-table"),m=document.querySelector(".discardAllBtn");let n=[];const h=document.querySelector(".section-title"),g=document.querySelector('select[data-form="orderChartFilter"]');function $(){p()}function p(){c.getOrder().then(t=>{n=t.data.orders,i(),l("title")})}function A(t){const e=new Date(t*1e3),a=e.getFullYear(),d=e.getMonth()+1,r=e.getDate();return`${a}-${d}-${r}`}function i(t){let e="",a="";n.forEach(d=>{let r=d.user;d.products.forEach(f=>{a+=`<li>${f.title}</li>`});const s=d.paid?"已付款":"未付款";let o="";s==="未付款"?o="danger-color":o="info-color",e+=` <tr>
    <td>${d.createdAt}</td>
    <td>
      <p>${r.name}</p>
      <p>${r.tel}</p>
    </td>
    <td>${r.address}</td>
    <td>${r.email}</td>
    <td>
      <p><ul>${a}</ul></p>
    </td>
    <td>${A(d.createdAt)}</td>
    <td class="orderStatus">
      <a href="#" class="${o}">${s}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${d.id} data-btn="deleteItem"/>
    </td>
  </tr>`}),u.innerHTML=`<table class="orderPage-table">
  <thead>
    <tr>
      <th>訂單編號</th>
      <th>聯絡人</th>
      <th>聯絡地址</th>
      <th>電子郵件</th>
      <th>訂單品項</th>
      <th>訂單日期</th>
      <th>訂單狀態</th>
      <th>操作</th>
    </tr>
  </thead>
  ${e}</table>`}function b(t){let e=t.target.dataset.id;n.filter(a=>a.id=e),c.delOrder(e).then(a=>{n=a.data.orders,i(),l("title")})}function E(){c.delAllOrder().then(t=>{n=t.data.orders,i(),l("title")})}function l(t){const e={};n.forEach(d=>{d.products.forEach(r=>{console.log(r[t]),e[r[t]]?e[r[t]]&&e[r[t]]++:e[r[t]]=1})});const a=Object.entries(e);c3.generate({bindto:"#chart",data:{type:"pie",columns:a},color:{pattern:["#301E5F","#5434A7","#6A33F8","#9D7FEA","#DACBFF"]}})}function F(t){t.target.value==="全品項營收"?(l("title"),h.textContent="全品項營收"):t.target.value==="全產品類別營收比重"&&(l("category"),h.textContent="全產品類別營收比重")}$();u.addEventListener("click",t=>{t.target.dataset.btn==="deleteItem"&&b(t)});m.addEventListener("click",()=>{E()});g.addEventListener("change",t=>{F(t)});

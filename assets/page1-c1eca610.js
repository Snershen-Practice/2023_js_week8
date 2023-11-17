import{a as i,T as h}from"./alert-1130b6eb.js";const f=document.querySelector(".orderPage-table"),p=document.querySelector(".discardAllBtn");let n=[];const u=document.querySelector(".section-title"),g=document.querySelector('select[data-form="orderChartFilter"]');document.querySelectorAll(".orderStatus a");function $(){A()}function A(){i.getOrder().then(t=>{n=t.data.orders,s(),l("title")})}function b(t){const e=new Date(t*1e3),a=e.getFullYear(),r=e.getMonth()+1,d=e.getDate();return`${a}-${r}-${d}`}function s(t){let e="",a="";n.forEach(r=>{let d=r.user;r.products.forEach(m=>{a+=`<li>${m.title}</li>`});const c=r.paid?"已付款":"未付款";let o="";c==="未付款"?o="danger-color":o="info-color",e+=` <tr>
    <td>${r.createdAt}</td>
    <td>
      <p>${d.name}</p>
      <p>${d.tel}</p>
    </td>
    <td>${d.address}</td>
    <td>${d.email}</td>
    <td>
      <p><ul>${a}</ul></p>
    </td>
    <td>${b(r.createdAt)}</td>
    <td class="orderStatus">
      <a href="#" class="${o}" data-id=${r.id} data-btn="status">${c}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${r.id} data-btn="deleteItem"/>
    </td>
  </tr>`}),f.innerHTML=`<table class="orderPage-table">
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
  ${e}</table>`}function O(t){let a={data:{id:t.target.dataset.id,paid:!0}};t.target.textContent==="已付款"?a.data.paid=!1:a.data.paid=!0,i.putOrder(a).then(r=>{h.fire({icon:"success",title:"已修改訂單狀態"}),n=r.data.orders,s()})}function S(t){let e=t.target.dataset.id;n.filter(a=>a.id=e),i.delOrder(e).then(a=>{h.fire({icon:"success",title:"已刪除訂單"}),n=a.data.orders,s(),l("title")})}function E(){i.delAllOrder().then(t=>{n=t.data.orders,s(),l("title")})}function l(t){const e={};n.forEach(r=>{r.products.forEach(d=>{e[d[t]]?e[d[t]]&&e[d[t]]++:e[d[t]]=1})});const a=Object.entries(e);c3.generate({bindto:"#chart",data:{type:"pie",columns:a},color:{pattern:["#301E5F","#5434A7","#6A33F8","#9D7FEA","#DACBFF"]}})}function F(t){t.target.value==="全品項營收"?(l("title"),u.textContent="全品項營收"):t.target.value==="全產品類別營收比重"&&(l("category"),u.textContent="全產品類別營收比重")}$();f.addEventListener("click",t=>{t.preventDefault(),t.target.dataset.btn==="deleteItem"?S(t):t.target.dataset.btn==="status"&&O(t)});p.addEventListener("click",()=>{E()});g.addEventListener("change",t=>{F(t)});

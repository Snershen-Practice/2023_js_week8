import "../../style/all.css";
import "../../style/admin.css";
import { adminApi } from "../apis.js";
import { Toast } from "../alert.js";

const orderTable = document.querySelector(".orderPage-table");
const discardAllBtn = document.querySelector(".discardAllBtn");

let orderData = [];

const sectionTitle = document.querySelector(".section-title");
const orderChartFilter = document.querySelector('select[data-form="orderChartFilter"]');
const orderStatusBtn = document.querySelectorAll(".orderStatus a");

//初始化
function init() {
  getOrderData();
}

function getOrderData() {
  adminApi.getOrder().then((res) => {
    orderData = res.data.orders;
    renderOrder(orderData);
    renderChartData("title");
  });
}

//轉換日期格式
function timeFormat(time) {
  const date = new Date(time * 1000);
  const year = date.getFullYear();
  //月份索引從 0 開始
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

//訂單 - 渲染
function renderOrder(data) {
  let str = "";
  let productList = "";
  orderData.forEach((order) => {
    let user = order.user;
    order.products.forEach((item) => {
      productList += `<li>${item.title}</li>`;
    });

    const orderStatus = order.paid ? "已付款" : "未付款";
    let className = "";
    if (orderStatus === "未付款") {
      className = "danger-color";
    } else {
      className = "info-color";
    }

    str += ` <tr>
    <td>${order.createdAt}</td>
    <td>
      <p>${user.name}</p>
      <p>${user.tel}</p>
    </td>
    <td>${user.address}</td>
    <td>${user.email}</td>
    <td>
      <p><ul>${productList}</ul></p>
    </td>
    <td>${timeFormat(order.createdAt)}</td>
    <td class="orderStatus">
      <a href="#" class="${className}" data-id=${order.id} data-btn="status">${orderStatus}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${order.id} data-btn="deleteItem"/>
    </td>
  </tr>`;
  });

  orderTable.innerHTML = `<table class="orderPage-table">
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
  ${str}</table>`;
}

//訂單 - 修改訂單狀態
function editOrderStatus(e) {
  let tempId = e.target.dataset.id;
  let data = {
    data: {
      id: tempId,
      paid: true,
    },
  };

  if (e.target.textContent === "已付款") {
    data.data.paid = false;
  } else {
    data.data.paid = true;
  }

  adminApi.putOrder(data).then((res) => {
    Toast.fire({
      icon: "success",
      title: "已修改訂單狀態",
    });

    orderData = res.data.orders;
    renderOrder(orderData);
  });
}

//訂單 - 刪除單一訂單
function deleteOrder(e) {
  let tempItemId = e.target.dataset.id;
  const targetOrder = orderData.filter((order) => {
    return (order.id = tempItemId);
  });

  adminApi.delOrder(tempItemId).then((res) => {
    Toast.fire({
      icon: "success",
      title: "已刪除訂單",
    });
    orderData = res.data.orders;
    renderOrder(orderData);
    renderChartData("title");
  });
}

//訂單 - 刪除所有訂單
function deleteAllOrder() {
  adminApi.delAllOrder().then((res) => {
    orderData = res.data.orders;
    renderOrder(orderData);
    renderChartData("title");
  });
}

//圖表 - 資料處理與渲染
function renderChartData(type) {
  const productItem = {};
  orderData.forEach((order) => {
    order.products.forEach((product) => {
      if (!productItem[product[type]]) {
        productItem[product[type]] = 1;
      } else if (productItem[product[type]]) {
        productItem[product[type]]++;
      }
    });
  });
  const productItemToArr = Object.entries(productItem);
  // C3.js
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      type: "pie",
      columns: productItemToArr,
    },
    color: {
      pattern: ["#301E5F", "#5434A7", "#6A33F8", "#9D7FEA", "#DACBFF"],
    },
  });
}

//圖表 - 篩選
function filterChart(e) {
  if (e.target.value === "全品項營收") {
    renderChartData("title");
    sectionTitle.textContent = "全品項營收";
  } else if (e.target.value === "全產品類別營收比重") {
    renderChartData("category");
    sectionTitle.textContent = "全產品類別營收比重";
  }
}

init();

orderTable.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.dataset.btn === "deleteItem") {
    deleteOrder(e);
  } else if (e.target.dataset.btn === "status") {
    editOrderStatus(e);
  }
});

discardAllBtn.addEventListener("click", () => {
  e.preventDefault();
  deleteAllOrder();
});

orderChartFilter.addEventListener("change", (e) => {
  filterChart(e);
});

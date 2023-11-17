import "../../style/all.css";
import "../../style/index.css";
import { userApi } from "../apis.js";
import { Toast } from "../alert.js";

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");

const shoppingCartTable = document.querySelector(".shoppingCart-table");

const orderInfoForm = document.querySelector(".orderInfo-form");
const orderInfoGroup = document.querySelectorAll("input.orderInfo-input");

let productData = [];
let cartsData = [];

// let originTotal = 0;
let discountTotal = 0;

//初始化
function init() {
  getProductData();
  getCartData();
}

//取得產品列表
function getProductData() {
  userApi.getProduct().then((res) => {
    productData = res.data.products;
    renderProducts(productData);
  });
}

//取得購物車列表
function getCartData() {
  userApi.getCart().then((res) => {
    updateCartData(res);
    renderCart(cartsData);
    checkCartHaveProduct();
  });
}

//產品列表 - 渲染
function renderProducts(data) {
  let str = "";
  data.forEach((product) => {
    str += `<li class="productCard" >
    <h4 class="productType">新品</h4>
    <img
      src= ${product.images}
      alt=""
    />
    <a href="#" class="addCardBtn" data-id=${product.id}>加入購物車</a>
    <h3>${product.title}</h3>
    <del class="originPrice">NT${product.origin_price}</del>
    <p class="nowPrice">NT${product.price}</p>
  </li>`;
  });
  productWrap.innerHTML = str;
}

//產品列表 - 篩選
function filterData(e) {
  let filterData = productData.filter((product) => {
    return product.category === e.target.value;
  });
  const result = e.target.value === "全部" ? productData : filterData;
  renderProducts(result);
}

//購物車列表 - 渲染
function renderCart(carts) {
  let list = "";
  carts.forEach((item) => {
    let product = item.product;
    list += `<tr>
    <td>
     <img src="${product.images}" alt="${product.title}" height="100px" class="w-100 object-fit-cover" >
    </td>
    <td>
      <div class="cardItem-title">
        <p>${product.title}</p>
      </div>
    </td>
    <td>NT$${product.price}</td>
    
    <td class="cart-count">
    <div class="d-flex align-items-center">
    <a href="#" class="material-icons cart-btn cart-btn-remove" data-id="${item.id}">remove</a>${
      item.quantity
    }<a href="#" class="material-icons cart-btn cart-btn-add" data-id="${item.id}">add</a>
    </div>
  </td>
    <td>NT$${item.quantity * product.price}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id="${item.id}" data-btn="deleteItem"> clear </a>
    </td>
  </tr>`;
  });

  if (carts.length === 0) {
    list = `<tr><td colspan="6" class="text-center text-secondary">購物車是空的<a href="#" class="btn btn-dark px-3 ms-3" data-btn="goProductList">前往選購商品</a></td></tr>`;
  }

  let content = `<tr>
  <th>品項</th>
  <th></th>
  <th>單價</th>
  <th>數量</th>
  <th>金額</th>
  <th></th>
</tr>
${list}
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
  <td class="text-end fs-2">NT$${discountTotal}</td>
</tr>`;

  shoppingCartTable.innerHTML = content;
}

//購物車 - 更新資料
function updateCartData(res) {
  cartsData = res.data.carts;
  // originTotal = res.data.total;
  discountTotal = res.data.finalTotal;
}

//購物車 - 加入品項
function addCart(e) {
  let tempProductId = e.target.dataset.id;
  const status = cartsData.every((item) => {
    return item.product.id !== tempProductId;
  });
  if (!status) {
    Toast.fire({
      icon: "info",
      title: "商品已在購物車",
    });
  } else {
    const buttons = productWrap.querySelectorAll(".addCardBtn");
    buttons.forEach((button) => {
      button.classList.add("disabled");
      if (button.dataset.id === e.target.dataset.id) {
        button.innerHTML = `加入購物車<div class="spinner-border text-light ms-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`;
      }
    });
    userApi
      .postCart({
        data: {
          productId: tempProductId,
          quantity: 1,
        },
      })
      .then((res) => {
        buttons.forEach((button) => {
          button.classList.remove("disabled");
          button.textContent = "加入購物車";
        });
        Toast.fire({
          icon: "success",
          title: "已加入購物車",
        });
        updateCartData(res);
        renderCart(cartsData);
      });
  }
}

//購物車 - 檢查是否有商品
function checkCartHaveProduct() {
  if (cartsData.length <= 0) {
    shoppingCartTable.querySelector(".discardAllBtn").style.display = "none";
  }
}

//購物車 - 編輯數量
function editCartNum(e) {
  let tempCartNum = 0;
  let targetClass = [...e.target.classList];
  let cartId = "";
  if (targetClass.includes("cart-btn-add") || targetClass.includes("cart-btn-remove")) {
    cartId = e.target.dataset.id;
    const targetProduct = cartsData.filter((product) => {
      return product.id === cartId;
    });
    if (targetClass.includes("cart-btn-add")) {
      tempCartNum = targetProduct[0].quantity + 1;
    } else if (targetClass.includes("cart-btn-remove")) {
      tempCartNum = targetProduct[0].quantity - 1;
      if (tempCartNum <= 0) {
        Toast.fire({
          icon: "warning",
          title: "商品數量必須大於 1",
        });
        return;
      }
    }
    const data = {
      data: {
        id: cartId,
        quantity: tempCartNum,
      },
    };
    userApi.patchCart(data).then((res) => {
      updateCartData(res);
      renderCart(cartsData);
    });
  }
}

//購物車 - 刪除品項
function deleteCart(e) {
  let tempCartId = e.target.dataset.id;
  userApi.delCart(tempCartId).then((res) => {
    updateCartData(res);
    renderCart(cartsData);
    checkCartHaveProduct();
    Toast.fire({
      icon: "info",
      title: "已移除商品",
    });
  });
}

//購物車 - 刪除所有品項
function deleteAllCart() {
  Swal.fire({
    title: "確定刪除所有商品？",
    // text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確認",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "已清空購物車",
        // text: "Your file has been deleted.",
        icon: "success",
        timer: 2500,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      userApi.delAllCart().then((res) => {
        updateCartData(res);
        renderCart(cartsData);
        checkCartHaveProduct();
      });
    }
  });
}

//訂單 - 送出
function submitOrder() {
  const order = {
    data: {
      user: {
        name: orderInfoForm.querySelector("#customerName").value,
        tel: orderInfoForm.querySelector("#customerPhone").value,
        email: orderInfoForm.querySelector("#customerEmail").value,
        address: orderInfoForm.querySelector("#customerAddress").value,
        payment: orderInfoForm.querySelector("#tradeWay").value,
      },
    },
  };
  //清空表單欄位
  orderInfoForm.reset();

  userApi.postOrder(order).then((res) => {
    //重新取得購物車資料
    getCartData();
  });
}

//檢查表單內容
let constraints = {
  姓名: {
    presence: { message: "^姓名是必填欄位" },
  },
  電話: {
    presence: { message: "^電話是必填欄位" },
    numericality: { message: "^請填入正確格式" },
  },
  Email: {
    presence: { message: "^信箱是必填欄位" },
    email: { message: "^請輸入正確的信箱格式" },
  },
  寄送地址: {
    presence: { message: "^地址是必填欄位" },
  },
};

function checkFormInfo() {
  let result = validate(orderInfoForm, constraints);
  if (result) {
    const resultArr = Object.keys(result);
    resultArr.forEach((item) => {
      let target = orderInfoForm.querySelector(`input[name="${item}"]`);
      let message = target.closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");
      message.textContent = result[item][0];
    });
    Object.keys(constraints).forEach((item, i) => {
      if (resultArr.indexOf(item) === -1) {
        // console.log(`${item} 不存在於 resultArr`);
        let target = orderInfoForm.querySelector(`input[name="${item}"]`);
        let message = target.closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");
        message.textContent = "";
      }
    });
  } else if (!result) {
    Object.keys(constraints).forEach((item, i) => {
      let target = orderInfoForm.querySelector(`input[name="${item}"]`);
      let message = target.closest(".orderInfo-inputWrap").querySelector(".orderInfo-message");
      message.textContent = "";
    });
    return true;
  }
}

init();

let hadSubmitOrder = false;

orderInfoGroup.forEach((item) => {
  item.addEventListener("input", (e) => {
    if (hadSubmitOrder) {
      checkFormInfo();
    }
  });
});

orderInfoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!checkFormInfo()) {
    hadSubmitOrder = true;
  } else if (cartsData.length <= 0) {
    Swal.fire({
      title: "購物車裡沒有商品",
      icon: "info",
      confirmButtonColor: "#3085d6",
    });
    hadSubmitOrder = true;
  } else {
    submitOrder();
    hadSubmitOrder = false;
    Swal.fire({
      title: "已送出訂單",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  }
});

productSelect.addEventListener("change", (e) => {
  filterData(e);
});

productWrap.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.nodeName !== "A") {
    return;
  } else {
    addCart(e);
  }
});

shoppingCartTable.addEventListener("click", (e) => {
  e.preventDefault();
  editCartNum(e);
  if (e.target.dataset.btn === "deleteItem") {
    deleteCart(e);
  } else if (e.target.dataset.btn === "discardAllBtn") {
    if (cartsData.length > 0) {
      deleteAllCart();
    }
  }
  if (e.target.dataset.btn === "goProductList") {
    if (productSelect) {
      productSelect.scrollIntoView({
        behavior: "smooth",
      });
    }
  }
});

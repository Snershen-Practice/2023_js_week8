import axios from "axios";

const domain = import.meta.env.VITE_API_SERVER;
const apiPath = import.meta.env.VITE_API_PATH;

const userRequest = axios.create({
  baseURL: `${domain}api/livejs/v1/customer/${apiPath}`,
});

const adminRequest = axios.create({
  baseURL: `${domain}api/livejs/v1/admin/${apiPath}`,
  headers: {
    Authorization: import.meta.env.VITE_API_TOKEN,
  },
});

userRequest.interceptors.response.use(
  function (res) {
    return res;
  },
  function (err) {
    return err;
  }
);

export const userApi = {
  //產品
  getProduct() {
    return userRequest.get("/products");
  },

  //購物車
  getCart() {
    return userRequest.get("/carts");
  },
  postCart(data) {
    return userRequest.post("/carts", data);
  },
  putCart(id, data) {
    return userRequest.put(`/carts/${id}`, data);
  },
  patchCart(data) {
    return userRequest.patch("/carts", data);
  },
  delCart(id) {
    return userRequest.delete(`/carts/${id}`);
  },
  delAllCart() {
    return userRequest.delete("/carts");
  },

  //訂單
  postOrder(data) {
    return userRequest.post("/orders", data);
  },
};

export const adminApi = {
  getOrder() {
    return adminRequest.get("/orders");
  },
  putOrder(data) {
    return adminRequest.put("/orders", data);
  },
  delOrder(id) {
    return adminRequest.delete(`/orders/${id}`);
  },
  delAllOrder() {
    return adminRequest.delete("/orders");
  },
};

import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { BootstrapVue } from 'bootstrap-vue'

import './app.scss'

/* eslint-disable-next-line */
const io = require("socket.io-client");
const socket = io("http://localhost:3000", {
    withCredentials: false,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});

socket.on('price', (stuff: any) => {
    console.log(stuff);
    store.commit('setBchNokPrice', {
        price: stuff.price
    });
});

socket.on('payment', (stuff: any) => {
    store.commit('setShowSpinner', false);
    store.commit('paymentReceived', stuff);
    setTimeout(() => {
        store.commit('paymentReceived', null);
    }, 10000);
});

socket.on('fridge', (fridgeState: any) => {
    store.commit('serverFridgeUpdate', fridgeState);
});

socket.on('electrum-notification', (what: string) => {
    store.commit('setShowSpinner', true);
    setTimeout(() => {
        store.commit('setShowSpinner', false);
    }, 5000);
});

socket.on('refill', (payload: any) => {
    store.commit('setShowRefill', payload.txid);
    setTimeout(() => {
        store.commit('setShowRefill', "");
    }, 10000);
});

socket.on('disconnect', () => {
    store.commit('serverFridgeUpdate', {
        slotBalance: 0,
        soldUnits: 0,
        numberOfSlots: 0,
        orderPriceNok: 0,
        fridgeAddress: ""
    });
});

/* eslint-disable-next-line */
const VueQrcode = require('@chenfengyuan/vue-qrcode');

Vue.config.productionTip = false;
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

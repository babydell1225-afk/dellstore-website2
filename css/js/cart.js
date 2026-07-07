// DellStore Cart System
// Sistem keranjang sisi-klien (disimpan di localStorage browser).
// Catatan: ini simulasi checkout front-end untuk keperluan demo/tugas,
// tidak terhubung ke payment gateway sungguhan.

const DS_CART_KEY = 'dellstore_cart_v1';
const DS_ORDER_KEY = 'dellstore_last_order_v1';

function dsGetCart() {
  try {
    const raw = localStorage.getItem(DS_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function dsSaveCart(cart) {
  localStorage.setItem(DS_CART_KEY, JSON.stringify(cart));
  dsUpdateCartBadge();
}

function dsAddToCart(item, qty) {
  qty = qty || 1;
  const cart = dsGetCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: qty });
  }
  dsSaveCart(cart);
}

function dsRemoveFromCart(id) {
  dsSaveCart(dsGetCart().filter(i => i.id !== id));
}

function dsUpdateQty(id, qty) {
  const cart = dsGetCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
  }
  dsSaveCart(cart);
}

function dsClearCart() {
  localStorage.removeItem(DS_CART_KEY);
  dsUpdateCartBadge();
}

function dsCartCount() {
  return dsGetCart().reduce((sum, i) => sum + i.qty, 0);
}

function dsCartTotal() {
  return dsGetCart().reduce((sum, i) => sum + i.qty * i.price, 0);
}

function dsFormatRupiah(num) {
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

function dsUpdateCartBadge() {
  const count = dsCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('.cart-badge-inline').forEach(el => {
    el.textContent = count;
  });
}

function dsShowToast(msg) {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._dsTimer);
  toast._dsTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.addEventListener('DOMContentLoaded', () => {
  dsUpdateCartBadge();

  // Handle "Beli Sekarang" / add-to-cart buttons on product cards
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('[data-id]');
      if (!card) return;
      const item = {
        id: card.getAttribute('data-id'),
        name: card.getAttribute('data-name'),
        price: parseInt(card.getAttribute('data-price'), 10) || 0,
        image: card.getAttribute('data-image') || ''
      };
      dsAddToCart(item, 1);
      dsShowToast(item.name + ' ditambahkan ke keranjang');
      if (btn.getAttribute('data-add-cart') === 'buy') {
        setTimeout(() => { window.location.href = 'cart.html'; }, 350);
      }
    });
  });
});

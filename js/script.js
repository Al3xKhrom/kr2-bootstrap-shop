document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('productsList');
  if (list) {
    const items = Array.from(list.querySelectorAll('.catalog-item'));
    const search = document.getElementById('searchInput');
    const category = document.getElementById('categoryFilter');
    const sort = document.getElementById('sortSelect');
    const count = document.getElementById('productCount');
    const empty = document.getElementById('emptyCatalog');
    function updateCatalog() {
      const query = search.value.trim().toLowerCase();
      const selected = category.value;
      let visible = 0;
      items.forEach(function (item) {
        const show = item.dataset.name.includes(query) &&
          (selected === 'all' || item.dataset.category === selected);
        item.classList.toggle('d-none', !show);
        if (show) visible++;
      });
      const sorted = items.slice().sort(function (a, b) {
        if (sort.value === 'cheap') return Number(a.dataset.price) - Number(b.dataset.price);
        if (sort.value === 'expensive') return Number(b.dataset.price) - Number(a.dataset.price);
        if (sort.value === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'ru');
        return Number(a.dataset.default) - Number(b.dataset.default);
      });
      sorted.forEach(function (item) { list.appendChild(item); });
      count.textContent = 'Найдено: ' + visible;
      empty.classList.toggle('d-none', visible !== 0);
    }
    search.addEventListener('input', updateCatalog);
    category.addEventListener('change', updateCatalog);
    sort.addEventListener('change', updateCatalog);
    document.getElementById('resetFilters').addEventListener('click', function () {
      search.value = ''; category.value = 'all'; sort.value = 'default'; updateCatalog();
    });
  }
  const orderProduct = document.getElementById('orderProduct');
  if (orderProduct) {
    const selectedProduct = new URLSearchParams(window.location.search).get('product');
    if (selectedProduct && Array.from(orderProduct.options).some(function (o) { return o.value === selectedProduct; })) {
      orderProduct.value = selectedProduct;
    }
  }
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    const success = document.getElementById('orderSuccess');
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!orderForm.checkValidity()) { orderForm.classList.add('was-validated'); return; }
      const name = document.getElementById('orderName').value.trim();
      const product = document.getElementById('orderProduct');
      success.textContent = 'Спасибо, ' + name + '! Демонстрационная заявка на товар «' + product.options[product.selectedIndex].text + '» заполнена. Данные на сервер не отправлялись.';
      success.classList.remove('d-none');
      orderForm.classList.remove('was-validated');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    orderForm.addEventListener('reset', function () { success.classList.add('d-none'); orderForm.classList.remove('was-validated'); });
  }
  const quickForm = document.getElementById('quickOrderForm');
  if (quickForm) {
    const message = document.getElementById('quickMessage');
    quickForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!quickForm.checkValidity()) { quickForm.reportValidity(); return; }
      message.textContent = 'Демонстрационная заявка заполнена! На сервер ничего не отправлялось.';
      message.classList.remove('d-none');
    });
    quickForm.addEventListener('reset', function () { message.classList.add('d-none'); });
  }
});
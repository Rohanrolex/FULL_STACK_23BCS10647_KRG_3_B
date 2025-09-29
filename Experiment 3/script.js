const productListData = [
  { id: 1, name: "Google Pixel 8", category: "Mobile", price: 900 },
  { id: 2, name: "OnePlus 12", category: "Mobile", price: 950 },
  { id: 3, name: "HP Spectre x360", category: "Laptop", price: 2200 },
  { id: 4, name: "Lenovo ThinkPad X1", category: "Laptop", price: 2000 },
  { id: 5, name: "Bose QuietComfort Earbuds", category: "Accessories", price: 250 },
  { id: 6, name: "Razer Gaming Mouse", category: "Accessories", price: 80 },
];

const productContainer = document.getElementById("productContainer");
const categoryFilter = document.getElementById("categoryFilter");

const renderProducts = (list) => {
  productContainer.innerHTML = list.length
    ? list
        .map(
          (product) => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
      </div>
    `
        )
        .join("")
    : '<p class="no-products">No products found!</p>';
};

renderProducts(productListData);

categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;
  const filteredProducts =
    selectedCategory === "All"
      ? productListData
      : productListData.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  renderProducts(filteredProducts);
});

// src/api.js
export const updateProductType = async (jewelryImageId, productType) => {
    const response = await fetch(
      `http://localhost:8000/api/products/${jewelryImageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_type: productType }),
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to update product type");
    }
    return response.json();
  };
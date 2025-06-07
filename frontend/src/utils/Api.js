const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const updateProductType = async (jewelryImageId, productType) => {
    const response = await fetch(
      `${API_BASE_URL}/products/${jewelryImageId}`,
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
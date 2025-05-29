
export const updateProductType = async (jewelryImageId, productType) => {
    const response = await fetch(
      `http://192.168.0.110:8000/api/products/${jewelryImageId}`,
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
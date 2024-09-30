"use server";

export async function getCart(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/cart/${userId}`
    );

    if (!response.ok) throw new Error("Failed to fetch cart details");

    const cart = await response.json();
    return cart;
  } catch (error) {
    return "error while getting cart";
  }
}

export async function addCart() {}

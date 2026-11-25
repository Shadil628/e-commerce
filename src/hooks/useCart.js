
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getCart, createCart, updateCart } from "../services/cartServices";

function useCart() {
    const queryClient = useQueryClient();
    const user = useSelector((state) => state.auth.user);

    const { data: cart, isLoading } = useQuery({
        queryKey: ["cart", user?.id],
        queryFn: async () => {
            const carts = await getCart(user.id);

            return carts[0] || {
                userId: user.id,
                items: []
            };
        },
        enabled: !!user
    });

    const mutation = useMutation({
        mutationFn: async (items) => {
            const carts = await getCart(user.id);

            if (carts.length > 0) {
                return await updateCart(carts[0].id, { items });
            }

            return await createCart({
                userId: user.id,
                items
            });
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart", user.id]
            });
        }
    });

    // Add product with selected colour
    const addProduct = async (product) => {
        const items = cart?.items || [];
        const selectedColor = product.selectedColor || "";

        const existing = items.find(
            (item) =>
                item.id === product.id &&
                (item.selectedColor || "") === selectedColor
        );

        let updatedItems;

        if (existing) {
            if (existing.quantity >= product.stock) return false;

            updatedItems = items.map((item) =>
                item.id === product.id &&
                (item.selectedColor || "") === selectedColor
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            if (product.stock <= 0) return false;

            updatedItems = [
                ...items,
                { ...product, selectedColor, quantity: 1 }
            ];
        }

        await mutation.mutateAsync(updatedItems);
        return true;
    };

    // Remove a specific colour of a product
    const removeProduct = (id, selectedColor = "") => {
        const items = cart?.items || [];

        const updatedItems = items.filter(
            (item) =>
                !(
                    item.id === id &&
                    (item.selectedColor || "") === selectedColor
                )
        );

        return mutation.mutateAsync(updatedItems);
    };

    // Update quantity for a specific colour
    const changeQuantity = (id, selectedColor, quantity) => {
        const items = cart?.items || [];

        const updatedItems = items.map((item) =>
            item.id === id &&
            (item.selectedColor || "") === selectedColor &&
            quantity >= 1 &&
            quantity <= item.stock
                ? { ...item, quantity }
                : item
        );

        return mutation.mutateAsync(updatedItems);
    };

    const clearCart = () => mutation.mutateAsync([]);

    return {
        cartItems: cart?.items || [],
        isLoading,
        addProduct,
        removeProduct,
        changeQuantity,
        clearCart,
        isSaving: mutation.isPending
    };
}

export default useCart;

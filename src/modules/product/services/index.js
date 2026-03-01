import { createProduct, readProduct, readProducts, updateProduct, deleteProduct } from './productService.js';
import { createCategory, readCategory, readCategories, updateCategory, deleteCategory } from './categoryService.js';

export const productService = {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct
};

export const categoryService = {
    createCategory,
    readCategory,
    readCategories,
    updateCategory,
    deleteCategory
};

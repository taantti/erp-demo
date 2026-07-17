export default [
    {
        name: "test-role",
        role: "OVERSEER",
        rolePermission: {
            user: {
                createUser: { access: true, immutable: false, adminTenantOnly: false },
                readUsers: { access: true, immutable: false, adminTenantOnly: false },
                readUser: { access: true, immutable: false, adminTenantOnly: false },
                updateUser: { access: true, immutable: false, adminTenantOnly: false },
                deleteUser: { access: true, immutable: false, adminTenantOnly: false },
                updateUserPassword: { access: true, immutable: false, adminTenantOnly: false }
            },
            productCategory: {
                createProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                readProductCategories: { access: true, immutable: false, adminTenantOnly: false },
                readProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                updateProductCategory: { access: true, immutable: false, adminTenantOnly: false },
                deleteProductCategory: { access: true, immutable: false, adminTenantOnly: false }
            },
            product: {
                createProduct: { access: true, adminTenantOnly: false, immutable: false },
                readProduct: { access: true, adminTenantOnly: false, immutable: false },
                readProducts: { access: true, adminTenantOnly: false, immutable: false },
                updateProduct: { access: true, adminTenantOnly: false, immutable: false },
                deleteProduct: { access: true, adminTenantOnly: false, immutable: false }
            },
            stock: {
                createStock: { access: true, adminTenantOnly: false, immutable: false },
                readStock: { access: true, adminTenantOnly: false, immutable: false },
                readStocks: { access: true, adminTenantOnly: false, immutable: false },
                updateStock: { access: true, adminTenantOnly: false, immutable: false },
                deleteStock: { access: true, adminTenantOnly: false, immutable: false },
                createShelf: { access: true, adminTenantOnly: false, immutable: false },
                readShelf: { access: true, adminTenantOnly: false, immutable: false },
                readShelves: { access: true, adminTenantOnly: false, immutable: false },
                updateShelf: { access: true, adminTenantOnly: false, immutable: false },
                deleteShelf: { access: true, adminTenantOnly: false, immutable: false },
                readInventories: { access: true, adminTenantOnly: false, immutable: false },
                createInventory: { access: true, adminTenantOnly: false, immutable: false },
                readInventory: { access: true, adminTenantOnly: false, immutable: false },
                updateInventory: { access: true, adminTenantOnly: false, immutable: false },
                deleteInventory: { access: true, adminTenantOnly: false, immutable: false },
                readStockEvents: { access: true, adminTenantOnly: false, immutable: false },
                createStockEvent: { access: true, adminTenantOnly: false, immutable: false },
                readStockEvent: { access: true, adminTenantOnly: false, immutable: false },
                updateStockEvent: { access: true, adminTenantOnly: false, immutable: false },
                deleteStockEvent: { access: true, adminTenantOnly: false, immutable: false }
            },
            customer: {
                createCustomer: { access: true, adminTenantOnly: false, immutable: false },
                readCustomer: { access: true, adminTenantOnly: false, immutable: false },
                readCustomers: { access: true, adminTenantOnly: false, immutable: false },
                updateCustomer: { access: true, adminTenantOnly: false, immutable: false },
                deleteCustomer: { access: true, adminTenantOnly: false, immutable: false }
            },
            "purchaseOrder": {
                createPurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                readPurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                readPurchaseOrderItems: { access: true, adminTenantOnly: false, immutable: false },
                updatePurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                deletePurchaseOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                createPurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
                readPurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
                readPurchaseOrders: { access: true, adminTenantOnly: false, immutable: false },
                updatePurchaseOrder: { access: true, adminTenantOnly: false, immutable: false },
                deletePurchaseOrder: { access: true, adminTenantOnly: false, immutable: false }
            },
            "saleOrder": {
                createSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                readSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                readSaleOrderItems: { access: true, adminTenantOnly: false, immutable: false },
                updateSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                deleteSaleOrderItem: { access: true, adminTenantOnly: false, immutable: false },
                createSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
                readSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
                readSaleOrders: { access: true, adminTenantOnly: false, immutable: false },
                updateSaleOrder: { access: true, adminTenantOnly: false, immutable: false },
                deleteSaleOrder: { access: true, adminTenantOnly: false, immutable: false }
            },
            // --- api-create-mock-rolepermission object marker: inserts new permission block above this line. ----
        }
    }
];
# Storefront Guide: Wishlist & Add to Cart Integration

This guide covers implementing wishlist and add-to-cart functionality in your storefront using Vendure's Shop API. The backend runs Vendure v3.4.0 with custom product schema extensions.

## API Endpoints

- **Shop API**: `POST http://<host>:3000/shop-api`
- **GraphiQL (Shop)**: `http://<host>:3000/graphiql/shop`

## Custom Product Schema

Your backend includes these custom fields that should be considered for wishlist/cart features:

### Product Custom Fields

- `tecDoc` - Technical Documentation
- `tecDocProd` - Product Technical Doc
- `towKod` - Product Code
- `icIndex` - Interchange Index
- `customCode` - Category Code

### ProductVariant Custom Fields

- `barcodes` - Array of barcodes
- `packageWeight` - Weight in kg
- `packageLength/Width/Height` - Dimensions in cm
- `blockedReturn` - Boolean flag for return restrictions

## Cart Implementation

### 1. Add Item to Cart

Use the `addItemToOrder` mutation to add products to the active order (cart):

```graphql
mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
        ... on Order {
            id
            code
            state
            totalWithTax
            currencyCode
            lines {
                id
                quantity
                linePrice
                linePriceWithTax
                productVariant {
                    id
                    name
                    sku
                    priceWithTax
                    stockLevel
                    product {
                        name
                        customFields {
                            tecDoc
                            towKod
                        }
                    }
                    customFields {
                        barcodes
                        packageWeight
                        blockedReturn
                    }
                }
            }
        }
        ... on OrderModificationError {
            errorCode
            message
        }
        ... on OrderLimitError {
            errorCode
            message
            maxItems
        }
        ... on NegativeQuantityError {
            errorCode
            message
        }
        ... on InsufficientStockError {
            errorCode
            message
            quantityAvailable
        }
    }
}
```

### 2. Get Active Order (Cart)

Retrieve the current cart contents:

```graphql
query GetActiveOrder {
    activeOrder {
        id
        code
        state
        totalWithTax
        currencyCode
        totalQuantity
        lines {
            id
            quantity
            linePrice
            linePriceWithTax
            productVariant {
                id
                name
                sku
                priceWithTax
                stockLevel
                featuredAsset {
                    preview
                }
                product {
                    name
                    slug
                    customFields {
                        tecDoc
                        towKod
                    }
                }
                customFields {
                    barcodes
                    packageWeight
                    packageLength
                    packageWidth
                    packageHeight
                    blockedReturn
                }
            }
        }
    }
}
```

### 3. Update Cart Item Quantity

```graphql
mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
        ... on Order {
            id
            totalWithTax
            lines {
                id
                quantity
                linePrice
                linePriceWithTax
            }
        }
        ... on OrderModificationError {
            errorCode
            message
        }
    }
}
```

### 4. Remove Item from Cart

```graphql
mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
        ... on Order {
            id
            totalWithTax
            lines {
                id
                quantity
            }
        }
        ... on OrderModificationError {
            errorCode
            message
        }
    }
}
```

## Wishlist Implementation

**Note**: Vendure doesn't include wishlist functionality by default. You'll need to implement a custom plugin or use a third-party solution.

### Option 1: Custom Wishlist Plugin

Based on Vendure documentation, here's how to create a wishlist plugin:

#### GraphQL Schema Extension

```graphql
type WishlistItem implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    productVariant: ProductVariant!
    productVariantId: ID!
}

extend type Query {
    activeCustomerWishlist: [WishlistItem!]!
}

extend type Mutation {
    addToWishlist(productVariantId: ID!): [WishlistItem!]!
    removeFromWishlist(itemId: ID!): [WishlistItem!]!
}
```

#### Usage Examples

**Get Customer Wishlist:**

```graphql
query GetWishlist {
    activeCustomerWishlist {
        id
        createdAt
        productVariant {
            id
            name
            sku
            priceWithTax
            stockLevel
            featuredAsset {
                preview
            }
            product {
                name
                slug
                customFields {
                    tecDoc
                    towKod
                }
            }
            customFields {
                barcodes
                packageWeight
                blockedReturn
            }
        }
    }
}
```

**Add to Wishlist:**

```graphql
mutation AddToWishlist($productVariantId: ID!) {
    addToWishlist(productVariantId: $productVariantId) {
        id
        productVariant {
            id
            name
            priceWithTax
        }
    }
}
```

**Remove from Wishlist:**

```graphql
mutation RemoveFromWishlist($itemId: ID!) {
    removeFromWishlist(itemId: $itemId) {
        id
        productVariant {
            id
            name
        }
    }
}
```

### Option 2: Client-Side Wishlist

For a simpler implementation, store wishlist data in localStorage or a client-side state management solution:

```typescript
// Wishlist item interface
interface WishlistItem {
    productVariantId: string;
    productName: string;
    variantName: string;
    sku: string;
    price: number;
    image?: string;
    addedAt: Date;
}

// Wishlist management functions
export class WishlistManager {
    private static STORAGE_KEY = "vendure-wishlist";

    static getWishlist(): WishlistItem[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static addToWishlist(item: WishlistItem): void {
        const wishlist = this.getWishlist();
        const exists = wishlist.find((w) => w.productVariantId === item.productVariantId);

        if (!exists) {
            wishlist.push({ ...item, addedAt: new Date() });
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
        }
    }

    static removeFromWishlist(productVariantId: string): void {
        const wishlist = this.getWishlist();
        const filtered = wishlist.filter((w) => w.productVariantId !== productVariantId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

    static isInWishlist(productVariantId: string): boolean {
        const wishlist = this.getWishlist();
        return wishlist.some((w) => w.productVariantId === productVariantId);
    }
}
```

## Frontend Implementation Examples

### React/Next.js Cart Hook

```typescript
import { useState, useEffect } from "react";

interface CartItem {
    id: string;
    quantity: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        priceWithTax: number;
        product: {
            name: string;
            customFields: {
                tecDoc?: string;
                towKod?: string;
            };
        };
        customFields: {
            blockedReturn?: boolean;
            packageWeight?: number;
        };
    };
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const addToCart = async (productVariantId: string, quantity: number = 1) => {
        setLoading(true);
        try {
            const response = await fetch("/shop-api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: ADD_ITEM_TO_ORDER_MUTATION,
                    variables: { productVariantId, quantity },
                }),
            });

            const { data } = await response.json();
            if (data.addItemToOrder.__typename === "Order") {
                setCart(data.addItemToOrder.lines);
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (orderLineId: string, quantity: number) => {
        // Implementation for adjustOrderLine mutation
    };

    const removeItem = async (orderLineId: string) => {
        // Implementation for removeOrderLine mutation
    };

    return {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
    };
}
```

### Vue.js Wishlist Composable

```typescript
import { ref, computed } from "vue";

export function useWishlist() {
    const wishlistItems = ref<WishlistItem[]>([]);

    const loadWishlist = () => {
        wishlistItems.value = WishlistManager.getWishlist();
    };

    const addToWishlist = (item: WishlistItem) => {
        WishlistManager.addToWishlist(item);
        loadWishlist();
    };

    const removeFromWishlist = (productVariantId: string) => {
        WishlistManager.removeFromWishlist(productVariantId);
        loadWishlist();
    };

    const isInWishlist = (productVariantId: string) => {
        return WishlistManager.isInWishlist(productVariantId);
    };

    const wishlistCount = computed(() => wishlistItems.value.length);

    return {
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loadWishlist,
    };
}
```

## Error Handling

### Cart Error Types

Handle these common error types when adding items to cart:

- `OrderModificationError` - General order modification issues
- `OrderLimitError` - Too many items in cart
- `NegativeQuantityError` - Invalid quantity
- `InsufficientStockError` - Not enough stock available

### Stock Validation

Before adding to cart, check stock availability:

```graphql
query CheckStock($productVariantId: ID!) {
    productVariant(id: $productVariantId) {
        id
        stockLevel
        stockAllocated
        stockOnHand
    }
}
```

## Best Practices

### Cart Management

- Always check stock levels before adding items
- Handle error cases gracefully with user feedback
- Consider package dimensions for shipping calculations
- Respect `blockedReturn` flag for return policies
- Display technical information (`tecDoc`, `towKod`) when relevant

### Wishlist Management

- Sync wishlist with user account when logged in
- Provide easy migration from guest to authenticated wishlist
- Show stock status and price changes for wishlist items
- Allow bulk actions (add all to cart, remove multiple items)

### Performance

- Cache cart/wishlist data appropriately
- Use optimistic updates for better UX
- Implement proper loading states
- Consider pagination for large wishlists

### Security

- Validate all mutations server-side
- Implement rate limiting for add-to-cart actions
- Sanitize user inputs
- Use proper authentication for wishlist operations

## Testing

### Cart Testing Scenarios

- Add item with sufficient stock
- Add item with insufficient stock
- Update quantity beyond available stock
- Remove items from cart
- Handle concurrent cart modifications

### Wishlist Testing Scenarios

- Add/remove items while logged out
- Sync wishlist on login
- Handle duplicate additions
- Test with various product variants
- Verify custom field data display

## Integration with Your Custom Schema

When displaying cart/wishlist items, leverage your custom fields:

```typescript
// Display technical information
const TechnicalInfo = ({ product, variant }) => (
  <div className="technical-info">
    {product.customFields.tecDoc && (
      <span>TEC DOC: {product.customFields.tecDoc}</span>
    )}
    {product.customFields.towKod && (
      <span>Product Code: {product.customFields.towKod}</span>
    )}
    {variant.customFields.packageWeight && (
      <span>Weight: {variant.customFields.packageWeight}kg</span>
    )}
    {variant.customFields.blockedReturn && (
      <span className="warning">Returns not allowed</span>
    )}
  </div>
);
```

This implementation provides a solid foundation for cart and wishlist functionality while leveraging your custom product schema effectively.

---

## My Account Page Queries

For the customer account dashboard, you'll need these core queries:

### 1. Current User Information

```graphql
query Me {
    me {
        id
        identifier
        channels {
            id
            code
            token
        }
    }
}
```

### 2. Customer Profile Information

```graphql
query GetActiveCustomer {
    activeCustomer {
        id
        title
        firstName
        lastName
        emailAddress
        phoneNumber
        dateOfBirth
        addresses {
            id
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country {
                id
                name
                code
            }
            phoneNumber
            defaultShippingAddress
            defaultBillingAddress
        }
    }
}
```

### 2. Order History

```graphql
query GetCustomerOrders($options: OrderListOptions) {
    activeCustomer {
        id
        orders(options: $options) {
            totalItems
            items {
                id
                code
                state
                orderPlacedAt
                totalWithTax
                currencyCode
                lines {
                    id
                    quantity
                    linePriceWithTax
                    productVariant {
                        id
                        name
                        sku
                        featuredAsset {
                            preview
                        }
                        product {
                            name
                            slug
                            customFields {
                                tecDoc
                                towKod
                            }
                        }
                        customFields {
                            barcodes
                            packageWeight
                            blockedReturn
                        }
                    }
                }
                shippingAddress {
                    fullName
                    streetLine1
                    city
                    postalCode
                }
                payments {
                    id
                    method
                    amount
                    state
                    transactionId
                }
                fulfillments {
                    id
                    state
                    method
                    trackingCode
                }
            }
        }
    }
}
```

Variables for pagination:

```json
{
    "options": {
        "skip": 0,
        "take": 10,
        "sort": {
            "orderPlacedAt": "DESC"
        }
    }
}
```

### 3. Single Order Details

```graphql
query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
        id
        code
        state
        orderPlacedAt
        updatedAt
        totalWithTax
        totalQuantity
        currencyCode
        customer {
            firstName
            lastName
            emailAddress
        }
        lines {
            id
            quantity
            unitPriceWithTax
            linePriceWithTax
            productVariant {
                id
                name
                sku
                priceWithTax
                featuredAsset {
                    preview
                }
                product {
                    name
                    slug
                    description
                    customFields {
                        tecDoc
                        tecDocProd
                        towKod
                        icIndex
                        customCode
                    }
                }
                customFields {
                    barcodes
                    packageWeight
                    packageLength
                    packageWidth
                    packageHeight
                    blockedReturn
                }
            }
        }
        shippingAddress {
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country {
                name
            }
            phoneNumber
        }
        billingAddress {
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country {
                name
            }
        }
        payments {
            id
            method
            amount
            state
            transactionId
            createdAt
        }
        fulfillments {
            id
            state
            method
            trackingCode
            createdAt
            updatedAt
        }
        history {
            items {
                id
                type
                createdAt
                data
            }
        }
    }
}
```

### 4. Update Customer Profile

```graphql
mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
        ... on Customer {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
        }
        ... on ErrorResult {
            errorCode
            message
        }
    }
}
```

### 5. Manage Addresses

**Create Address:**

```graphql
mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
            name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
    }
}
```

**Update Address:**

```graphql
mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
        id
        fullName
        streetLine1
        city
        defaultShippingAddress
        defaultBillingAddress
    }
}
```

**Delete Address:**

```graphql
mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
        success
    }
}
```

### 6. Change Password

```graphql
mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
    updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
        ... on Success {
            success
        }
        ... on InvalidCredentialsError {
            errorCode
            message
        }
        ... on PasswordValidationError {
            errorCode
            message
            validationErrorMessage
        }
    }
}
```

### 7. Account Dashboard Summary

```graphql
query AccountDashboard {
    activeCustomer {
        id
        firstName
        lastName
        orders(options: { take: 5, sort: { orderPlacedAt: DESC } }) {
            totalItems
            items {
                id
                code
                state
                orderPlacedAt
                totalWithTax
                currencyCode
            }
        }
    }
}
```

## Frontend Implementation Example

```typescript
// Account page hook
export function useAccount() {
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomerData = async () => {
        try {
            const [customerRes, ordersRes] = await Promise.all([
                shopQuery(GET_ACTIVE_CUSTOMER),
                shopQuery(GET_CUSTOMER_ORDERS, {
                    options: { take: 10, sort: { orderPlacedAt: "DESC" } },
                }),
            ]);

            setCustomer(customerRes.activeCustomer);
            setOrders(ordersRes.activeCustomer?.orders.items || []);
        } catch (error) {
            console.error("Failed to fetch account data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const result = await shopQuery(UPDATE_CUSTOMER, {
                input: profileData,
            });

            if (result.updateCustomer.__typename === "Customer") {
                setCustomer(result.updateCustomer);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.updateCustomer.message,
                };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return {
        customer,
        orders,
        loading,
        fetchCustomerData,
        updateProfile,
    };
}
```

## Account Page Sections

**Dashboard Overview:**

- Welcome message with customer name
- Recent orders summary
- Quick actions (view orders, manage addresses)

**Order History:**

- Paginated list of orders
- Order status badges
- Quick reorder functionality
- View order details link

**Profile Management:**

- Edit personal information
- Change password
- Email preferences

**Address Book:**

- List of saved addresses
- Add/edit/delete addresses
- Set default shipping/billing addresses

**Account Settings:**

- Newsletter subscriptions
- Privacy preferences
- Account deletion option

This covers all the essential queries and functionality needed for a comprehensive "My Account" page in your storefront.

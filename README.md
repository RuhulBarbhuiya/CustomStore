# Custom Store

Custom Store is a Next.js merchandise store where users can browse products, add products to cart, and customize products by placing text or images on top of a product preview. Admin users can add, edit, and delete products, and those products are saved in MongoDB and shown on the website.

## Tech Stack

- Next.js App Router
- React client components
- MongoDB
- Mongoose
- Fabric.js `^7.2.0`
- Browser `localStorage` for user session, cart, and orders
- CSS modules for styling

## Main Features

- Homepage with product category links
- Product category pages for T-shirts, hoodies, full sleeves, mugs, and caps
- Product detail page
- Admin dashboard
- Add, edit, and delete products from admin
- Signup and login
- Cart
- Checkout
- My Orders page
- Product customization with Fabric.js canvas
- Front and back customization for supported products
- Image upload and recommended design assets

## Project Structure

```txt
app/
  admin/
    page.js
    admin.module.css
  api/
    login/route.js
    signup/route.js
    products/route.js
    products/[id]/route.js
    users/route.js
  cart/page.js
  checkout/page.js
  components/
    CategoryPage.js
    Navbar.js
  customize/
    page.js
    [category]/page.js
    product/[id]/page.js
    product/[id]/CustomizeClient.js
  data/
    categoryProducts.js
    localProducts.js
  orders/page.js
  products/[id]/page.js
  page.js
lib/
  cart.js
  imagePaths.js
  mongodb.js
  orders.js
  products.js
  user.js
models/
  Product.js
  User.js
public/
  assets/
  caps/
  fulltshirt/
  homepage/
  hoodies/
  mugs/
  tshirts/
scripts/
  mark-customizable-products.mjs
```

## Important Files

- `app/page.js` - homepage.
- `app/components/Navbar.js` - site navigation.
- `app/components/CategoryPage.js` - reusable category listing page.
- `app/admin/page.js` - admin dashboard for users and products.
- `app/api/products/route.js` - product create and product list API.
- `app/api/products/[id]/route.js` - product read, update, and delete API.
- `models/Product.js` - product database schema.
- `models/User.js` - user database schema.
- `lib/mongodb.js` - MongoDB connection helper.
- `lib/products.js` - product fetching, filtering, merging, and id lookup.
- `lib/cart.js` - cart storage logic.
- `lib/orders.js` - order storage logic.
- `lib/user.js` - client-side user session snapshot logic.
- `app/customize/product/[id]/CustomizeClient.js` - Fabric.js customizer.

## Running The Project

Create `.env.local`:

```bash
MONGODB_URI=your_mongodb_connection_string
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the site:

```bash
http://localhost:3000
```

Build the project:

```bash
npm run build
```

Start a production build:

```bash
npm run start
```

## Database Connection

The MongoDB connection is handled in `lib/mongodb.js`.

```js
const MONGODB_URI = process.env.MONGODB_URI;
```

Every API route that needs the database calls:

```js
await connectDB();
```

This connects Mongoose to the MongoDB database from `.env.local`.

## Product Model

Products are defined in `models/Product.js`.

The main fields are:

- `name` - product name.
- `price` - product price.
- `image` - main/front product image.
- `backImage` - optional back product image.
- `description` - product description.
- `category` - category such as `tshirt`, `hoodie`, `full-sleeve`, `mug`, or `cap`.
- `isCustomizable` - whether the product is meant for the customize flow.
- `colorOptions` - optional list of colors with front/back images and swatches.

The schema is exported as:

```js
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
```

This prevents model re-registration errors during Next.js development reloads.

## User Model

Users are defined in `models/User.js`.

The fields are:

- `name`
- `email`
- `password`

The email field is unique. Signup creates users in MongoDB. Login checks the saved user record.

Note: the current login route compares the plain text password directly with the saved password. The project has `bcryptjs` installed, but the current login/signup flow is not using password hashing yet.

## Authentication Flow

Signup is handled by:

```txt
app/signup/page.js
app/api/signup/route.js
```

Flow:

1. User enters name, email, and password.
2. `app/signup/page.js` sends a `POST` request to `/api/signup`.
3. `app/api/signup/route.js` connects to MongoDB.
4. It checks if a user already exists with the same email.
5. It creates a new user with `User.create(...)`.

Login is handled by:

```txt
app/login/page.js
app/api/login/route.js
```

Flow:

1. User enters email and password.
2. `app/login/page.js` sends a `POST` request to `/api/login`.
3. `app/api/login/route.js` finds the user in MongoDB.
4. If the password matches, the route returns the user's name and email.
5. The frontend stores the user in browser `localStorage` under the key `user`.
6. Other components read that user through `lib/user.js`.

## Admin Dashboard

The admin page is:

```txt
app/admin/page.js
```

The admin dashboard has sections for:

- users
- managing products
- adding a product
- editing a product
- deleting a product

The navbar is hidden on admin pages. `Navbar.js` checks:

```js
if (pathname.startsWith("/admin")) {
  return null;
}
```

## How Adding Product In Admin Works

The product form is in `app/admin/page.js`.

When an admin creates a product:

1. The form data is stored in React state named `product`.
2. Clicking `Create Product` runs `saveProduct()`.
3. `saveProduct()` validates required fields.
4. It builds a payload.
5. It sends a `POST` request to `/api/products`.
6. `app/api/products/route.js` receives the request.
7. The API route connects to MongoDB using `connectDB()`.
8. The product is inserted with `Product.create(...)`.
9. MongoDB returns the saved product.

The important route is:

```txt
app/api/products/route.js
```

The create logic is:

```js
const product = await Product.create({
  ...data,
  isCustomizable: Boolean(data.isCustomizable),
});
```

## How Editing Product Works

When the admin clicks `Edit`:

1. The selected product is copied into the admin form.
2. `editingId` is set to the product id.
3. The form switches to edit mode.
4. Clicking save sends a `PUT` request to `/api/products/[id]`.
5. `app/api/products/[id]/route.js` updates the product with `Product.findByIdAndUpdate(...)`.

## How Deleting Product Works

When the admin clicks `Delete`:

1. The browser asks for confirmation.
2. The app sends a `DELETE` request to `/api/products/[id]`.
3. `app/api/products/[id]/route.js` checks that the id is a valid MongoDB ObjectId.
4. The product is deleted with `Product.findByIdAndDelete(id)`.
5. The products table refreshes.

## How Admin Products Reflect On The Website

Category pages use:

```txt
app/components/CategoryPage.js
```

When a category page loads:

1. The category page knows its category slug, such as `tshirt`.
2. `CategoryPage` fetches database products from `/api/products`.
3. The request includes the category and customization filter.

Example:

```txt
/api/products?category=tshirt&isCustomizable=false
```

or for customize pages:

```txt
/api/products?category=tshirt&isCustomizable=true
```

4. `app/api/products/route.js` calls `getProducts(...)`.
5. `getProducts(...)` in `lib/products.js` queries MongoDB using the category filter.
6. The frontend displays the returned products in the product grid.

So if an admin adds:

```js
{
  name: "Premium Black Tshirt",
  price: 899,
  category: "tshirt",
  image: "/tshirts/set3/blackfront.png"
}
```

that product is saved in MongoDB and then appears on the T-shirt category page because the page fetches products where `category` is `tshirt`.

## Local Products And Database Products

The project supports both local catalog products and MongoDB products.

Local product helpers are in:

```txt
app/data/localProducts.js
app/data/categoryProducts.js
```

Database product helpers are in:

```txt
lib/products.js
```

`lib/products.js` contains helper functions to:

- build MongoDB filters
- fetch products from MongoDB
- fetch a product by id
- parse `isCustomizable` filters
- merge local products and database products

The admin page can call:

```txt
/api/products?includeLocal=true
```

That returns local products and database products together.

## Product Detail Flow

The normal product detail page is:

```txt
app/products/[id]/page.js
```

Flow:

1. The product id comes from the URL.
2. The page fetches `/api/products/[id]`.
3. The API route calls `getProductById(id)` from `lib/products.js`.
4. If the id is a valid MongoDB ObjectId, it loads from MongoDB.
5. If the id is not a MongoDB ObjectId, it checks local catalog products.
6. The page displays image, price, size options, color options, add to cart, buy now, and customize button when supported.

The detail page decides if a product can be customized using:

```js
product?.isCustomizable ||
["tshirt", "hoodie", "full-sleeve", "cap", "mug"].includes(product?.category)
```

## Cart Flow

Cart logic is in:

```txt
lib/cart.js
```

The cart is stored in browser `localStorage` under:

```txt
cart
```

When a user adds a normal product:

1. The product is normalized by `normalizeCartItem(...)`.
2. A cart id is created from product id and size.
3. If the same item already exists, quantity increases.
4. Otherwise the item is added to the cart array.
5. The updated cart is saved in `localStorage`.

When a user adds a customized product:

1. It is marked as customized.
2. A unique id is created.
3. This prevents two different designs for the same product from overwriting each other.

Cart UI is in:

```txt
app/cart/page.js
```

Customized items show front and back design previews when available.

## Checkout And Orders

Checkout UI is in:

```txt
app/checkout/page.js
```

Order helpers are in:

```txt
lib/orders.js
```

Important: orders are currently saved in browser `localStorage`, not MongoDB.

Checkout flow:

1. User must be signed in.
2. User fills shipping details.
3. `saveOrder(...)` creates an order object.
4. The order is saved to `localStorage` under the key `orders`.
5. The cart is cleared.
6. The success message is shown.

Orders page:

```txt
app/orders/page.js
```

It reads orders from `localStorage` and displays them.

## Customize Route Flow

The customize entry page is:

```txt
app/customize/page.js
```

It redirects to:

```txt
/customize/tshirts
```

The category customize page is:

```txt
app/customize/[category]/page.js
```

It:

1. Finds the customize category.
2. Fetches database products where `isCustomizable` is `true`.
3. Merges local and database products.
4. Redirects to the first customizable product.

The product customizer page is:

```txt
app/customize/product/[id]/page.js
```

It:

1. Checks if the product exists in local customizable products.
2. Otherwise loads the product from MongoDB.
3. Renders `CustomizeClient`.

## Is Fabric.js Being Used?

Yes. Fabric.js is being used in this project.

It is installed in `package.json`:

```json
"fabric": "^7.2.0"
```

It is imported in:

```txt
app/customize/product/[id]/CustomizeClient.js
```

The import is:

```js
import * as fabric from "fabric";
```

So the customizer is not using plain HTML drag-and-drop. It is using Fabric.js canvas objects.

## Where Fabric.js Works In This Project

Fabric.js is used only inside:

```txt
app/customize/product/[id]/CustomizeClient.js
```

That file controls:

- front canvas
- back canvas
- product background image
- text objects
- uploaded image objects
- recommended design image objects
- selected object deletion
- changing text color
- exporting the final design to cart

## How The Fabric Canvas Is Created

The page has normal HTML `<canvas>` elements:

```jsx
<canvas ref={frontCanvasRef} />
<canvas ref={backCanvasRef} />
```

React refs point to those canvas elements.

Fabric converts each HTML canvas into an interactive Fabric canvas:

```js
const canvas = new fabric.Canvas(element, {
  width: 220,
  height: 240,
  preserveObjectStacking: true,
  selection: true,
});
```

This is what enables object selection, dragging, resizing, borders, and controls.

## How Product Image Stays In The Background

The product image is loaded with:

```js
fabric.Image.fromURL(...)
```

Then it is set as the canvas background image:

```js
canvas.backgroundImage = shirt;
canvas.renderAll();
```

The product image is configured like this:

```js
selectable: false,
evented: false,
```

That means users cannot accidentally drag the product image itself. The shirt, hoodie, cap, or mug stays fixed while the design objects move on top of it.

## How Text Dragging Works

When a user types text and clicks `Add Text`, the app creates a Fabric text object:

```js
const text = new fabric.Text(textValue, {
  left: canvas.getWidth() / 2,
  top: canvas.getHeight() / 2,
  originX: "center",
  originY: "center",
  fill: selectedTextColor,
  fontSize: 26,
  fontFamily: "Arial",
  editable: true,
  selectable: true,
  hasControls: true,
  hasBorders: true,
});
```

Then the text is added to the active canvas:

```js
canvas.add(text);
canvas.setActiveObject(text);
canvas.renderAll();
```

Because the text has:

```js
selectable: true
hasControls: true
hasBorders: true
```

Fabric.js shows a selection box around it. The user can drag it, resize it, and move it around the product.

## How Uploaded Image Dragging Works

When a user uploads an image, the file is read with `FileReader`.

The uploaded image becomes a data URL:

```js
reader.readAsDataURL(file);
```

Then it is passed to:

```js
addImageToCanvas(reader.result);
```

Inside `addImageToCanvas(...)`, Fabric loads the image:

```js
fabric.Image.fromURL(imageUrl, loadOptions).then((image) => {
  image.set({
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    originX: "center",
    originY: "center",
    scaleX: scale,
    scaleY: scale,
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
  });

  canvas.add(image);
  canvas.setActiveObject(image);
  canvas.renderAll();
});
```

Because the uploaded image is selectable and evented, Fabric.js lets the user drag, resize, and reposition it.

## How Recommended Designs Work

Recommended design images are defined in `CustomizeClient.js` in the `designAssets` array.

Each asset has:

- `id`
- `name`
- `category`
- `image`
- `suitableFor`

When the user clicks a recommended design, the app calls:

```js
addImageToCanvas(asset.image)
```

So recommended designs use the same Fabric.js image object flow as uploaded images.

## How Front And Back Customization Works

The active side is controlled by React state:

```js
const [activeSide, setActiveSide] = useState("front");
```

The app stores Fabric canvas instances in:

```js
const fabricCanvasesRef = useRef({ front: null, back: null });
```

When active side is front, new text/images are added to:

```js
fabricCanvasesRef.current.front
```

When active side is back, new text/images are added to:

```js
fabricCanvasesRef.current.back
```

Mugs only use the front side. Other supported products can use front and back.

## How Text Color Works

When the user chooses a text color:

1. The app checks the currently selected Fabric object.
2. If the selected object is text, it updates the `fill` color.
3. The canvas re-renders.

The important code checks:

```js
selectedObject.type === "text" || selectedObject.type === "i-text"
```

Then it does:

```js
selectedObject.set("fill", colorValue);
canvas.renderAll();
```

## How Delete Selected Works

The customizer can delete the currently selected object.

It gets the active object:

```js
const selectedObject = canvas?.getActiveObject();
```

Then removes it:

```js
canvas.remove(selectedObject);
canvas.requestRenderAll();
```

The app also listens for keyboard `Delete` and `Backspace`, so selected objects can be removed with the keyboard.

## How Customized Designs Are Saved To Cart

When the user clicks `Add to Cart` or `Checkout`, `CustomizeClient.js` builds a customized cart item.

It saves:

- product id
- product name
- price
- selected color
- selected size
- quantity
- front design preview
- back design preview
- front Fabric JSON
- back Fabric JSON
- `customized: true`

The preview image is created with:

```js
frontCanvas?.toDataURL()
backCanvas?.toDataURL()
```

The editable canvas structure is saved with:

```js
frontCanvas?.toJSON()
backCanvas?.toJSON()
```

The cart stores this data in `localStorage`.

## Product Categories

The app supports:

- T-shirts
- Hoodies
- Full sleeves
- Mugs
- Caps

Category routes include:

```txt
/tshirts
/hoodies
/full-sleeves
/mugs
/caps
```

Customize routes include:

```txt
/customize/tshirts
/customize/hoodies
/customize/full-sleeves
/customize/mugs
/customize/caps
```

## Product Images

Product image paths point to files in `public`.

Examples:

```txt
public/tshirts/set3/blackfront.png
public/tshirts/set3/blackback.png
public/hoodies/set2/whitefront.png
public/mugs/blue.png
public/caps/set5/black.png
```

In the code, public files are referenced from the root:

```txt
/tshirts/set3/blackfront.png
/mugs/blue.png
```

## API Routes

### Signup

```txt
POST /api/signup
```

Creates a user in MongoDB.

### Login

```txt
POST /api/login
```

Checks the user's email and password and returns basic user info.

### Products

```txt
GET /api/products
POST /api/products
```

`GET` returns products from MongoDB.

Query parameters:

- `category`
- `isCustomizable`
- `includeLocal`

`POST` creates a product in MongoDB.

### Single Product

```txt
GET /api/products/[id]
PUT /api/products/[id]
DELETE /api/products/[id]
```

`GET` loads one product.

`PUT` updates one MongoDB product.

`DELETE` deletes one MongoDB product.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run products:customizable
```

`npm run products:customizable` runs:

```txt
scripts/mark-customizable-products.mjs
```

That script is used to mark products as customizable in the database.

## Current Storage Summary

- Products: MongoDB through Mongoose.
- Users: MongoDB through Mongoose.
- Logged-in user: browser `localStorage`.
- Cart: browser `localStorage`.
- Orders: browser `localStorage`.
- Product design previews: saved into cart/order as Fabric canvas data URLs.
- Product design editable structure: saved into cart as Fabric canvas JSON.

## Build Notes

The project builds with:

```bash
npm run build
```

The build may show warnings about using HTML `<img>` tags instead of Next.js `<Image />`. These warnings do not stop the build.

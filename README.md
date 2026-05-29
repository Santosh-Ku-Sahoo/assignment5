# React Custom Hooks Assignment - useFetch

This project is a React application built for MERN Stack Assignment 5. It focuses on creating and using a custom React hook named `useFetch` to handle API data fetching, loading states, and error handling.

## What This Assignment Demonstrates

This assignment demonstrates:
- How to create a reusable React Custom Hook to fetch data from an external endpoint.
- Handling asynchronous operations in React using `useEffect`, `useState`, and `useCallback`.
- Managing loading and error states during API calls and displaying fallback content/error boxes to the user.
- Simple state filtering (local product searching) and clean, basic CSS layouts.

## How the useFetch Hook Works

The `useFetch` hook is located in `src/hooks/useFetch.js`. Here is how it functions:
1. **State Variables**: It sets up three pieces of state using `useState`:
   - `data`: Stores the successfully fetched JSON payload (initially `null`).
   - `loading`: A boolean indicating if the network request is currently active (initially `false`).
   - `error`: Stores any error message that occurred during the fetch (initially `null`).
2. **Fetch Logic**: It defines an asynchronous function `fetchData` wrapped inside `useCallback` to prevent unnecessary function re-creations.
3. **Try-Catch Block**: It executes the standard browser `fetch` function inside a try-catch block. If the server response is not successful (`response.ok` is false), it throws an error.
4. **Triggering Effect**: A `useEffect` hook triggers the `fetchData` function automatically when the component mounts and whenever the `url` parameter changes.
5. **Return Value**: The hook returns an object `{ data, loading, error, refetch }` allowing components like `ProductList` to consume the states and trigger manual refreshes.

## API Endpoint Used

We are using the following dummy products API:
`https://api.escuelajs.co/api/v1/products`

### Why This Endpoint Was Chosen:
- It returns a rich JSON array of products with details like title, price, description, images, and categories, making it perfect for demonstrating store grid UI.
- It responds to network requests instantly and supports standard REST requests.
- It provides a large catalog of items, allowing us to implement search filters locally.

## Setup and Run Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone or copy the assignment files to your local system.
2. Open your terminal in the project directory.
3. Install the dependencies by running:
   ```bash
   npm install
   ```

### Running Locally
To launch the local development server, run:
   ```bash
   npm run dev
   ```
Then, open your browser and navigate to `http://localhost:5173/`.

### Building for Production
To build the project for Vercel/Netlify deployment, run:
   ```bash
   npm run build
   ```
The output files will be built inside the `dist` directory.

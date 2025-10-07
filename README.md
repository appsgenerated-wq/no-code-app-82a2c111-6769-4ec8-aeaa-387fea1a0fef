# MoonDash 🚀

Welcome to MoonDash, a futuristic food delivery application powered by Manifest.

This is a complete full-stack React application built with a Manifest backend, demonstrating a space-themed food delivery service.

## Features

- **User Authentication**: Customers and drivers can sign up and log in.
- **Role-Based Views**: The UI changes based on whether you are a `customer`, `driver`, or `admin`.
- **Browse Restaurants**: Customers can see a list of available 'Lunar Outposts'.
- **Order Management**: Customers can view their order history.
- **Driver Dashboard**: Drivers have a dedicated view to see their assigned deliveries and update the status of their 'Lunar Rover'.
- **Admin Capabilities**: Admins have access to a special form to deploy new rovers and assign them to drivers.
- **Image Uploads**: Leverages Manifest's `image` type for restaurant and menu item photos.

## Backend (Manifest)

The backend is defined in `manifest.yml` and includes the following entities:
- `User`: Authenticable entity with roles (`customer`, `driver`, `admin`).
- `LunarOutpost`: Represents a restaurant.
- `MenuItem`: An item on an outpost's menu.
- `LunarRover`: A delivery vehicle assigned to a driver.
- `Order`: Tracks a delivery from customer to completion.

Policies are set up to ensure users can only access and modify their own data, while admins have full control.

## Frontend (React)

The frontend is a single-page application built with React and Vite, styled with Tailwind CSS.

- **No Redux/Context**: State is managed simply with `useState` and `useEffect` hooks.
- **Direct Manifest SDK Integration**: All backend communication is handled through the `@mnfst/sdk`, with no `fetch` or `axios` calls to the API.
- **Feature-Aware UI**: Components are designed to directly correspond to Manifest backend features like `choice` fields (status selectors) and `belongsTo` relationships (driver picker).

## Getting Started

Follow the `setupGuide.md` to get your local environment running.

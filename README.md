# 🖼️ Met Museum Explorer – Full Stack Artwork Browser

**Met Museum Explorer** is a fully responsive, full-stack web application that allows users to explore and interact with artwork from the **Metropolitan Museum of Art Collection API**. The app includes advanced search, detailed artwork views, user authentication, persistent favourites, and search history.

---

## 🌟 Features

- 🔍 **Search Artwork**: Search thousands of artworks from The Met Collection using keywords and filters.
- 🖼️ **Detailed Views**: View full artwork details, images, metadata, and ratings.
- 📂 **Advanced Search**: Filter by title, medium, classification, etc.
- ❤️ **Favourites System**: Add/remove artworks to personal favourites (requires login).
- 📜 **Search History**: Automatically logs your search queries.
- 🔐 **Secure Login**: Register and log in with JWT authentication.
- 🌐 **Responsive Design**: Optimized for all screen sizes using React-Bootstrap.

---

## 🧰 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [SWR](https://swr.vercel.app/) (Data fetching)
- [Jotai](https://jotai.org/) (Global state for favourites/history)
- [The Met Museum API](https://metmuseum.github.io/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [JWT + Passport](https://www.passportjs.org/)
- [Vercel](https://vercel.com/) (Deployment)

---

## 🚀 Getting Started

### 1. Clone This Repository
```bash
git clone https://github.com/pbnguyen0121/met-museum-explorer.git
cd met-museum-explorer

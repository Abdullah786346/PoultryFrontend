# How to Separate Frontend and Backend Repositories

This guide explains how to split this directory into two separate GitHub repositories (one for the React frontend, and one for the Express backend) and deploy them.

---

## Part 1: Push Backend to a Separate GitHub Repo

Your backend files are located inside the `backend/` directory.

1. **Open a new terminal window** and navigate into the `backend/` folder:
   ```bash
   cd backend
   ```
2. **Initialize Git** in this directory:
   ```bash
   git init
   ```
3. **Add and commit all backend files**:
   ```bash
   git add .
   git commit -m "Initialize standalone backend repository"
   ```
4. **Create a new repository on GitHub** (e.g., named `poultry-science-backend`).
5. **Link and push** to your new GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/poultry-science-backend.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 2: Push Frontend to a Separate GitHub Repo

Your frontend files are located inside the `frontend/` directory.

1. **Open a new terminal window** and navigate into the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. **Initialize Git** in this directory:
   ```bash
   git init
   ```
3. **Add and commit all frontend files**:
   ```bash
   git add .
   git commit -m "Configure frontend with dynamic API URLs"
   ```
4. **Create a new repository on GitHub** (e.g., named `poultry-science-frontend`).
5. **Link and push** to your new GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/poultry-science-frontend.git
   git branch -M main
   git push -u origin main
   ```

---

## Part 3: Deploy Backend on Render / Railway

Because Vercel does not host persistent Express servers for free, you should host your backend repository on a platform like **Render.com** (which has a free web service tier):

1. Log in to [Render.com](https://render.com) and click **New** -> **Web Service**.
2. Connect your backend GitHub repository (`poultry-science-backend`).
3. Set the following settings:
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Add the following **Environment Variables** in the Render settings:
   * `PORT` = `5000` (Render will override this automatically, which is fine)
   * `MONGO_URI` = `your_mongodb_connection_string` (Make sure your password is correct!)
   * `JWT_SECRET` = `your_jwt_secret_key`
   * `CLOUD_NAME` = `your_cloudinary_name`
   * `CLOUD_API_KEY` = `your_cloudinary_api_key`
   * `CLOUD_API_SECRET` = `your_cloudinary_api_secret`
   * `FRONTEND_URL` = `https://your-frontend.vercel.app` (Your Vercel live site URL)
5. Deploy the service and copy the live URL (e.g., `https://poultry-science-backend.onrender.com`).

---

## Part 4: Connect Vercel Frontend to the Backend

1. Go to your **Vercel Dashboard** and select your frontend project.
2. Go to **Settings** -> **Environment Variables**.
3. Add a new variable:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: `https://poultry-science-backend.onrender.com` (Your live backend URL from Render)
4. Trigger a new deployment on Vercel so the frontend builds with the new API URL.

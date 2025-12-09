# Favorites Feature Implementation

## Overview
This document describes the implementation of the Favorites feature for the Betonushi Vietnamese food application. This feature allows authenticated users to add, remove, and view their favorite dishes.

## Features Implemented

### 1. Backend Implementation

#### Database Schema
- **Migration File**: `backend/src/migration/004_create_user_favorites_table.sql`
- **Table**: `user_favorites`
  - `id` (SERIAL PRIMARY KEY)
  - `user_id` (INTEGER, FK to users table)
  - `food_id` (INTEGER, FK to food table)
  - `created_at` (TIMESTAMP)
  - Unique constraint on (user_id, food_id) to prevent duplicates
  - Indexes on user_id and food_id for performance

#### Model Layer
- **File**: `backend/src/models/favoriteModel.js`
- **Functions**:
  - `addFavorite(userId, foodId)` - Add a dish to favorites
  - `removeFavorite(userId, foodId)` - Remove a dish from favorites
  - `getFavoritesByUserId(userId)` - Get all favorites with full food details
  - `isFavorite(userId, foodId)` - Check if a dish is favorited
  - `getFavoritesStatus(userId, foodIds)` - Batch check favorite status for multiple dishes

#### Controller Layer
- **File**: `backend/src/controllers/favoriteController.js`
- **Endpoints**:
  - `POST /api/favorites` - Add to favorites
  - `DELETE /api/favorites/:foodId` - Remove from favorites
  - `GET /api/favorites` - Get all favorites
  - `GET /api/favorites/:foodId` - Check if specific food is favorited
  - `GET /api/favorites/status?foodIds=1,2,3` - Get favorite status for multiple foods

#### Routes
- **File**: `backend/src/routes/favoriteRoutes.js`
- All routes require authentication via `authMiddleware`
- Mounted at `/api/favorites` in `app.js`

### 2. Frontend Implementation

#### API Client
- **File**: `frontend/src/api/favorite.api.ts`
- Type-safe API functions for all favorite operations
- Interfaces for Favorite data structures

#### State Management
- **File**: `frontend/src/context/FavoritesContext.tsx`
- **Features**:
  - Maintains Set of favorited food IDs for quick lookup
  - Stores full favorite food details
  - Optimistic updates for instant UI feedback
  - Auto-loads favorites on user login
  - Batch status loading for multiple dishes
  - Error handling with rollback on failure

#### Components

##### FavoriteButton Component
- **File**: `frontend/src/components/FavoriteButton.tsx`
- **Props**:
  - `foodId` - ID of the food item
  - `variant` - Size variant (compact, default, large)
  - `showLabel` - Toggle text label display
  - `className` - Custom styling
- **Features**:
  - Heart icon that fills when favorited
  - Only visible when user is logged in
  - Smooth animations and hover effects
  - Prevents event bubbling when used in card links

##### FavoritesPage
- **File**: `frontend/src/pages/FavoritesPage.tsx`
- **Features**:
  - Grid layout displaying all favorite dishes
  - Shows food images, ratings, and story preview
  - Links to food detail pages
  - Empty state with call-to-action
  - Login prompt for unauthenticated users
  - Loading state during data fetch

#### Integration Points

##### Header Component
- **Updated**: `frontend/src/components/Header.tsx`
- Added heart icon button with badge showing favorite count
- Links to `/favorites` page
- Only visible when logged in

##### FoodDetailPage
- **Updated**: `frontend/src/pages/FoodDetailPage.tsx`
- Replaced manual favorite button with FavoriteButton component
- Removed local state management
- Shows label on larger variant

##### MenuPage
- **Updated**: `frontend/src/pages/MenuPage.tsx`
- Added FavoriteButton to each food card
- Compact variant positioned in top-right corner
- Removed old like toggle logic

#### Routing
- **Updated**: `frontend/src/App.tsx`
- Added route: `/favorites` → `FavoritesPage`
- Added fallback route: `/food/:id` → `FoodDetailPage`

#### App Setup
- **Updated**: `frontend/src/main.tsx`
- Wrapped app with `FavoritesProvider` inside `AuthProvider`
- Ensures favorites context has access to auth state

### 3. Internationalization

Added translations for all three supported languages:

#### Japanese (ja)
```json
{
  "favorites": {
    "title": "お気に入り",
    "subtitle": "あなたのお気に入りのベトナム料理",
    "empty": {
      "title": "まだお気に入りの料理がありません",
      "description": "料理のページで♡ボタンを押してお気に入りに追加しましょう",
      "button": "料理を探す"
    },
    "count": "{{count}}件のお気に入り",
    "button": {
      "add": "お気に入り登録",
      "remove": "お気に入り登録済"
    },
    "login_required": "お気に入りを見るにはログインしてください"
  }
}
```

#### English (en)
- "Add to Favorites" / "Favorited"
- Empty state messages
- Login required prompt

#### Vietnamese (vi)
- "Thêm vào yêu thích" / "Đã yêu thích"
- Vietnamese translations for all UI text

## Technical Decisions

### 1. Optimistic Updates
- UI updates immediately when toggling favorites
- If API call fails, state is rolled back
- Provides instant feedback to users

### 2. State Management
- Used React Context API for global favorites state
- Set data structure for O(1) favorite status lookups
- Separate array for full favorite food data

### 3. Authentication Integration
- All favorite operations require authentication
- UI elements hidden when user is not logged in
- Automatic state reset on logout

### 4. Performance Optimizations
- Database indexes on user_id and food_id
- Batch status checking to reduce API calls
- Memoized callbacks in React hooks
- ON CONFLICT DO NOTHING to handle race conditions

### 5. Database Design
- Foreign keys with CASCADE delete
- Unique constraint prevents duplicate favorites
- Timestamps for potential "recently favorited" features

## Usage Instructions

### Database Setup
1. Ensure PostgreSQL is running and credentials are configured in `.env`
2. Run migration: `cd backend && node run_migration.js`
3. Verify table creation: `SELECT * FROM user_favorites;`

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Testing the Feature
1. **Login**: Navigate to `/login` and sign in
2. **Browse Foods**: Go to `/foods` to see the menu
3. **Add Favorites**: Click heart buttons on food cards
4. **View Detail**: Click a food card to see details
5. **Toggle on Detail**: Use the favorite button on detail page
6. **View Favorites**: Click heart icon in header or navigate to `/favorites`
7. **Remove Favorites**: Click filled heart on any favorite item

## API Documentation

### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodId": 1
}
```

### Remove from Favorites
```http
DELETE /api/favorites/:foodId
Authorization: Bearer <token>
```

### Get All Favorites
```http
GET /api/favorites
Authorization: Bearer <token>
```

### Check Single Favorite
```http
GET /api/favorites/:foodId
Authorization: Bearer <token>
```

### Batch Status Check
```http
GET /api/favorites/status?foodIds=1,2,3
Authorization: Bearer <token>
```

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── favoriteController.js     # API handlers
│   ├── models/
│   │   └── favoriteModel.js          # Database operations
│   ├── routes/
│   │   └── favoriteRoutes.js         # Route definitions
│   ├── migration/
│   │   └── 004_create_user_favorites_table.sql
│   └── app.js                         # Updated with favorites routes

frontend/
├── src/
│   ├── api/
│   │   └── favorite.api.ts           # API client
│   ├── components/
│   │   ├── FavoriteButton.tsx        # Reusable button
│   │   └── Header.tsx                # Updated with heart icon
│   ├── context/
│   │   └── FavoritesContext.tsx      # State management
│   ├── pages/
│   │   ├── FavoritesPage.tsx         # Favorites list page
│   │   ├── FoodDetailPage.tsx        # Updated with button
│   │   └── MenuPage.tsx              # Updated with buttons
│   ├── App.tsx                        # Updated routing
│   └── main.tsx                       # Updated providers
└── public/
    └── locales/
        ├── en/translation.json        # English translations
        ├── ja/translation.json        # Japanese translations
        └── vi/translation.json        # Vietnamese translations
```

## Definition of Done (DoD) Verification

✅ **1. Button visibility matches login state**
- Heart button only appears when user is logged in
- Verified in Header, MenuPage, and FoodDetailPage

✅ **2. Add/Remove reflects in UI and DB**
- Optimistic updates provide instant feedback
- Backend persists changes to database
- Error handling with rollback if API fails

✅ **3. Favorites list displays correct data**
- FavoritesPage fetches and displays all favorites
- Shows full food details (image, name, rating, story)
- Empty state when no favorites exist

✅ **4. API and UI work correctly**
- All API endpoints implemented and protected
- Frontend properly calls APIs with authentication
- Error handling throughout the stack

## Future Enhancements

Potential improvements for future iterations:

1. **Favorites Count on Food Cards**
   - Show how many users favorited each dish

2. **Sort and Filter Favorites**
   - Sort by date added, rating, name
   - Filter by category or ingredients

3. **Share Favorites**
   - Generate shareable links to favorite lists

4. **Recommendations**
   - Suggest dishes based on favorites

5. **Favorite Collections**
   - Group favorites into custom collections/folders

6. **Activity Feed**
   - Show when friends favorite dishes

7. **Export Favorites**
   - Download favorites as PDF or share via email

## Troubleshooting

### Database Connection Issues
- Check `.env` file has correct database credentials
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Test connection: `psql -U <username> -d <database>`

### Favorites Not Saving
- Check browser console for API errors
- Verify authentication token is valid
- Check backend logs for database errors

### UI Not Updating
- Clear browser cache and reload
- Check React DevTools for context state
- Verify FavoritesProvider is wrapping the app

### Migration Fails
- Check if table already exists
- Verify foreign key references (users and food tables must exist)
- Check PostgreSQL version compatibility

## Conclusion

The Favorites feature has been successfully implemented with:
- Complete backend API with database persistence
- Reactive frontend with optimistic updates
- Authentication integration
- Full internationalization support
- Clean, maintainable code architecture

All requirements from the Definition of Done have been met.

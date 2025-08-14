# Barrel Export System - Usage Guide

This document explains how to use the new barrel export system that has been implemented in the project.

## What are Barrel Exports?

Barrel exports are index.ts files that re-export multiple modules from a directory, allowing you to import multiple items from a single entry point instead of multiple import statements.

## Before vs After

### Before (Multiple Imports)
```typescript
import { useCartStore } from "@/stores/cartStore";
import { useLikeStore } from "@/stores/likeStore";
import { login } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/authStore";
```

### After (Barrel Imports)
```typescript
import { useCartStore, useLikeStore } from "@/stores";
import { login, useAuthStore } from "@/features/auth";
```

## Available Barrel Exports

### 1. Stores (`@/stores`)
- `useCartStore` - Cart state management
- `useLikeStore` - Favorites/likes state management
- `CartItem` - Cart item interface
- `LikeItem` - Like item interface

**Usage:**
```typescript
import { useCartStore, useLikeStore } from "@/stores";
```

### 2. Auth Features (`@/features/auth`)
- `login` - Login function
- `register` - Register function  
- `useAuthStore` - Auth state management
- `useLogout` - Logout hook
- `LoginDto` - Login data type
- `RegisterDto` - Register data type
- `AuthResponse` - Auth response type

**Usage:**
```typescript
import { login, register, useAuthStore, useLogout } from "@/features/auth";
```

### 3. All Features (`@/features`)
- Everything from `@/features/auth`

**Usage:**
```typescript
import { login, useAuthStore } from "@/features";
```

### 4. Library Utils (`@/lib`)
- `api` - Axios instance
- `tokenStorage` - Token storage utilities
- `API_BASE` - API base URL
- `AUTH_ENDPOINTS` - Auth endpoint URLs
- `ACCESS_TOKEN_KEY` - Access token key
- `REFRESH_TOKEN_KEY` - Refresh token key

**Usage:**
```typescript
import { api, tokenStorage, AUTH_ENDPOINTS } from "@/lib";
```

### 5. Components (`@/components`)
- `AuthGuard` - Auth protection component
- `AuthModal` - Authentication modal
- `Footer` - Footer component
- `Navbar` - Navigation component

**Usage:**
```typescript
import { AuthGuard, AuthModal, Footer, Navbar } from "@/components";
```

### 6. Main Entry (`@/`)
- Everything from all the above modules

**Usage:**
```typescript
import { useCartStore, login, AuthGuard, api } from "@/";
```

## File Structure

```
src/
├── index.ts                 # Main barrel export
├── components/
│   └── index.ts            # Components barrel export
├── features/
│   ├── index.ts            # Features barrel export  
│   └── auth/
│       └── index.ts        # Auth barrel export
├── lib/
│   └── index.ts            # Lib barrel export
└── stores/
    └── index.ts            # Stores barrel export
```

## Benefits

1. **Cleaner Imports**: Fewer import lines
2. **Better Organization**: Group related modules together
3. **Easier Refactoring**: Change internal structure without affecting imports
4. **Better IDE Support**: Autocomplete works better with barrel exports
5. **Consistent API**: Standardized way to import from each module

## Best Practices

1. **Use specific barrel exports** when possible:
   ```typescript
   // Good
   import { useCartStore, useLikeStore } from "@/stores";
   
   // Less preferred (though still valid)
   import { useCartStore, useLikeStore } from "@/";
   ```

2. **Keep related imports together**:
   ```typescript
   // Good - grouped by functionality
   import { useCartStore, useLikeStore } from "@/stores";
   import { login, useAuthStore } from "@/features/auth";
   
   // Less organized
   import { useCartStore } from "@/stores";
   import { login } from "@/features/auth";
   import { useLikeStore } from "@/stores";
   ```

3. **Update existing imports gradually** - the old imports still work, but new code should use barrel exports

## Migration Status

The following files have been updated to use barrel exports:
- ✅ `/src/app/cart/page.tsx`
- ✅ `/src/components/Navbar/page.tsx`
- ✅ `/src/app/favorites/page.tsx`
- ✅ `/src/app/products/page.tsx`
- ✅ `/src/app/products/[id]/page.tsx`
- ✅ `/src/app/login/page.tsx`
- ✅ `/src/app/register/page.tsx`
- ✅ `/src/components/AuthGuard.tsx`
- ✅ `/src/app/account/page.tsx`
- ✅ `/src/app/layout.tsx`
- ✅ `/src/features/auth/api.ts`
- ✅ `/src/features/auth/authStore.ts`

Other files still use the old import style but will continue to work.

# 👥 Takım Geliştirme Rehberi - EaseShop

## 🚀 Yeni Geliştirici Onboarding

### 📋 **1. Projeyi Clone Etme**

```bash
# 1. Repository'yi clone edin
git clone https://github.com/mertdrmz/easeshop.git

# 2. Proje klasörüne girin  
cd easeshop

# 3. Bağımlılıkları yükleyin
npm install

# 4. Development server'ı başlatın
npm run dev
```

### 🔧 **2. Geliştirme Ortamı Kurulumu**

**Gerekli Tools:**
- **Node.js**: v18.0.0 veya üzeri
- **npm**: v8.0.0 veya üzeri  
- **Git**: v2.30.0 veya üzeri
- **VSCode**: (önerilen) + önerilen extensionlar

**VSCode Extensions:**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next", 
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag"
  ]
}
```

### ⚙️ **3. Proje Yapısını Anlama**

```
src/app/
├── components/     # Shared components
├── stores/        # Zustand stores  
├── HomePage/      # Home page components
├── products/      # Product pages
├── cart/         # Shopping cart
├── checkout/     # Checkout process
└── globals.css   # Global styles
```

---

## 🌿 Git Workflow - Branch Strategy

### 📊 **Branch Yapısı**

```
main (production-ready)
├── develop (integration branch)
├── feature/user-profile
├── feature/payment-integration  
├── feature/admin-panel
├── hotfix/cart-bug
└── release/v1.1.0
```

### 🔄 **Geliştirme Süreci**

#### **1. Yeni Feature Geliştirme**

```bash
# 1. Ana branch'den güncel kodu çekin
git checkout main
git pull origin main

# 2. Yeni feature branch oluşturun
git checkout -b feature/kullanici-profili

# 3. Geliştirme yapın ve commit edin
git add .
git commit -m "feat: user profile page implementation"

# 4. Remote'a push edin
git push -u origin feature/kullanici-profili

# 5. GitHub'da Pull Request oluşturun
```

#### **2. Günlük Geliştirme Routine**

```bash
# Sabah - güncel kodu çekme
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main  # veya git rebase main

# Akşam - günün çalışmasını push etme
git add .
git commit -m "feat: implement shopping cart logic"
git push origin feature/your-branch
```

### 📝 **Commit Message Standartları**

**Format:** `type(scope): description`

**Types:**
- **feat:** Yeni özellik
- **fix:** Bug düzeltme
- **docs:** Dokümantasyon
- **style:** Code formatting
- **refactor:** Code restructuring
- **test:** Test ekleme
- **chore:** Build/config değişiklikleri

**Örnekler:**
```bash
feat(cart): add quantity update functionality
fix(auth): resolve login modal validation issue  
docs(readme): update installation instructions
style(navbar): improve responsive design
refactor(store): migrate from Context to Zustand
test(products): add unit tests for product listing
chore(deps): update Next.js to version 15.4.5
```

---

## 🔀 Pull Request (PR) Süreci

### 📋 **PR Oluşturma Checklist**

**Geliştirici (PR Creator):**
- [ ] Code locally test edildi
- [ ] `npm run build` başarılı
- [ ] `npm run lint` clean
- [ ] Conflicts resolve edildi
- [ ] Description detaylı yazıldı
- [ ] Screenshots/GIFs eklendi (UI değişiklikleri için)

**PR Template:**
```markdown
## 🚀 Changes
- Feature/bug açıklaması
- Yapılan değişiklikler listesi

## 🧪 Testing
- [ ] Local testing completed
- [ ] Manual testing scenarios
- [ ] Edge cases covered

## 📸 Screenshots
<!-- UI değişiklikleri varsa ekleyin -->

## 📝 Notes
- Breaking changes
- Migration notes  
- Dependencies added/removed
```

### 👀 **Code Review Süreci**

**Reviewer Checklist:**
- [ ] **Code Quality:** Clean, readable, maintainable
- [ ] **Performance:** No unnecessary re-renders
- [ ] **Accessibility:** ARIA labels, keyboard navigation
- [ ] **Security:** No sensitive data exposure
- [ ] **Testing:** Adequate test coverage
- [ ] **Documentation:** README/comments updated

**Review Comments:**
```markdown
# Öneriler
💡 **Suggestion:** Daha iyi bir yaklaşım
⚠️ **Warning:** Potansiyel problem
❗ **Must fix:** Düzeltilmesi gereken
✅ **Approved:** Onaylandı
```

---

## 🔧 Development Standards

### 📐 **Code Standards**

**TypeScript:**
```typescript
// ✅ Good
interface ProductProps {
  id: string;
  name: string;
  price: number;
}

const Product: React.FC<ProductProps> = ({ id, name, price }) => {
  return <div>{name} - {price}₺</div>;
};

// ❌ Bad
const Product = (props: any) => {
  return <div>{props.name} - {props.price}</div>;
};
```

**Component Structure:**
```typescript
// ✅ Recommended structure
"use client"; // Only if interactive

import React, { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';

interface ComponentProps {
  // Props types
}

export default function Component({ prop }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const storeData = useCartStore((state) => state.data);
  
  // 2. Functions
  const handleClick = () => {
    // Logic
  };
  
  // 3. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### 🎨 **Styling Guidelines**

**Tailwind CSS Patterns:**
```tsx
// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// ✅ Component states  
<button className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400">

// ✅ Consistent spacing
<div className="p-4 md:p-6 lg:p-8">

// ❌ Avoid inline styles (use Tailwind)
<div style={{ padding: '16px', margin: '8px' }}>
```

### 🏪 **State Management**

**Zustand Store Pattern:**
```typescript
// ✅ Good store structure
interface StoreState {
  data: DataType[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  addItem: (item: DataType) => void;
  updateItem: (id: string, updates: Partial<DataType>) => void;
}

// ✅ Component usage
const data = useStore((state) => state.data);
const addItem = useStore((state) => state.addItem);

// ❌ Avoid destructuring entire store
const { data, loading, error, fetchData } = useStore();
```

---

## 🚨 Conflict Resolution

### 🔀 **Merge Conflicts**

**Adım 1: Güncel kodu çekin**
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

**Adım 2: Conflict'leri resolve edin**
```bash
# Konflikt dosyalarını düzenleyin
# <<<<<<< HEAD
# Your changes
# =======  
# Incoming changes
# >>>>>>> main

git add .
git commit -m "resolve: merge conflicts with main"
```

**Adım 3: Push ve PR güncelleyin**
```bash
git push origin your-branch
```

### 🆘 **Common Issues**

**Issue 1: Package conflicts**
```bash
# Çözüm
rm -rf node_modules package-lock.json
npm install
```

**Issue 2: Git conflicts**
```bash  
# Reset to clean state
git stash
git pull origin main
git stash pop
```

**Issue 3: Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📊 Project Management

### 🏷️ **Issue Labels**

- `bug` - Bug reports
- `enhancement` - Feature requests  
- `documentation` - Docs updates
- `good first issue` - Yeni geliştiriciler için
- `help wanted` - Yardım istenen
- `priority: high` - Acil
- `priority: medium` - Normal
- `priority: low` - Düşük öncelik

### 📋 **Sprint Planning**

**Weekly Sprint Cycle:**
- **Monday:** Sprint planning & task assignment
- **Wednesday:** Mid-sprint check-in
- **Friday:** Sprint review & retrospective

**Task Estimation:**
- **S (Small):** 1-2 saat
- **M (Medium):** 3-5 saat  
- **L (Large):** 1-2 gün
- **XL (Extra Large):** 3+ gün

---

## 🛡️ Quality Assurance

### ✅ **Pre-commit Checklist**

```bash
# Automated checks
npm run lint          # ESLint check
npm run type-check    # TypeScript check
npm run build        # Build verification
npm run test         # Run tests (when added)
```

### 📈 **Performance Monitoring**

**Development:**
```bash
# Bundle analysis
npm run analyze

# Performance audit
npm run audit
```

**Key Metrics:**
- **Bundle Size:** < 200KB
- **LCP:** < 2.1s
- **FID:** < 100ms
- **CLS:** < 0.1

---

## 🤝 Team Communication

### 💬 **Communication Channels**

- **GitHub Issues:** Bug reports, feature requests
- **GitHub Discussions:** Architectural decisions  
- **Pull Requests:** Code review discussions
- **Wiki:** Technical documentation

### 📞 **Regular Meetings**

- **Daily Standups:** Progress updates
- **Weekly Code Review:** Architecture discussions
- **Monthly Retrospective:** Process improvements

---

## 📚 Resources

### 🔗 **Important Links**

- **Repository:** https://github.com/mertdrmz/easeshop
- **Live Demo:** [Deploy URL]
- **Documentation:** This file + README.md
- **Performance Dashboard:** [Monitoring URL]

### 📖 **Learning Resources**

- **Next.js Docs:** https://nextjs.org/docs
- **Zustand Guide:** https://github.com/pmndrs/zustand
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

## ⚡ Quick Commands

```bash
# Daily workflow
npm run dev           # Start development
npm run build         # Production build
npm run lint          # Check code quality
npm run type-check    # TypeScript validation

# Git workflow  
git checkout main && git pull    # Update main
git checkout -b feature/name     # New feature
git add . && git commit          # Save changes
git push origin feature/name     # Share progress

# Emergency commands
npm run clean         # Clean build cache
npm run reinstall     # Fresh install
npm run reset         # Reset to main
```

---

**Happy Team Coding!** 👥⚡

*Bu dokuman takım geliştirme sürecinin tüm aşamalarını kapsar. Sorularınız için GitHub Discussions kullanın.*
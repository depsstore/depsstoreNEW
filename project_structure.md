# 📁 depsstoreNew - Project Structure

*Generated on: 8/16/2026, 3:33:18 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 148 |
| 📁 Total Folders | 47 |
| 🌳 Max Depth | 7 levels |
| 🛠️ Tech Stack | CSS, Sass/SCSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔵 📝 **CHANGELOG.md** - Change log
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation

## 📊 File Statistics

### By File Type

- 🌐 **.html** (HTML files): 26 files (17.6%)
- 📜 **.js** (JavaScript files): 24 files (16.2%)
- 🎨 **.scss** (Sass stylesheets): 24 files (16.2%)
- 🖼️ **.jpg** (JPEG images): 14 files (9.5%)
- 🎨 **.svg** (SVG images): 13 files (8.8%)
- 📖 **.md** (Markdown files): 9 files (6.1%)
- 🎨 **.css** (Stylesheets): 6 files (4.1%)
- 🔤 **.ttf** (TrueType fonts): 6 files (4.1%)
- 🔤 **.woff** (Web fonts): 6 files (4.1%)
- 📄 **.eot** (Other files): 5 files (3.4%)
- 🔤 **.woff2** (Web fonts): 5 files (3.4%)
- ⚙️ **.json** (JSON files): 3 files (2.0%)
- 📄 **.** (Other files): 2 files (1.4%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.7%)
- ⚙️ **.yml** (YAML files): 1 files (0.7%)
- 🖼️ **.png** (PNG images): 1 files (0.7%)
- 📄 **.lock** (Other files): 1 files (0.7%)
- 📄 **.txt** (Text files): 1 files (0.7%)

### By Category

- **Assets**: 45 files (30.4%)
- **Styles**: 30 files (20.3%)
- **Web**: 26 files (17.6%)
- **JavaScript**: 24 files (16.2%)
- **Docs**: 10 files (6.8%)
- **Other**: 8 files (5.4%)
- **Config**: 4 files (2.7%)
- **DevOps**: 1 files (0.7%)

### 📁 Largest Directories

- **root**: 148 files
- **src**: 144 files
- **src\template-admin**: 119 files
- **src\template-admin\src**: 108 files
- **src\template-admin\src\assets**: 85 files

## 🌳 Directory Structure

```
depsstoreNew/
├── 🌐 index.html
├── 📖 project_structure.md
├── 📜 proxy.js
├── 📁 src/
│   ├── 📂 backend/
│   │   ├── 📂 javascripts/
│   │   │   ├── 🧩 components/
│   │   │   │   ├── 📂 controllers/
│   │   │   │   │   ├── 📜 authController.js
│   │   │   │   │   ├── 📜 customerController.js
│   │   │   │   │   ├── 📜 orderController.js
│   │   │   │   │   ├── 📜 productController.js
│   │   │   │   │   └── 📜 supportController.js
│   │   │   │   └── 📂 models/
│   │   │   │   │   ├── 📜 customerModel.js
│   │   │   │   │   ├── 📜 orderModel.js
│   │   │   │   │   ├── 📜 productModel.js
│   │   │   │   │   └── 📜 userModel.js
│   │   │   └── 📂 server/
│   │   │   │   ├── 📜 api.js
│   │   │   │   ├── 📜 config.js
│   │   │   │   ├── 📜 middleware.js
│   │   │   │   ├── 📜 routes.js
│   │   │   │   └── 📜 utils.js
│   │   └── 📜 main.js
│   ├── 📂 frontend/
│   │   ├── 🌐 checkout.html
│   │   ├── 🌐 Guide.html
│   │   ├── 🌐 order-details.html
│   │   ├── 🌐 orders.html
│   │   ├── 🌐 products.html
│   │   ├── 🌐 support.html
│   │   └── 🎨 ui/
│   │   │   ├── 🎨 css/
│   │   │   │   └── 🎨 style.css
│   │   │   └── 📂 js/
│   │   │   │   ├── 📜 main.js
│   │   │   │   ├── 📜 products.js
│   │   │   │   └── 📜 sidebar.js
│   └── 📂 template-admin/
│   │   ├── 🟡 🚫 **.gitignore**
│   │   ├── 📄 .prettierignore
│   │   ├── 📄 .prettierrc
│   │   ├── ⚙️ .yarnrc.yml
│   │   ├── 🔵 📝 **CHANGELOG.md**
│   │   ├── 📜 gulpfile.js
│   │   ├── 🌐 index.html
│   │   ├── 🟡 🔒 **package-lock.json**
│   │   ├── 🔴 📦 **package.json**
│   │   ├── 🔴 📖 **README.md**
│   │   ├── 📁 src/
│   │   │   ├── 📦 assets/
│   │   │   │   ├── 📂 fonts/
│   │   │   │   │   ├── 📂 feather/
│   │   │   │   │   │   ├── 📄 feather.eot
│   │   │   │   │   │   ├── 🎨 feather.svg
│   │   │   │   │   │   ├── 🔤 feather.ttf
│   │   │   │   │   │   └── 🔤 feather.woff
│   │   │   │   │   ├── 🎨 feather.css
│   │   │   │   │   ├── 📂 fontawesome/
│   │   │   │   │   │   ├── 📄 fa-brands-400.eot
│   │   │   │   │   │   ├── 🎨 fa-brands-400.svg
│   │   │   │   │   │   ├── 🔤 fa-brands-400.ttf
│   │   │   │   │   │   ├── 🔤 fa-brands-400.woff
│   │   │   │   │   │   ├── 🔤 fa-brands-400.woff2
│   │   │   │   │   │   ├── 📄 fa-regular-400.eot
│   │   │   │   │   │   ├── 🎨 fa-regular-400.svg
│   │   │   │   │   │   ├── 🔤 fa-regular-400.ttf
│   │   │   │   │   │   ├── 🔤 fa-regular-400.woff
│   │   │   │   │   │   ├── 🔤 fa-regular-400.woff2
│   │   │   │   │   │   ├── 📄 fa-solid-900.eot
│   │   │   │   │   │   ├── 🎨 fa-solid-900.svg
│   │   │   │   │   │   ├── 🔤 fa-solid-900.ttf
│   │   │   │   │   │   ├── 🔤 fa-solid-900.woff
│   │   │   │   │   │   └── 🔤 fa-solid-900.woff2
│   │   │   │   │   ├── 🎨 fontawesome.css
│   │   │   │   │   ├── 📂 material/
│   │   │   │   │   │   └── 🔤 material.woff2
│   │   │   │   │   ├── 🎨 material.css
│   │   │   │   │   ├── 📂 phosphor/
│   │   │   │   │   │   └── 📂 duotone/
│   │   │   │   │   │   │   ├── 🎨 Phosphor.svg
│   │   │   │   │   │   │   ├── 🔤 Phosphor.ttf
│   │   │   │   │   │   │   ├── 🔤 Phosphor.woff
│   │   │   │   │   │   │   ├── ⚙️ selection.json
│   │   │   │   │   │   │   └── 🎨 style.css
│   │   │   │   │   ├── 📂 tabler/
│   │   │   │   │   │   ├── 📄 tabler-icons.eot
│   │   │   │   │   │   ├── 🎨 tabler-icons.svg
│   │   │   │   │   │   ├── 🔤 tabler-icons.ttf
│   │   │   │   │   │   ├── 🔤 tabler-icons.woff
│   │   │   │   │   │   └── 🔤 tabler-icons.woff2
│   │   │   │   │   └── 🎨 tabler-icons.min.css
│   │   │   │   ├── 🖼️ images/
│   │   │   │   │   ├── 🎨 favicon.svg
│   │   │   │   │   ├── 📂 landing/
│   │   │   │   │   │   └── 🖼️ img-header-moke.png
│   │   │   │   │   ├── 📂 layout/
│   │   │   │   │   │   └── 🎨 nav-card-bg.svg
│   │   │   │   │   ├── 🎨 logo-dark.svg
│   │   │   │   │   ├── 🎨 logo-white.svg
│   │   │   │   │   ├── 📂 user/
│   │   │   │   │   │   ├── 🖼️ avatar-1.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-10.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-2.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-3.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-4.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-5.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-6.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-7.jpg
│   │   │   │   │   │   ├── 🖼️ avatar-8.jpg
│   │   │   │   │   │   └── 🖼️ avatar-9.jpg
│   │   │   │   │   └── 📂 widget/
│   │   │   │   │   │   ├── 🎨 img-status-4.svg
│   │   │   │   │   │   ├── 🎨 img-status-5.svg
│   │   │   │   │   │   ├── 🎨 img-status-6.svg
│   │   │   │   │   │   ├── 🖼️ p1.jpg
│   │   │   │   │   │   ├── 🖼️ p2.jpg
│   │   │   │   │   │   ├── 🖼️ p3.jpg
│   │   │   │   │   │   └── 🖼️ p4.jpg
│   │   │   │   ├── 📂 js/
│   │   │   │   │   ├── 📂 fonts/
│   │   │   │   │   │   └── 📜 custom-font.js
│   │   │   │   │   ├── 📄 pages/
│   │   │   │   │   │   └── 📜 dashboard-sales.js
│   │   │   │   │   ├── 📜 script.js
│   │   │   │   │   └── 📜 theme.js
│   │   │   │   ├── 📂 json/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   └── 📂 scss/
│   │   │   │   │   ├── 🎨 landing.scss
│   │   │   │   │   ├── 📂 settings/
│   │   │   │   │   │   ├── 🎨 _bootstrap-variables.scss
│   │   │   │   │   │   ├── 🎨 _color-variables.scss
│   │   │   │   │   │   └── 🎨 _theme-variables.scss
│   │   │   │   │   ├── 🎨 style-preset.scss
│   │   │   │   │   ├── 🎨 style.scss
│   │   │   │   │   └── 📂 themes/
│   │   │   │   │   │   ├── 🎨 _general.scss
│   │   │   │   │   │   ├── 🎨 _generic.scss
│   │   │   │   │   │   ├── 🧩 components/
│   │   │   │   │   │   │   ├── 🎨 _avtar.scss
│   │   │   │   │   │   │   ├── 🎨 _badge.scss
│   │   │   │   │   │   │   ├── 🎨 _button.scss
│   │   │   │   │   │   │   ├── 🎨 _card.scss
│   │   │   │   │   │   │   ├── 🎨 _dropdown.scss
│   │   │   │   │   │   │   ├── 🎨 _form.scss
│   │   │   │   │   │   │   ├── 🎨 _progress.scss
│   │   │   │   │   │   │   ├── 🎨 _table.scss
│   │   │   │   │   │   │   ├── 🎨 _tabs.scss
│   │   │   │   │   │   │   └── 🎨 _widget.scss
│   │   │   │   │   │   ├── 📂 layouts/
│   │   │   │   │   │   │   ├── 🎨 _pc-common.scss
│   │   │   │   │   │   │   ├── 🎨 _pc-footer.scss
│   │   │   │   │   │   │   ├── 🎨 _pc-header.scss
│   │   │   │   │   │   │   └── 🎨 _pc-sidebar.scss
│   │   │   │   │   │   └── 📄 pages/
│   │   │   │   │   │   │   ├── 🎨 _authentication.scss
│   │   │   │   │   │   │   └── 🎨 _icon-pages.scss
│   │   │   └── 📂 html/
│   │   │   │   ├── 📂 admins/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   ├── 📂 application/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   ├── 📂 chart/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   ├── 📂 dashboard/
│   │   │   │   │   └── 🌐 index.html
│   │   │   │   ├── 📂 demo/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   ├── 📂 elements/
│   │   │   │   │   ├── 🌐 bc_color.html
│   │   │   │   │   ├── 🌐 bc_typography.html
│   │   │   │   │   └── 🌐 icon-feather.html
│   │   │   │   ├── 📂 forms/
│   │   │   │   │   └── 🔴 📖 **README.md**
│   │   │   │   ├── 🌐 index.html
│   │   │   │   ├── 📂 layouts/
│   │   │   │   │   ├── 🌐 breadcrumb.html
│   │   │   │   │   ├── 🌐 footer-block.html
│   │   │   │   │   ├── 🌐 footer-js.html
│   │   │   │   │   ├── 🌐 head-css.html
│   │   │   │   │   ├── 🌐 head-page-meta.html
│   │   │   │   │   ├── 🌐 header-content.html
│   │   │   │   │   ├── 🌐 layout-vertical.html
│   │   │   │   │   ├── 🌐 loader.html
│   │   │   │   │   ├── 🌐 sidebar.html
│   │   │   │   │   └── 🌐 topbar.html
│   │   │   │   ├── 📂 other/
│   │   │   │   │   └── 🌐 sample-page.html
│   │   │   │   └── 📄 pages/
│   │   │   │   │   ├── 🌐 login-v1.html
│   │   │   │   │   └── 🌐 register-v1.html
│   │   └── 📄 yarn.lock
└── 📄 struktur apps scritps.txt
```

## 📖 Legend

### File Types
- 🌐 Web: HTML files
- 📖 Docs: Markdown files
- 📜 JavaScript: JavaScript files
- 🎨 Styles: Stylesheets
- 🚫 DevOps: Git ignore
- 📄 Other: Other files
- ⚙️ Config: YAML files
- ⚙️ Config: JSON files
- 🎨 Assets: SVG images
- 🔤 Assets: TrueType fonts
- 🔤 Assets: Web fonts
- 🔤 Assets: Web fonts
- 🖼️ Assets: PNG images
- 🖼️ Assets: JPEG images
- 🎨 Styles: Sass stylesheets
- 📄 Docs: Text files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files

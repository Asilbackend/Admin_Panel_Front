#
## Node versiyasini tanlang
#FROM node:18
#
## Ishchi katalogini yarating
#WORKDIR /app
#
## Paketlar va ilova kodini nusxalash
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#
## Portni ochish
#EXPOSE 3000
#
## Ilovani ishga tushirish
#CMD ["npm", "start"]






# Boshlang'ich image
FROM node:18-alpine AS build

# App papkasini yaratish va unga kirish
WORKDIR /app

# package.json va package-lock.json fayllarni ko'chirish
COPY package*.json ./

# Kerakli paketlarni o'rnatish
RUN npm install

# Kod fayllarni ko'chirish
COPY . .

# App-ni build qilish
RUN npm run build

# Ikkinchi bosqich: Production uchun engillatilgan nginx image
FROM nginx:alpine

# Build qilingan fayllarni nginx html katalogiga ko'chirish
COPY --from=build /app/dist /usr/share/nginx/html/admin


# Portni expose qilish
EXPOSE 80

# Nginx serverni ishga tushirish
CMD ["nginx", "-g", "daemon off;"]



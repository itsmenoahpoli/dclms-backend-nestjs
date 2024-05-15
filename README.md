### OIE Document Control Log Management System

---

Installation and setup Guide

```bash
git clone  https://github.com/itsmenoahpoli/dclms-backend-nestjs.git

cd dclms-backend-nestjs

npm install

cp .env.example .env

npx prisma db push

npm run start:dev
```

<small>To view Swagger API documentation, open browser then go to `http://localhost:3000/docs/api`</small>

---

###### Default test accounts (password is `defaultpassword`)

<small>
superadmin-user-2024 <br />
documentcontroller-user-2024<br />
sb&a-user-2024<br />
se-user-2024<br />
sas-user-2024<br />
sc-user-2024<br />
qualitymanagementrepresentative-user-2024
</small>

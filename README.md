# Laravel + Angular Holidays
- Laravel 8
- Angular 15
## Installation
```
git clone https://github.com/OrxataGuy/HolidayLaravelAngular.git
cd HolidayLaravelAngular
```
### Back-end
```
cd holiday-scheduler-back
cp .env.example .env
// Fill the database configuration 
```
Once you have done this:
```
composer install
npm install
npm run prod // or npm run dev if it's for development
php artisan migrate:fresh
php artisan passport:install // This will provide you two keys, you have to copy them at the last two fields of the .env file (CLIENT_1 and CLIENT_2)
php artisan db:seed
php artisan serve
```

### Front-end
Once you have the back-end running, it's time to install the front-end. From the repository root folder, do:
```
cd holiday-scheduler-front
nano src/app/services/auth.service.ts
// You have to copy the 2nd key of the passport:install (CLIENT_2) on the login method, at "client_secret"
ng build // or ng serve if it's for development
```
You'll be able to use the app at `http://localhost:4200`.

## Credentials
| Email                   | Password        | Role     |
|-------------------------|-----------------|----------|
| john.doe@example.com    | JohnDoe.2023    | Employee |
| jane.doe@example.com    | JaneDoe.2023    | Employee |
| david.bowie@example.com | DavidBowie.2023 | Boss     |


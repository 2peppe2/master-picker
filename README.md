# LiU Master Picker 
This applications sets out to help students at Linköping University (LiU) choose their master's program. With an intuitive interface with drag-and-drop functionality, students can easily chose which courses to include during their decision making process.

![Master Picker screenshot](/screenshot.png)



> **⚠️ Warning, Software under development**
>
>- Currently the application is under active development. Features may be incomplete or subject to change. Please report any issues or feature requests on the GitHub repository.
>- The application is not yet optimized for mobile devices.
>- The application currently only supports the 
U-program at Linköping University.

## License
All rights reserved. Public for viewing only. No reuse without permission.

## Visit the Live Site
Currently the website is hosted live at https://www.masterpicker.se/. But if you want to run it locally pleasre run the instructions below.

## Run Locally
Clone the project

```bash
git clone https://github.com/2peppe2/master-picker
```

Go to the project directory
``` bash
cd master-picker
```
Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Set up the database

1. Create a `.env` file in the root directory with the following content:
```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=masterpicker

# Prisma Connection String
DATABASE_URL=postgresql://postgres:your_secure_password_here@localhost:5432/masterpicker?schema=public
```

2. Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

3. Run database migrations:
```bash
npm run migrate
# or
yarn migrate
# or
pnpm migrate
# or
bun migrate
```

4. Run database seeding:
```bash
npm run seed
# or
yarn seed
# or
pnpm seed
# or
bun seed
```

Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

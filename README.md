To install the express with typescript

```bash
yarn init
```

```bash
yarn add express
```

```bash
yarn add @types/express @types/node nodemon tsx typescript -D
```

```bash
npx tsc --init
```

Comment out the line in the tsconfig.json file

```bash
"outDir": "./dist",
"rootDir": "./src",
"lib": ["esnext"],
```

Also type:[] and target:"esnext" in the tsconfig.json file should be

```bash
"types": ["node"],
"target": "ES2017",
```

Also add the following in the tsconfig.json file

```bash
"moduleResolution": "nodenext",
"esModuleInterop": true,
```

Make src and dist folders

In src folder we will make a file called `app.ts` or `index.ts` and in dist folder we will be the compiled file in js as its in the tsconfig.json file 

Then make a file called `app.ts` or `index.ts` in src folder

The `main` field in package.json file should be `app.js` or `index.js`

Then add the 
```bash
"type": "module",
 "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec tsx src/app.ts",
    "build": "tsc"}
  ```

If you have server.ts file then you need to reconfigure the package.json file
```bash
"type": "module",
 "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc"}
  ```

In the `package.json` file we have the scripts to run the app in dev mode and build mode

To run the app in dev mode

```bash
yarn dev
```

To run the app in build mode

```bash
yarn build
```

To run the app in prod mode

```bash
yarn start
```

To add .env file
```bash
yarn add dotenv
```

Then create .env file in the root folder

To handle different environments (.env.development , .env.production) we can use dotenv-flow package instead of dotenv

```bash
yarn add dotenv-flow
```
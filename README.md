# Swachha

Digitizing the complete waste management flow from collection to developing more efficient waste management habits by utilizing machine learning technologies.
Transitioning to more echo friendly way of managing waste in developing countries like Nepal is hard and we aim to make it more seemless.
Be it by reporting those who litter without remorse or by classifying waste according to degradation nature.
Or be it by optimizing waste collection routines and routes rather than currently implemented timely collection.

## Setup

### Database

```bash
# Create database
psql> CREATE DATABASE swachha;
# Set DATABASE_URL in .env
```

### Google authentication

- https://console.cloud.google.com/
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in .env

### Khalti payment portal

- https://admin.khalti.com/
- Register for merchant account in khalti
- Set `KHALTI_PRIVATE_KEY` in .env

### ML Services

- Refer to [this](https://github.com/0xs3gfau1t/waste-ML) repo to setup ML services
- Set variables in `constants.ts` file

## Run

```bash
yarn
cp .env.example .env
yarn dev
```

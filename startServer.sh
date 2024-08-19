#!/bin/bash

# Check if "dist" directory exists, if not, run "yarn build"
if [ ! -d "dist" ]; then
    echo "Directory 'dist' not found. Running 'yarn build'..."
    yarn build
else
    echo "'dist' directory found."
fi

# Check if "node_modules/@generated" directory exists, if not, run "yarn generate"
if [ ! -d "node_modules/@generated" ]; then
    echo "Directory 'node_modules/@generated' not found. Running 'yarn generate'..."
    yarn generate
else
    echo "'node_modules/@generated' directory found."
fi

# Check if "prisma/migrations" directory exists, if not, prompt user to run "yarn migrate init"
if [ ! -d "prisma/migrations" ]; then
    read -p "Directory 'prisma/migrations' not found. Would you like to run 'yarn migrate init' to create the database? (yes/no): " migrate_response
    if [ "$migrate_response" == "yes" ]; then
        yarn migrate init
        read -p "Would you like to seed the database? (yes/no): " seed_response
        if [ "$seed_response" == "yes" ]; then
            yarn seed
        else
            echo "Skipping database seeding."
        fi
    else
        echo "Skipping database migration initialization."
    fi
else
    echo "'prisma/migrations' directory found."
fi

# Check if ".env.development" file exists, if not, print an error message
if [ ! -f ".env" ]; then
    echo "Error: .env file not found. Please ensure it is created and filled with necessary environment variables."
    exit 1
else
    echo ".env file found."
fi

echo "Starting the server..."
yarn start
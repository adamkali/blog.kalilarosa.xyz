#!/bin/bash

# Build and deploy Hugo site with custom commit message
# Usage: ./push.sh "your commit message"

if [ $# -eq 0 ]; then
    echo "Error: Commit message is required"
    echo "Usage: ./push.sh \"your commit message\""
    exit 1
fi

# Get the commit message from all arguments
COMMIT_MSG="$*"

echo "Building site..."
hugo --minify

if [ $? -ne 0 ]; then
    echo "Hugo build failed!"
    exit 1
fi

echo "Staging changes..."
git add -A

echo "Committing with message: $COMMIT_MSG"
git commit -am "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo "Commit failed!"
    exit 1
fi

echo "Pushing to remote..."
git push

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed!"
else
    echo "❌ Push failed!"
    exit 1
fi
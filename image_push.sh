#!/bin/bash

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
ECR_REPOSITORY_NAME=ai-chat-app-repo
ECR_REPOSITORY_URI=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}

echo "Account ID: $ACCOUNT_ID"
echo "Region: $REGION"
echo "ECR Repository Name: $ECR_REPOSITORY_NAME"

echo "Building docker image..."

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

(cd app && docker build --platform linux/amd64 -f ./Dockerfile -t ${ECR_REPOSITORY_NAME} .)
docker tag ${ECR_REPOSITORY_NAME}:latest ${ECR_REPOSITORY_URI}:latest
docker push ${ECR_REPOSITORY_URI}:latest

echo "Docker image built and pushed to ECR repository: ${ECR_REPOSITORY_URI}"

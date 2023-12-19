## ローカルビルド

```
export OPENAI_API_KEY=<YOUR OPENAI API KEY>
(cd app && docker image build --platform linux/arm64 . -t ai-chat-app:latest)
docker run -d -e OPENAI_API_KEY=${OPENAI_API_KEY} -p 3000:3000 ai-chat-app:latest
```

## デプロイ

[初回のみ] ECRのデプロイ
```
$ (cd cdk && npm ci)
$ (cd cdk && cdk deploy)
```

Docker Imageのpush
```
<!-- 初回のみ -->
chmod -x image_push.sh
<!-- push -->
./image_push.sh
```

##　AppRunner

1. リポジトリタイプをコンテナレジストリに設定
2. プロバイダーをAmazon ECRに設定
3. 以下をターミナルなどで実行して出力されるURIをコンテナイメージのURIに設定する
```
$ ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
$ REGION=$(aws configure get region)
$ ECR_REPOSITORY_NAME=ai-chat-app-repo
$ ECR_REPOSITORY_URI=${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}
$ echo ${ECR_REPOSITORY_URI}:latest
```

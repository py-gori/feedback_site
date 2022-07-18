# feedback_site

## docker-compose

### nginx

feedback_backend の Web サーバとして使用。  
【WEB ブラウザ】 → 【Nginx】 → 【uWSGI】 → 【Web アプリ】

### feedback_backend

Django Rest Framework

NGINX 側で CSS を読み込む為に、NGINX 側に static ファイルを配置する必要がある。  
$ python feedback_backend/manage.py collectstatic  
↑ で作成した static ディレクトリを NGINX に配置する

### feedback_front

React Hooks  
Typescript

### feedback_db

MySQL

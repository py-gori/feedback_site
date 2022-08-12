# feedback_site

## docker-compose

### nginx

feedback_app の Web サーバとして使用。  
【WEB ブラウザ】 → 【Nginx】 → 【uWSGI】 → 【Web アプリ】

### feedback_app

Django Rest Framework

NGINX 側で CSS を読み込む為に、NGINX 側に static ファイルを配置する必要がある。  
$ python manage.py collectstatic  
↑ で作成した static ディレクトリを NGINX に配置する

### feedback_front

React Hooks  
Typescript

### feedback_db

MySQL

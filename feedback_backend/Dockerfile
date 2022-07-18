FROM python:3.9.7
ENV PYTHONUNBUFFERED 1
RUN apt update && apt install -y sqlite3 vim less default-mysql-client
RUN mkdir /backend
WORKDIR /backend
ADD requirements.txt /backend/
RUN pip install -r requirements.txt
ADD . /backend/
ENTRYPOINT [ "bash", "entry_point.sh" ]
# CMD [ "python", "feedback_backend/manage.py", "runserver", "0.0.0.0:8000" ]
#CMD [ "uwsgi", "--http", ":8000", "--module", "feedback_backend.config.wsgi"]
CMD [ "uwsgi", "--ini", "/backend/uwsgi.ini"]
#CMD [ "uwsgi", "--socket", ":8001", "--chdir", "/backend/feedback_backend/", "--module", "config.wsgi"]

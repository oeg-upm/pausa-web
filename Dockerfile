FROM python:3.7-buster
RUN mkdir /geojsons; mkdir /result
COPY ./python/ /code/
RUN pip install -r /code/requirements.txt
ENTRYPOINT [ "python", "/code/daemon.py" ]
#RUN python /code/daemon.py

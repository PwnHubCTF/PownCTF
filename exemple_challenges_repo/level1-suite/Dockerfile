FROM alpine:3.16.0

ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /app/

RUN apk add socat python3

COPY ./chall.py /app/

RUN addgroup -S ctf && \
    adduser -S player -G ctf && \
    chmod u+s /app/chall.py


ARG FLAG
RUN echo "${FLAG}" >> /app/flag.txt

RUN chown player:ctf /app/chall.py
USER player

ENTRYPOINT ["socat","TCP-LISTEN:3000,reuseaddr,fork","EXEC:'python3.10 /app/chall.py',stderr"]
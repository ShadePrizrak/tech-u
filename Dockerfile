FROM node

WORKDIR /tech-u-app

COPY src/ /tech-u-app/src
COPY package.json /tech-u-app

ENV DB_HOST=ds059496.mlab.com:59496
ENV DB_NAME=tech-u
ENV DB_USER=tech-u-local
ENV DB_PASS=Elimperio_72
ENV SEED_JWT=AdacaF25aVasd23FkljnAS3mASDg
ENV CADUCIDAD_JWT=5m

RUN npm install --only=production

EXPOSE 3000

CMD ["npm","start"]


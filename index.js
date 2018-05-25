'use strict';

const catsList = [
  {
    imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg', 
    imageDescription: 'Crazy cat scratches a lot.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  },
  {
    imageURL:'http://78.media.tumblr.com/tumblr_lww24xmJ8R1qi6ga2o1_500.jpg', 
    imageDescription: 'Cat thinks it is a human.',
    name: 'Muppy',
    sex: 'Female',
    age: 6,
    breed: 'Sphinx',
    story: 'Thrown on the street'
  },
  {
    imageURL:'http://78.media.tumblr.com/tumblr_m06s3dcu3q1rohhvpo1_1280.jpg', 
    imageDescription: 'Maybe it really is human.',
    name: 'Rawr',
    sex: 'Male',
    age: 3,
    breed: 'Sphinx',
    story: 'Thrown on the street'
  },
  {
    imageURL:'http://78.media.tumblr.com/tumblr_m026ycZU4F1qjzfymo1_1280.jpg', 
    imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
    name: 'Chump',
    sex: 'Male',
    age: 10,
    breed: 'Dunno',
    story: 'Thrown on the street'
  },
  {
    imageURL:'http://78.media.tumblr.com/tumblr_m1l3wkeKuq1qargfho1_1280.jpg', 
    imageDescription: 'Crazy cat scratches a lot.',
    name: 'Fluffy',
    sex: 'Female',
    age: 2,
    breed: 'Bengal',
    story: 'Thrown on the street'
  }
]

const dogsList = [
  {
    imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Golden Retriever',
    story: 'Owner Passed away'
  },
  {
    imageURL: 'https://images.dog.ceo/breeds/bouvier/n02106382_4532.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Chompy',
    sex: 'Male',
    age: 7,
    breed: 'German Shephard',
    story: 'Owner killed by pet'
  },
  {
    imageURL: 'https://images.dog.ceo/breeds/doberman/n02107142_3575.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Nomnom',
    sex: 'Female',
    age: 10,
    breed: 'Chihuahua',
    story: 'Noisy dog needs new home'
  },
  {
    imageURL: 'https://images.dog.ceo/breeds/kelpie/n02105412_4669.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Tibbers',
    sex: 'Male',
    age: 7,
    breed: 'Lion',
    story: 'Owner claims it\'s a dog. Maybe it is.'
  },
  {
    imageURL: 'https://images.dog.ceo/breeds/pyrenees/n02111500_3011.jpg',
    imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
    name: 'Zeus',
    sex: 'Male',
    age: 3,
    breed: 'Golden Retriever',
    story: 'Owner Passed away'
  }
]

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const Queue = require('./queue')
let cats = new Queue();
let dogs = new Queue();

catsList.forEach((cat) => {
  cats.enqueue(cat)
})

dogsList.forEach((dog) => {
  dogs.enqueue(dog)
})

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(express.static('public'));

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cat', (req, res, next) => {
  res.json(cats.first.value)
})

app.delete('/api/cat', (req, res, next) => {
  cats.dequeue()
  cats.enqueue(catsList[Math.floor(Math.random()*(catsList.length-1))])
  res.json(cats.first.value)
})

app.get('/api/dog', (req, res, next) => {
  res.json(dogs.first.value)
})

app.delete('/api/dog', (req, res, next) => {
  dogs.dequeue()
  dogs.enqueue(dogsList[Math.floor(Math.random()*(dogsList.length-1))])
  res.json(dogs.first.value)
})

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

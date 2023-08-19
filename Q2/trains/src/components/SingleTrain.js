// src/components/SingleTrain.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

const SingleTrain = () => {
  const { trainNumber } = useParams();
  const [train, setTrain] = useState(null);

  useEffect(() => {
    axios.get(`http://20.244.56.144/train/trains/${trainNumber}`)
      .then(response => setTrain(response.data))
      .catch(error => console.error(error));
  }, [trainNumber]);

  if (!train) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Train Details</h1>
      <Card>
        <CardContent>
          <Typography variant="h6">{train.trainName}</Typography>
          <Typography>Train Number: {train.trainNumber}</Typography>
          {/* Display other train details */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleTrain;

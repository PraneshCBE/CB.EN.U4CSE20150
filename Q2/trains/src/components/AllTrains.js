// src/components/AllTrains.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';

const AllTrains = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('http://20.244.56.144/train/trains')
      .then(response => setTrains(response.data.trains))
      .catch(error => console.error(error));
      console.log("trains",trains);
  }, []);

  return (
    <div>
      <h1>All Trains</h1>
      {trains.map(train => (
        <Card key={train.trainNumber}>
          <CardContent>
            <Typography variant="h6">{train.trainName}</Typography>
            <Typography>Train Number: {train.trainNumber}</Typography>
    
            <Link to={`/train/${train.trainNumber}`}>View Details</Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AllTrains;

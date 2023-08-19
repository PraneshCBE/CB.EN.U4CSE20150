const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

const tokenUrl = "http://20.244.56.144/train/auth";
const tokenPayload = {
    "companyName": "Pranesh Central",
    "clientID": "fde1999a-4d9f-4892-bc61-aafb6cb1680f",
    "clientSecret": "HjfFcQtXovQyXbjA",
    "ownerName": "Pranesh R",
    "ownerEmail": "rvpspran@gmail.com",
    "rollNo": "CB.EN.U4CSE20150"
};

const TrainsUrl = "http://20.244.56.144/train/trains";

app.get('/trains/12hr', async (req, res) => {
    try {
        const tokenResponse = await axios.post(tokenUrl, tokenPayload);
        const token = tokenResponse.data.access_token;
        const TrainsResponse = await axios.get(TrainsUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const Trains = TrainsResponse.data;
        console.log("All Trains:", Trains.length);
        const filteredTrains = [];

        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);
        console.log(currentTime, endTime);
        for (const train of Trains) {
            const departureTime = new Date(currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                train.departureTime.Hours
                , train.departureTime.Minutes,
                train.departureTime.Seconds);

            departureTime.setMinutes(departureTime.getMinutes() + train.delayedBy);

            const timeDiff= (departureTime - currentTime) / (60*1000);

    
            if (timeDiff>=30 &&currentTime <= departureTime && departureTime <= endTime) {
                const pTrain = await axios.get(`${TrainsUrl}/${train.trainNumber}`, { headers: { Authorization: `Bearer ${token}` } });
                const pTrainData = pTrain.data;
                filteredTrains.push({
                    "trainName": train.trainName,
                    "trainNumber": train.trainNumber,
                    "departureTime": departureTime,
                    "seatsAvailable": pTrainData.seatsAvailable,
                    "price": pTrainData.price
                });
            }
        }
        filteredTrains.sort((a, b) => {
            // Sort by price (ascending)
            if (a.price.sleeper !== b.price.sleeper) {
                return (a.price.sleeper - b.price.sleeper) + (a.price.AC - b.price.AC);
            }
        
            // Sort by seats available (descending)
            if (b.seatsAvailable.sleeper !== a.seatsAvailable.sleeper) {
                return (b.seatsAvailable.sleeper - a.seatsAvailable.sleeper)+(b.seatsAvailable.AC - a.seatsAvailable.AC);
            }
        
            // Sort by departure time (descending)
            return b.departureTime - a.departureTime;
        });
        filteredTrains.forEach(train => {
            const departureTime = train.departureTime;
            train.departureTime = {
                "Hours": departureTime.getHours(),
                "Minutes": departureTime.getMinutes(),
                "Seconds": departureTime.getSeconds()
            };});
        console.log(filteredTrains.length)
        res.json(filteredTrains);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server running on port ${port}!`));